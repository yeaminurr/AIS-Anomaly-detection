const express = require('express')
const bodyParser = require("body-parser");
const routes = express.Router();
const fs = require('fs');
const radar = require("../models/radar")
const ais = require("../models/ais")
let tracksCount = 0;
let total_haursdoff = 0;
//const data = require('../data/26_2023_01_tracks_radar.json')
var data = 0;
let parsedData;
//import dayjs from 'dayjs';

// fs.readFile('26_2023_01_tracks_radar.json', 'utf8', (err, data) => {
//     if (err) {
//         console.error("Error reading file:", err);
//     }
//     parsedData = JSON.parse(data);
//     //console.log(data)
// })




//server.use(bodyParser.urlencoded({ extended: false }));
// routes.get('/',(req,res,next)=>{
//     //console.log(req.query);
//     console.log("accessed")
//     const { startDate, endDate } = req.query;
//     const start = new Date(startDate);
//     const end = new Date(endDate) ;
//
//     console.log(start);
//     console.log(end);
//     var dates  = req.query;
//     const filteredData = parsedData.features.filter(item => {
//         const itemDateTimeStr = `${item.properties.sdate} ${item.properties.stime}`;
//         //console.log(itemDateTimeStr)
//         const itemDate = new Date(itemDateTimeStr);
//         return itemDate >= start && itemDate <= end;
//     });
//     res.json(filteredData);
// });



