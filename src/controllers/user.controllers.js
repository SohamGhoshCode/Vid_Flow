import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessTokenandRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken; //save in the object user
        user.save({ validateBeforeSave: false });

        return {refreshToken,accessToken};

    } catch (error) {
        new ApiError(500,"Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler(async(req,res)=>{ //register user steps->
    //1. get user data from frontend || req.body
    //2. validate the data -> not empty, email format, password strength
    //3. check if user already exists -> email unique, username unique
    //4. check for images , check for avatar
    //5. upload them to cloudinary
    //6. create user object - create entry in db
    //7. remove password and refresh token from response
    //8. check for user creation
    //9. return response

    const {fullName,username,email,password} = req.body; //1
    if(
        [fullName,username,email,password].some((fields) => fields?.trim() === "")//2
    ){
        throw new ApiError(400,"All fields are required");
    }
    const existedUser = await User.findOne({ //3
        $or:[{ email }, { username }]
    });
    if(existedUser){
        throw new ApiError(409,"User already exists with this email or username");//409-conflict
    }
    //console.log("Files received in backend:", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;//4
    //const coverimageLocalPath = req.files?.coverimage[0]?.path;
    let coverimageLocalPath;
    if(req.files  && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0){
        coverimageLocalPath = req.files.coverimage[0].path;
    }
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar image is required");//400-bad request
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);//5
    const coverimage = await uploadOnCloudinary(coverimageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar image is required");//400-bad request
    }

    const user = await User.create({  //6
        fullName,
        avatar : avatar.url,
        coverimage : coverimage?.url || "",
        username : username.toLowerCase(),
        email,
        password
    })
    const createdUser = await User.findById(user._id).select( // 7 here select is select all the fields so for delete -name just like that
        "-password -refreshToken"
    )

    if(!createdUser){ //8
        throw new ApiError(500,"Sonmething went wrong while registering the user"); //500-internal server error cause its not our error
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully") //9
    )

})
// making login user

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessTokenandRefreshToken
    (user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refereshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request (refreshToken)");
    }
    //verify incomingRefreshToken
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id);
    
        if(!user){
            throw new ApiError(401,"Invalid RefreshToken");
        }
    
        if(incomingRefreshToken !== user?.accessToken){
            throw new ApiError(401,"RefreshToken expired or used");
        }
    
        const options = {
            httpOnl: true,
            secure: true
        }
    
        const {accessToken,newRefreshToken} = await generateAccessTokenandRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(new ApiResponse(200,{accessToken,refreshToken:newRefreshToken},"AccessToken Refreshed"))
    
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh Token");
    }
});


const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid Old Password");
    }
    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password Changed Successfully"));
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(200,req.user,"Current User Fetched Successfully");
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullName,email} = req.body;

    if(!fullName || !email){
        throw new ApiError(400,"All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName: fullName,
                email : email // this can be email only
            }
        },
        {new:true}  // info return after the updation
    ).select("-password")
     return res
     .status(200)
     .json(new ApiResponse(200,user,"Account details updated successfully"))

})

const updateUserAvatar = asyncHandler(async (req,res) => {
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing");
    }

    const avatar = uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading Avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar : avatar.url
            }
        },
        {new: true} // return info only after updation
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Avatar updated successfully"))
})

const updateUserCoverImage = asyncHandler(async (req,res) => {
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image file is missing");
    }

    const coverImage = uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading Avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage : coverImage.url
            }
        },
        {new: true} // return info only after updation
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Cover Image updated successfully"))
})


export 
{
    registerUser,
    loginUser,
    logoutUser,
    refereshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
};



//Line	Meaning $or:[{ email }, { username }]	Check if user exists with either field