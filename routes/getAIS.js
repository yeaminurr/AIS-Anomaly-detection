const express = require('express')
const bodyParser = require("body-parser");
const routes = express.Router();
const ais = require("../models/ais")
const radar = require("../models/radar");

let tracksCount = 0;
routes.post("/",async (req, res, next) => {
    let startDate = 1672532840;
    let endDate = 1672615640;
    let confidenceLevel = [0,1];
    let trackLimit = 100;
    console.log(req.body)
    let selectedVessel = [
        0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
        33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
        45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
        57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
        69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
        93, 94, 95, 96, 97, 98, 99
    ]


    if (req.body.trackLimit) trackLimit = parseInt(req.body.trackLimit);
    if (req.body.startDate) startDate = parseInt(req.body.startDate);
    if (req.body.endDate) endDate = parseInt(req.body.endDate);
    if (req.body.confidence) confidenceLevel = req.body.confidence;
    if (req.body.selectedVessel)  selectedVessel = req.body.selectedVessel;
    //console.log(selectedVessel);

    // console.log(startDate);
    // console.log(confidenceLevel[1]);
    console.log("Getting AIS tracks...");
    //console.log(selectedVessel);
    const aispipeline = await ais.aggregate([
        {
            $match: {

                // $and: [
                //     {start_time: {$gte: startDate}},
                //     {end_time: {$lte: endDate}}
                // ],
                "tracks.location.coordinates.0": { $ne: [] },
                "vesselType": { $in: selectedVessel }
                //confidence:{$gte: confidenceLevel[0], $lte:confidenceLevel[1] }


            }
        },
        {
            $project: {
                type: { $literal: "Feature" }, // Adding a static value "Feature" to comply with GeoJSON
                confidence: 1,
                id:1,
                distance: 1,
                avg_speed: 1,
                start_time: 1,
                end_time: 1,
                mmsi: 1,
                vesselName: 1,
                vesselType: 1,
                alert: 1,
                tracks: {
                    $slice: [
                        {
                            $filter: {
                                input: "$tracks",
                                as: "track",
                                cond: {
                                    $and: [
                                        {$gte: ["$$track.time", startDate]},
                                        {$lte: ["$$track.time", endDate]},
                                        {$gte: ["$$track.confidence", confidenceLevel[0]]},
                                        {$lte: ["$$track.confidence", confidenceLevel[1]]}
                                    ]
                                }
                            }
                        }, trackLimit
                    ]
                },
                // hausdorff_distance: {
                //     mmsi:1,
                //     distance:1
                // }
            }
        },

        {
            $addFields: {

                geometry: {
                    type: "LineString",
                    coordinates:{

                        $reduce: {
                            input: "$tracks",
                            initialValue: [],
                            in: {
                                $concatArrays: [
                                    "$$value",
                                    {
                                        $map: {
                                            input: ["$$this.location.coordinates"],
                                            as: "coords",
                                            in: "$$coords"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                confidence: {
                    $arrayElemAt: ["$tracks.confidence", 0] // Assuming tracks is already filtered and sliced.
                }

            }

        },
        {
            $match:{
                "geometry.coordinates": { $ne: [] }
            }
        }


    ]);


    tracksCount = aispipeline.length;
    console.log(tracksCount);
    res.send(aispipeline);


})

routes.post("/mmsi/:mid",async (req, res, next) => {
    let startDate = 1672532840;
    let endDate = 1672615640;
    let confidenceLevel = [0,1];
    let trackLimit = 100;
    //console.log(req.body)
    let mmsi = parseInt(req.params.mid);

    if (req.body.trackLimit) trackLimit = parseInt(req.body.trackLimit);
    if (req.body.startDate) startDate = parseInt(req.body.startDate);
    if (req.body.endDate) endDate = parseInt(req.body.endDate);
    if (req.body.confidence) confidenceLevel = req.body.confidence;
    //let selectedVessel = req.body.selectedVessel;

    // console.log(startDate);
    console.log(mmsi);

    console.log("Getting AIS MMSI ...");
    //console.log(selectedVessel);
    const aispipeline = await ais.aggregate([
        {
            $match: {

                // $and: [
                //     {start_time: {$gte: startDate}},
                //     {end_time: {$lte: endDate}}
                // ],
                "tracks.location.coordinates.0": { $ne: [] },
                //"vesselType": { $in: selectedVessel },
                //confidence:{$gte: confidenceLevel[0], $lte:confidenceLevel[1] }
                "mmsi":mmsi


            }
        },
        {
            $project: {
                type: { $literal: "Feature" }, // Adding a static value "Feature" to comply with GeoJSON
                confidence: 1,
                distance: 1,
                avg_speed: 1,
                start_time: 1,
                end_time: 1,
                mmsi: 1,
                vesselName: 1,
                vesselType: 1,
                alert: 1,
                tracks: {
                    $slice: [
                        {
                            $filter: {
                                input: "$tracks",
                                as: "track",
                                cond: {
                                    $and: [
                                        {$gte: ["$$track.time", startDate]},
                                        {$lte: ["$$track.time", endDate]},
                                        {$gte: ["$$track.confidence", confidenceLevel[0]]},
                                        {$lte: ["$$track.confidence", confidenceLevel[1]]}
                                    ]
                                }
                            }
                        }, trackLimit
                    ]
                },
                // hausdorff_distance: {
                //     mmsi:1,
                //     distance:1
                // }
            }
        },

        {
            $addFields: {

                geometry: {
                    type: "LineString",
                    coordinates:{

                        $reduce: {
                            input: "$tracks",
                            initialValue: [],
                            in: {
                                $concatArrays: [
                                    "$$value",
                                    {
                                        $map: {
                                            input: ["$$this.location.coordinates"],
                                            as: "coords",
                                            in: "$$coords"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }

            }

        },
        {
            $match:{
                "geometry.coordinates": { $ne: [] }
            }
        }


    ]);


    res.send(aispipeline);

})

routes.post("/confidence",async (req, res, next) => {
    let startDate = 1672532840;
    let endDate = 1672615640;
    let confidenceLevel = [0,1];
    let trackLimit = 100;
    console.log(req.body)
    let boundaries = [0, 0.25, 0.50, 0.75, 1];


    if (req.body.trackLimit) trackLimit = parseInt(req.body.trackLimit);
    if (req.body.startDate) startDate = parseInt(req.body.startDate);
    if (req.body.endDate) endDate = parseInt(req.body.endDate);
    if (req.body.confidence) confidenceLevel = req.body.confidence;
    //if (req.body.selectedVessel)  selectedVessel = req.body.selectedVessel;
    //console.log(selectedVessel);

    // console.log(startDate);
    // console.log(confidenceLevel[1]);
    console.log("Getting AIS tracks...");
    //console.log(selectedVessel);
    const aispipeline = await ais.aggregate([
        {
            $match: {

                // $and: [
                //     {start_time: {$gte: startDate}},
                //     {end_time: {$lte: endDate}}
                // ],
                "tracks.location.coordinates.0": { $ne: [] },
                //confidence:{$gte: confidenceLevel[0], $lte:confidenceLevel[1] }


            }
        },
        {
            $project: {
                type: { $literal: "Feature" }, // Adding a static value "Feature" to comply with GeoJSON
                confidence: 1,
                distance: 1,
                avg_speed: 1,
                start_time: 1,
                end_time: 1,
                mmsi: 1,
                vesselName: 1,
                vesselType: 1,
                alert: 1,
                tracks: {
                    $slice: [
                        {
                            $filter: {
                                input: "$tracks",
                                as: "track",
                                cond: {
                                    $and: [
                                        {$gte: ["$$track.time", startDate]},
                                        {$lte: ["$$track.time", endDate]},
                                        {$gte: ["$$track.confidence", confidenceLevel[0]]},
                                        {$lte: ["$$track.confidence", confidenceLevel[1]]}
                                    ]
                                }
                            }
                        }, trackLimit
                    ]
                },
                // hausdorff_distance: {
                //     mmsi:1,
                //     distance:1
                // }
            }
        },

        {
            $addFields: {
                confidence: {
                    $arrayElemAt: ["$tracks.confidence", 0] // Assuming tracks is already filtered and sliced.
                }

            }

        },
        {
            $match:{
                "tracks": { $ne: [] }
            }
        },
        {

            $bucket: {
                groupBy: "$confidence", // Field to group by
                boundaries: boundaries, // Range boundaries for grouping
                default: "Other", // Optional: A bucket for everything that doesn't fit into the specified ranges
                output: {
                    count: { $sum: 1 } ,// Count the documents in each bucket

                }
            }

        },
        {
            $project: {
                _id:0,
                Limit: {
                    $switch: {
                        branches: [
                            { case: { $lt: ["$_id", 0.25] }, then: "0-25" },
                            { case: { $lt: ["$_id", 0.50] }, then: "25-50" },
                            { case: { $lt: ["$_id", 0.75] }, then: "50-75" },
                            { case: { $lt: ["$_id", 1] }, then: "75-100" }
                        ],
                        default: "Other"
                    }
                },
                count: 1,

            }
        }


    ]);
    //let newpipe =  aispipeline;
   // console.log(newpipe.t)
    console.log(aispipeline);
    const expectedRanges = {
        "0-25": 0,
        "25-50": 0,
        "50-75": 0,
        "75-100": 0,
        //"Other": 0
    };
    // aispipeline.foreach(result=>{
    //     console.log(result);
    // });
    for (let i = 0; i < aispipeline.length; i++) {
        if (expectedRanges.hasOwnProperty(aispipeline[i].Limit)) {
            expectedRanges[aispipeline[i].Limit] = aispipeline[i].count;
        }
    }

    console.log(expectedRanges);


    const finalResults = Object.keys(expectedRanges).map(limit => {
        return { Limit: limit, count: expectedRanges[limit] };
    });

    console.log(finalResults);

    res.send(finalResults);

})

routes.get("/trackscount", (req, res, next) => {
    res.send({"AIStracksCount":tracksCount});
})

routes.post("/countbytype", async (req, res, next) => {

    let startDate = 1672532840;
    let endDate = 1672615640;
    let confidenceLevel = [0,1];
    let trackLimit = 100;
    console.log(req.body)
    let boundaries = [0, 0.25, 0.50, 0.75, 1];


    if (req.body.trackLimit) trackLimit = parseInt(req.body.trackLimit);
    if (req.body.startDate) startDate = parseInt(req.body.startDate);
    if (req.body.endDate) endDate = parseInt(req.body.endDate);
    if (req.body.confidence) confidenceLevel = req.body.confidence;
    //if (req.body.selectedVessel)  selectedVessel = req.body.selectedVessel;
    //console.log(selectedVessel);

    // console.log(startDate);
    // console.log(confidenceLevel[1]);
    console.log("Getting AIS tracks type...");

    const vesseTypepipeline = await ais.aggregate([
        {
            $match: {

                // $and: [
                //     {start_time: {$gte: startDate}},
                //     {end_time: {$lte: endDate}}
                // ],
                "tracks.location.coordinates.0": { $ne: [] },
                //confidence:{$gte: confidenceLevel[0], $lte:confidenceLevel[1] }


            }
        },
        {
            $project: {
                type: { $literal: "Feature" }, // Adding a static value "Feature" to comply with GeoJSON
                confidence: 1,
                distance: 1,
                avg_speed: 1,
                start_time: 1,
                end_time: 1,
                mmsi: 1,
                vesselName: 1,
                vesselType: 1,
                alert: 1,
                tracks: {
                    $slice: [
                        {
                            $filter: {
                                input: "$tracks",
                                as: "track",
                                cond: {
                                    $and: [
                                        {$gte: ["$$track.time", startDate]},
                                        {$lte: ["$$track.time", endDate]},
                                        {$gte: ["$$track.confidence", confidenceLevel[0]]},
                                        {$lte: ["$$track.confidence", confidenceLevel[1]]}
                                    ]
                                }
                            }
                        }, trackLimit
                    ]
                },
                // hausdorff_distance: {
                //     mmsi:1,
                //     distance:1
                // }
            }
        },

        {
            $addFields: {
                confidence: {
                    $arrayElemAt: ["$tracks.confidence", 0] // Assuming tracks is already filtered and sliced.
                }

            }

        },
        {
            $match:{
                "tracks": { $ne: [] }
            }
        },
        {
            $group: {
                _id: "$vesselType", // Group by the `item` field
                count: { $sum: 1 } // Count occurrences
            }
        },
        {
            $project: {
                _id: 0, // Exclude this field from the output
                vesselType: "$_id", // Rename `_id` to `item`
                count: 1 // Include the count
            }
        }


    ]);


    res.send(vesseTypepipeline);
})


module.exports=routes;