routes.post('/mongo',async (req, res, next) => {

    //const { startDate, endDate } = req.query;
    // const start = new Date(startDate);
    // const end = new Date(endDate);
    // console.log(start);
    // console.log(end);

    let startDate = 1672532840;
    let endDate = 1672615640;
    let confidenceLevel = [0,1];
    let trackLimit = 100;
    let haursdoff = 0.01;
    let temporal_prediction = false;
    let temporal_prediction_start= 0;
    let temporal_prediction_end = 0;
    haursdoff = .01;
    console.log(req.body)



    if (req.body.trackLimit) trackLimit = parseInt(req.body.trackLimit);
    if (req.body.startDate) startDate = parseInt(req.body.startDate);
    if (req.body.endDate) endDate = parseInt(req.body.endDate);
    if (req.body.confidence) confidenceLevel = req.body.confidence;
    if (req.body.haursdoff) haursdoff = parseFloat(req.body.haursdoff);
    if (req.body.temporal_prediction) temporal_prediction = (req.body.temporal_prediction.toLowerCase()=== "true");
    if (req.body.temporal_prediction_start) temporal_prediction_start = parseInt(req.body.temporal_prediction_start);
    if (req.body.temporal_prediction_end) temporal_prediction_end = parseInt(req.body.temporal_prediction_end);

    // const aisdata = await ais.aggregate([
    //     {
    //         $match: {
    //
    //             // $and: [
    //             //     {start_time: {$gte: startDate}},
    //             //     {end_time: {$lte: endDate}}
    //             // ],
    //             "tracks.location.coordinates.0": { $ne: [] }
    //             //"vesselType": { $in: selectedVessel }
    //             //confidence:{$gte: confidenceLevel[0], $lte:confidenceLevel[1] }
    //
    //
    //         }
    //     },
    //
    //     {
    //         $project: {
    //             type: { $literal: "Feature" }, // Adding a static value "Feature" to comply with GeoJSON
    //             // confidence: 1,
    //             // distance: 1,
    //             // avg_speed: 1,
    //             // start_time: 1,
    //             // end_time: 1,
    //             mmsi: 1,
    //             // vesselName: 1,
    //             // vesselType: 1,
    //             // alert: 1,
    //
    //             tracks: {
    //                 $slice: [
    //                     {
    //                         $filter: {
    //                             input: "$tracks",
    //                             as: "track",
    //                             cond: {
    //                                 $and: [
    //                                     {$gte: ["$$track.time", startDate]},
    //                                     {$lte: ["$$track.time", endDate]},
    //                                     // {$gte: ["$$track.confidence", confidenceLevel[0]]},
    //                                     // {$lte: ["$$track.confidence", confidenceLevel[1]]}
    //                                 ]
    //                             }
    //                         }
    //                     }, trackLimit
    //                 ]
    //             },
    //
    //         }
    //     },
    //     {
    //         $addFields: {
    //
    //             geometry: {
    //                 type: "LineString",
    //                 coordinates:{
    //
    //                     $reduce: {
    //                         input: "$tracks",
    //                         initialValue: [],
    //                         in: {
    //                             $concatArrays: [
    //                                 "$$value",
    //                                 {
    //                                     $map: {
    //                                         input: ["$$this.location.coordinates"],
    //                                         as: "coords",
    //                                         in: "$$coords"
    //                                     }
    //                                 }
    //                             ]
    //                         }
    //                     }
    //                 }
    //             },
    //             confidence: {
    //                 $arrayElemAt: ["$tracks.confidence", 0] // Assuming tracks is already filtered and sliced.
    //             },
    //             "tracks": {
    //                 $map: {
    //                     input: "$tracks",
    //                     as: "track",
    //                     in: {
    //                         $mergeObjects: [
    //                             "$$track",
    //                             {
    //                                 coordinates: "$$track.location.coordinates" // Assign the coordinates from location
    //                             }
    //                         ]
    //                     }
    //                 }
    //             }
    //
    //
    //         },
    //
    //
    //     },
    //     {
    //         $match:{
    //             "geometry.coordinates": { $ne: [] }
    //         }
    //     },
    //
    //
    //
    //     {
    //         $project:{
    //             mmsi: 1,
    //             "tracks.time": 1,
    //             //"tracks.location": 0,
    //             // Excluding specific sub-fields from the tracks array
    //             "tracks.coordinates":1
    //
    //
    //
    //
    //         }
    //     }
    //
    //
    // ]);



    console.log("Getting radar tracks...");
    console.log(confidenceLevel);
    confidenceLevel[0]= parseFloat(confidenceLevel[0])
    confidenceLevel[1]= parseFloat(confidenceLevel[1])
    const radarpipeline = await radar.aggregate([
        {
            $match: {

                $and: [
                    {start_time: {$gte: startDate}},
                    {end_time: {$lte: endDate}}
                ],
                "tracks.location.coordinates.0": { $ne: [] },
                confidence:{$gte: confidenceLevel[0], $lte:confidenceLevel[1] },



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
                                        {$lte: ["$$track.time", endDate]}
                                    ]
                                }
                            }
                        }, trackLimit
                    ]
                },
                hausdorff_distance: {
                    mmsi:1,
                    distance:1
                },

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
                ,
                hausdorff_distance: {
                    $cond: {
                        if: { $gt: ["$hausdorff_distance.distance", haursdoff] },
                        then: { mmsi: 0, distance: 0 },
                        else: "$hausdorff_distance"
                    }
                }

            }

        }
        ,
        {
            $match:{
                "geometry.coordinates": { $ne: [] }
            }
        }
        ,
        {
            $lookup: {
                from: "ais", // Assuming this is the collection name for aisSchema
                localField: "hausdorff_distance.mmsi",
                foreignField: "mmsi",
                as: "aisData"
            }
        },
        {
            $unwind: {
                path: "$aisData",
                preserveNullAndEmptyArrays: true // If you want to keep documents that do not match any document from the nova_ais_2 collection
            }
        },
        {
            $addFields: {

                vesselName: {
                    $cond: {
                        if: {$eq: ["$hausdorff_distance.mmsi", 0]},
                        then: "Unidentified",
                        else: "$aisData.vesselName"
                    }
                    //vesselName: "$aisData.vesselName"
                },
                vesselType: {
                    $cond: {
                        if: {$eq: ["$hausdorff_distance.mmsi", 0]},
                        then: "0",
                        else: "$aisData.vesselType"
                    }
                    //vesselName: "$aisData.vesselName"
                }
                ,
                dynamic_start_time:  {$arrayElemAt: ["$tracks.time", 0]},
                dynamic_end_time:  {$arrayElemAt: ["$tracks.time", -1]}

            }
        }
        ,
        {
            $project:
                {
                    aisData:0
                }
        }


    ]);

    if(temporal_prediction){
        total_haursdoff = 0;
        const aisdata = await ais.aggregate([
            {
                $match: {

                    // $and: [
                    //     {start_time: {$gte: startDate}},
                    //     {end_time: {$lte: endDate}}
                    // ],
                    "tracks.location.coordinates.0": { $ne: [] }
                    //"vesselType": { $in: selectedVessel }
                    //confidence:{$gte: confidenceLevel[0], $lte:confidenceLevel[1] }


                }
            },

            {
                $project: {
                    type: { $literal: "Feature" }, // Adding a static value "Feature" to comply with GeoJSON
                    // confidence: 1,
                    // distance: 1,
                    // avg_speed: 1,
                    // start_time: 1,
                    // end_time: 1,
                    mmsi: 1,
                    vesselName: 1,
                    vesselType: 1,
                    // alert: 1,

                    tracks: {
                        $slice: [
                            {
                                $filter: {
                                    input: "$tracks",
                                    as: "track",
                                    cond: {
                                        $and: [
                                            {$gte: ["$$track.time", (startDate+(temporal_prediction_start*60))]},
                                            {$lte: ["$$track.time", (endDate+(temporal_prediction_end*60))]},
                                            // {$gte: ["$$track.confidence", confidenceLevel[0]]},
                                            // {$lte: ["$$track.confidence", confidenceLevel[1]]}
                                        ]
                                    }
                                }
                            }, trackLimit
                        ]
                    },

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
                    },
                    "tracks": {
                        $map: {
                            input: "$tracks",
                            as: "track",
                            in: {
                                $mergeObjects: [
                                    "$$track",
                                    {
                                        coordinates: "$$track.location.coordinates" // Assign the coordinates from location
                                    }
                                ]
                            }
                        }
                    }


                },


            },
            {
                $match:{
                    "geometry.coordinates": { $ne: [] }
                }
            },



            {
                $project:{
                    mmsi: 1,
                    "tracks.time": 1,
                    //"tracks.location": 0,
                    // Excluding specific sub-fields from the tracks array
                    "tracks.coordinates":1,
                    vesselName: 1,
                    vesselType:1




                }
            }


        ]);
        radarpipeline.forEach((data)=>{
            let start_time = data["dynamic_start_time"]
            let end_time =  data["dynamic_end_time"]
            let coordinates = data["geometry"]["coordinates"]
            let distancealgo = calculation(start_time+(temporal_prediction_start*60),end_time+(temporal_prediction_end*60),aisdata,data["geometry"]["coordinates"])
            data["hausdorff_distance"] =distancealgo
            data["vesselName"] = distancealgo["vesselName"]
            data["vesselType"] = distancealgo["vesselType"]

            total_haursdoff = total_haursdoff+distancealgo["distance"]




            //console.log(distancealgo)

        })
         function calculation (start_time,end_time,aisdata2,coordinates) {
            // JavaScript function body here
            //console.log(hausdorff_distance)
            let mmsi = 0
            let vesselType = 0
            let vesselName = "Unidentified"
            let hdistance = 1000000000
             let ais_first = 0
             let ais_last = 0
            const deepcopyAisdata = JSON.parse(JSON.stringify(aisdata2));


            let filteredData = deepcopyAisdata.filter(document => {
                var onlycoordinates = []
                // Filter tracks within the specified time range
                const validTracks = document.tracks.filter(track => track.time > start_time && track.time < end_time);

                // Replace the document's tracks with only those that are valid
                document.tracks = validTracks;
                validTracks.forEach((data)=>{
                    onlycoordinates.push(data["coordinates"])
                })

                document.coordinates = onlycoordinates;

                // Keep the document only if there are any valid tracks
                return validTracks.length > 0;

            });
            //console.log(filteredData["tracks"]);

            function euclideanDistance(point1, point2) {
                return Math.sqrt(
                    Math.pow(point2[0] - point1[0], 2) +
                    Math.pow(point2[1] - point1[1], 2)
                );
            }
            function directedHausdorffDistance(coords1, coords2) {
                let maxMinDistance = 0;
                coords1.forEach(point1 => {
                    let minDistance = Infinity;
                    coords2.forEach(point2 => {
                        const distance = euclideanDistance(point1, point2);
                        if (distance < minDistance) {
                            minDistance = distance;
                        }
                    });
                    if (minDistance > maxMinDistance) {
                        maxMinDistance = minDistance;
                    }
                });
                return maxMinDistance;
            }
            function hausdorffDistance(coords1, coords2) {
                const distance1to2 = directedHausdorffDistance(coords1, coords2);
                const distance2to1 = directedHausdorffDistance(coords2, coords1);
                return Math.max(distance1to2, distance2to1);
            }


            filteredData.forEach((data)=>{
                let haursdoffd = hausdorffDistance(coordinates,data.coordinates)
                if(haursdoffd<hdistance){
                    hdistance = haursdoffd
                    mmsi = data.mmsi
                    vesselName = data.vesselName
                    vesselType = data.vesselType
                    ais_first = data["tracks"][0];
                    ais_last = data["tracks"].slice(-1)[0];

                }


            })


            return {"distance":hdistance,"mmsi":mmsi,"vesselName":vesselName,"vesselType":vesselType,"ais_first":ais_first,"ais_last":ais_last}; // Example calculation
        }

    }

    tracksCount = radarpipeline.length;
    res.send(radarpipeline);


    //res.json({hello: "hello"});
});

