const mongoose = require("mongoose");
const { Schema } = mongoose;
// const turf = require("@turf/turf");

const aisSchema = new Schema(
    {
        mmsi: Number,
        vesselName: String,
        imo: String,
        vesselType: Number,
        confidence:Number,
        size: {
            length: Number,
            width: Number,
        },

        tracks: [
            {
                time: {
                    type: Number,
                    index: true,
                },
                location: {
                    type: {
                        type: String,
                        enum: ["Point"],
                    },
                    coordinates: [Number],
                },
                sog: Number,
                cog: Number,
                heading: Number,
                status: Number,
            },
        ],
    },
    { collection: "nova_ais_2" }
);

aisSchema.index({ "tracks.location": "2dsphere" });

// aisSchema.virtual("route").get(function (startDate, endDate, simplify) {
//     const filteredTracks = this.tracks.filter((track) => {
//         return track.time >= startDate && track.time <= endDate;
//     });
//
//     const points = filteredTracks.map((track) => [
//         track.location.coordinates[0],
//         track.location.coordinates[1],
//     ]);
//
//     const lineString = turf.lineString(points);
//     const feature = turf.feature(lineString.geometry);
//     const simplified = turf.simplify(feature, { tolerance: simplify });
//
//     return simplified.geometry;
// });

module.exports = mongoose.model("ais", aisSchema,"ais");
