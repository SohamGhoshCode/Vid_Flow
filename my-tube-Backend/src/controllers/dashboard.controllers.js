import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import { Subscription } from "../models/subcription.model.js";
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id

    // Get total videos
    const totalVideos = await Video.countDocuments({ owner: channelId })

    // Get total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId })

    // Get total views
    const totalViewsResult = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(channelId) }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ])

    const totalViews = totalViewsResult[0]?.totalViews || 0

    // Get total likes on all videos
    const totalLikesResult = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(channelId) }
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
            $unwind: "$likes"
        },
        {
            $count: "totalLikes"
        }
    ])

    const totalLikes = totalLikesResult[0]?.totalLikes || 0

    // Get video stats
    const videoStats = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(channelId) }
        },
        {
            $project: {
                title: 1,
                views: 1,
                likesCount: 1,
                createdAt: 1,
                isPublished: 1
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $limit: 10
        }
    ])

    const stats = {
        totalVideos,
        totalSubscribers,
        totalViews,
        totalLikes,
        recentVideos: videoStats
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, stats, "Channel stats fetched successfully")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id

    const videos = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(channelId) }
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
                }
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                thumbnail: 1,
                views: 1,
                duration: 1,
                isPublished: 1,
                createdAt: 1,
                likesCount: 1
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
}