routes.post("/confidence",async (req, res, next)=>{
    let boundaries = [0, 0.25, 0.50, 0.75, 1];

    let startDate = 1672532840;
    let endDate = 1672615640;
    let confidenceLevel = [0,1];
    let trackLimit = 100;
    //console.log(req.body)

    if (req.body.trackLimit) trackLimit = parseInt(req.body.trackLimit);
    if (req.body.startDate) startDate = parseInt(req.body.startDate);
    if (req.body.endDate) endDate = parseInt(req.body.endDate);
    if (req.body.confidence) confidenceLevel = req.body.confidence;
    if (req.body.boundaries) boundaries = req.body.boundaries;

    console.log("Getting radar boundaries...");

    const confidenceBar = await radar.aggregate([

        {
            $match: {

                $and: [
                    {start_time: {$gte: startDate}},
                    {end_time: {$lte: endDate}}
                ],
                "tracks.location.coordinates.0": { $ne: [] },
                confidence:{$gte: confidenceLevel[0], $lte:confidenceLevel[1] }


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
                                        {$lte: ["$$track.time", endDate]}
                                    ]
                                }
                            }
                        }, trackLimit
                    ]
                },

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

    //console.log(aispipeline);
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
    for (let i = 0; i < confidenceBar.length; i++) {
        if (expectedRanges.hasOwnProperty(confidenceBar[i].Limit)) {
            expectedRanges[confidenceBar[i].Limit] = confidenceBar[i].count;
        }
    }

    console.log(expectedRanges);


    const finalResults = Object.keys(expectedRanges).map(limit => {
        return { Limit: limit, count: expectedRanges[limit] };
    });

    console.log(finalResults);

    res.send(finalResults);
})

