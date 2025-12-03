import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subcription.model.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    if (channelId.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself")
    }

    const channel = await User.findById(channelId)

    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if (existingSubscription) {
        // Unsubscribe
        await Subscription.findByIdAndDelete(existingSubscription._id)
        
        return res
        .status(200)
        .json(
            new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully")
        )
    } else {
        // Subscribe
        const subscription = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })

        return res
        .status(200)
        .json(
            new ApiResponse(200, { subscribed: true }, "Subscribed successfully")
        )
    }
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
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
                subscriber: {
                    $first: "$subscriber"
                }
            }
        },
        {
            $project: {
                _id: 0,
                subscriber: 1,
                subscribedAt: "$createdAt"
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                subscribers,
                count: subscribers.length
            },
            "Subscribers fetched successfully"
        )
    )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }

    const subscriptions = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [
                    {
                        $lookup: {
                            from: "videos",
                            localField: "_id",
                            foreignField: "owner",
                            as: "videos",
                            pipeline: [
                                {
                                    $match: {
                                        isPublished: true
                                    }
                                },
                                {
                                    $sort: {
                                        createdAt: -1
                                    }
                                },
                                {
                                    $limit: 1
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            latestVideo: {
                                $arrayElemAt: ["$videos", 0]
                            }
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                            latestVideo: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                channel: {
                    $first: "$channel"
                }
            }
        },
        {
            $project: {
                _id: 0,
                channel: 1,
                subscribedAt: "$createdAt"
            }
        },
        {
            $sort: {
                subscribedAt: -1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                subscriptions,
                count: subscriptions.length
            },
            "Subscribed channels fetched successfully"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}