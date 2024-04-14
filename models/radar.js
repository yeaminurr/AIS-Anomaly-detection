const mongoose = require("mongoose");
const { Schema } = mongoose;
const radarOptimizedSchema = new Schema(
    {
        confidence: Number,
        distance: Number,
        avg_speed: Number,
        start_time: Number,
        end_time: Number,
        mmsi: Number,
        vesselName: String,
        vesselType: Number,
        alert: Number,

        tracks: [
            {
                time: {
                    type: Number,
                    index: true,
                },
                location: {
                    type: {
                        type: String,
                        enum: ["point"],
                    },
                    coordinates: [Number],
                }
            },
        ],
        hausdorff_distance:{
            mmsi:Number,
            distance:Number
        }
    }
);

module.exports = mongoose.model("radar", radarOptimizedSchema,"radar");