routes.post('/mmsi/:mid',async (req,res,next)=>{
    console.log("hello");
    //res.json({hello:"hello"});
    let startDate = 1672532840;
    let endDate = 1672615640;
    let confidenceLevel = [0,1];
    let trackLimit = 100;
    //console.log(req.body)
    let mmsi = parseInt(req.params.mid);
    let haursdoff = 0.01;

    if (req.body.trackLimit) trackLimit = parseInt(req.body.trackLimit);
    if (req.body.startDate) startDate = parseInt(req.body.startDate);
    if (req.body.endDate) endDate = parseInt(req.body.endDate);
    if (req.body.confidence) confidenceLevel = req.body.confidence;
    if (req.body.haursdoff) haursdoff = parseFloat(req.body.haursdoff);

    // console.log(startDate);
    // console.log(confidenceLevel[1]);
    console.log(mmsi);
    console.log("Getting mmsi tracks...");
    const mmsiPipeline = await radar.aggregate([
        {
            $match: {

                // $and: [
                //     {start_time: {$gte: startDate}},
                //     {end_time: {$lte: endDate}}
                // ],
                "tracks.location.coordinates.0": { $ne: [] },
                confidence:{$gte: confidenceLevel[0], $lte:confidenceLevel[1] },




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
                                        {$lte: ["$$track.time", endDate]}
                                    ]
                                }
                            }
                        }, trackLimit
                    ]
                },
                hausdorff_distance: {
                    mmsi:1,
                    distance:1
                }
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
                ,
                hausdorff_distance: {
                    $cond: {
                        if: { $gt: ["$hausdorff_distance.distance", haursdoff] },
                        then: { mmsi: 0, distance: 0 },
                        else: "$hausdorff_distance"
                    }
                }

            }

        },
        {
            $match:{
                "geometry.coordinates": { $ne: [] },
                "hausdorff_distance.mmsi" : mmsi
            }
        }


    ]);


    res.send(mmsiPipeline);


});

