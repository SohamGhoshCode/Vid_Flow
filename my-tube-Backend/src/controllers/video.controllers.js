import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { deleteFromCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query
    
    const pipeline = []

    // Match stage for query
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            }
        })
    }

    // Match by user if provided
    if (userId && isValidObjectId(userId)) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }

    // Only show published videos
    pipeline.push({
        $match: {
            isPublished: true
        }
    })

    // Lookup owner details
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
                {
                    $project: {
                        username: 1,
                        fullName: 1,
                        avatar: 1
                    }
                }
            ]
        }
    })

    pipeline.push({
        $addFields: {
            owner: {
                $first: "$owner"
            }
        }
    })

    // Sort
    pipeline.push({
        $sort: {
            [sortBy]: sortType === 'desc' ? -1 : 1
        }
    })

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), options)

    return res
    .status(200)
    .json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoFileLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required")
    }

    // Upload video to cloudinary
    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) {
        throw new ApiError(400, "Video file upload failed")
    }

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail upload failed")
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration,
        owner: req.user._id
    })

    const createdVideo = await Video.findById(video._id)

    if (!createdVideo) {
        throw new ApiError(500, "Failed to publish video")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, createdVideo, "Video published successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                isLiked: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$likes.likedBy"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                likes: 0
            }
        }
    ])

    if (!video || video.length === 0) {
        throw new ApiError(404, "Video not found")
    }

    // Increment views
    await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, video[0], "Video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    if (!title && !description && !req.file) {
        throw new ApiError(400, "At least one field is required to update")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if user owns the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video")
    }

    const updateFields = {}
    
    if (title) updateFields.title = title
    if (description) updateFields.description = description

    // Handle thumbnail update
    if (req.file) {
        const thumbnailLocalPath = req.file.path
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        
        if (!thumbnail) {
            throw new ApiError(400, "Thumbnail upload failed")
        }

        // Delete old thumbnail from cloudinary
        // await deleteFromCloudinary(video.thumbnail)
        
        updateFields.thumbnail = thumbnail.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateFields
        },
        { new: true }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if user owns the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video")
    }

    // Delete from cloudinary
    // await deleteFromCloudinary(video.videoFile)
    // await deleteFromCloudinary(video.thumbnail)

    await Video.findByIdAndDelete(videoId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if user owns the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        { new: true }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            updatedVideo, 
            `Video ${updatedVideo.isPublished ? 'published' : 'unpublished'} successfully`
        )
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}