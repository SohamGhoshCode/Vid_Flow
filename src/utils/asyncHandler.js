const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
};

export { asyncHandler };


// const asyncHandler = () => {}   steps
// const asyncHandler = () => {()=>{}}
// const asyncHandler = () => async() =>{ }

// const asyncHandler = (fn) => async(req,res,next) => { // sort of middleware
//     try {
//         await fn(req,res,next)
//     } catch (error) { 
//         res.status(error.code || 500).json({         this is done by try-catch
//             success: false,
//             message: error.message
//         })
//     }
// }