routes.post("/countbytype", async (req, res, next) =>{


    let startDate = 1672532840;
    let endDate = 1672615640;
    let confidenceLevel = [0,1];
    let trackLimit = 100;
    //console.log(req.body)

    if (req.body.trackLimit) trackLimit = parseInt(req.body.trackLimit);
    if (req.body.startDate) startDate = parseInt(req.body.startDate);
    if (req.body.endDate) endDate = parseInt(req.body.endDate);
    if (req.body.confidence) confidenceLevel = req.body.confidence;
    if (req.body.boundaries) boundaries = req.body.boundaries;

    console.log("Getting radar boundaries...");

    const typePipeline = await radar.aggregate([

        {
            $match: {

                $and: [
                    {start_time: {$gte: startDate}},
                    {end_time: {$lte: endDate}}
                ],
                "tracks.location.coordinates.0": { $ne: [] },
                confidence:{$gte: confidenceLevel[0], $lte:confidenceLevel[1] }


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
                                        {$lte: ["$$track.time", endDate]}
                                    ]
                                }
                            }
                        }, trackLimit
                    ]
                },
                hausdorff_distance: {
                    mmsi:1,
                    distance:1
                }

            }
        },
        {
            $addFields:{
                hausdorff_distance: {
                    $cond: {
                        if: { $gt: ["$hausdorff_distance.distance", 0.01] },
                        then: { mmsi: 0, distance: 0 },
                        else: "$hausdorff_distance"
                    }
                }


            }
        },

        {
            $lookup: {
                from: "ais", // Assuming this is the collection name for aisSchema
                localField: "hausdorff_distance.mmsi",
                foreignField: "mmsi",
                as: "aisData"
            }
        },
        {
            $unwind: {
                path: "$aisData",
                preserveNullAndEmptyArrays: true // If you want to keep documents that do not match any document from the nova_ais_2 collection
            }
        },
        {
            $addFields: {

                vesselName: {
                    $cond: {
                        if: {$eq: ["$hausdorff_distance.mmsi", 0]},
                        then: "Unidentified",
                        else: "$aisData.vesselName"
                    }
                    //vesselName: "$aisData.vesselName"
                },
                vesselType: {
                    $cond: {
                        if: {$eq: ["$hausdorff_distance.mmsi", 0]},
                        then: "0",
                        else: "$aisData.vesselType"
                    }
                    //vesselName: "$aisData.vesselName"
                }

            }
        }
        ,
        {
            $project:
                {
                    aisData:0
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
    res.send(typePipeline);

})

routes.post("/totaltrajectory", async (req, res, next)=>{
    res.json({"total_trajectories":tracksCount,"total_distance":total_haursdoff})
})
module.exports=routes;