import React, {useContext, useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import LineChart from "../Components/VA/LineChart";
import Navbar from "../Components/VA/Navbar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import { csv, timeParse } from "d3";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import cluster_data_csv from "../rawdata/export_data.csv";
import TripleToggleSwitch from "../Components/VA/switch/triple";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Circle_Chart from "../Components/VA/Circle_ColorChart";
import Line_Bar from "../Components/VA/Line_Bar"
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Horizon_Bar from "../Components/VA/Horizon_bar_Dashboard";
import LineChart_daily from "../Components/VA/LineChart_dailyavg";


const Dashboard = () => {
    const [rawdData,setRawdata] = useState([]);
    const size = useWindowSize();
    const [dataType,setDataType] = useState("all");
    const [uniqueClusters,setUniqueClusters] = useState([])
    const [selectedCluster,setSelectedCluster] = useState(null)
    const [totalCount,setTotalCount] = useState([])
    const [selectedClusterAlgo,setSelectedClusterAlgo] = useState("Kmeans_cluster");
    const [selected_column,setSelected_column] = useState(null);
    const sizeref = useRef([]);

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#161920', // Custom background color for the entire app
                // paper: '#3a3a3a', // Background for Paper components (e.g., Cards)
            },
        },
    });


    useEffect(() => {

        const parseDate = timeParse("%Y-%m-%d"); // Adjust format as per your CSV date format (e.g., "2023-01-01")

        csv(cluster_data_csv
            , function(d) {
                return {
                    key: +d.key,           // Convert to float
                    min_speed: +d.min_speed,           // Convert to float
                    max_speed: +d.max_speed,           // Convert to float
                    avg_speed: +d.avg_speed,           // Convert to float
                    curviness: +d.curviness,           // Convert to float
                    heading_st: +d.heading_st,         // Convert to float
                    turning_me: +d.turning_me,         // Convert to float
                    circ_mean: +d.circ_mean,           // Convert to float
                    speed_diff: +d.speed_diff,         // Convert to float
                    dist_diff_: +d.dist_diff_,         // Convert to float
                    Kmeans_cluster: +d.Kmeans_cluster, // Convert to integer
                    mapped_target: +d.mapped_target,   // Convert to float
                    mapped_target_name: d.mapped_target_name, // Keep as string (object)
                    tsne1: +d.tsne1,                   // Convert to float
                    tsne2: +d.tsne2,                   // Convert to float
                    source: d.source ,                  // Keep as string (object)     // Keep as string
                    min_speed_s: +d.min_speed_s,                 // Convert to float
                    max_speed_s: +d.max_speed_s,                 // Convert to float
                    avg_speed_s: +d.avg_speed_s,                 // Convert to float
                    curviness_s: +d.curviness_s,                 // Convert to float
                    heading_st_s: +d.heading_st_s,               // Convert to float
                    turning_me_s: +d.turning_me_s,               // Convert to float
                    circ_mean_s: +d.circ_mean_s,                 // Convert to float
                    speed_diff_s: +d.speed_diff_s,               // Convert to float
                    dist_diff__s: +d.dist_diff__s,               // Convert to float

                    // Parse date field using `parseDate`
                    ldate: parseDate(d.ldate), // Replace 'date' with the actual name of your date column in the CSV
                    mapped_target_name_shorten: d.mapped_target_name_shorten,
                    BMM_cluster: +d.BMM_cluster
                };
            }

        ).then((data) => {
            setRawdata(data)
        });



    }, []);

    useEffect(()=>{
        setUniqueClusters(Array.from(new Set(rawdData.map(item => item[selectedClusterAlgo]))));
        setUniqueClusters(prevValue => prevValue.sort())
        console.log(uniqueClusters)
    }
    , [rawdData])

    const onChange = (event, value) =>{
        setDataType(value );}
    const clusterSelect=(event)=>{
        setSelectedCluster(event.target.value);
    }
    const clusterAlgoSelect=(event)=>{
        setSelectedClusterAlgo(event.target.value);
    }

    // useEffect(() => {
    //     if(rawdData.length>0){
    //         var currentArray = [];
    //         if(selectedCluster == null ||selectedCluster=="all"){
    //             setTotalCount([100,100]);
    //             currentArray = [...rawdData];
    //         }
    //         else{
    //             currentArray = rawdData.filter(row =>row.Kmeans_cluster === selectedCluster );
    //         }
    //
    //         currentArray = currentArray.reduce((acc, entry) => {
    //             const source = entry.source;
    //
    //             // If the date already exists in the accumulator, increment the count
    //             if (acc[source]) {
    //                 acc[source].count += 1;
    //             } else {
    //                 // If the date does not exist, initialize it with count 1
    //                 acc[source] = {source: source, count: 1};
    //             }
    //
    //             return acc;
    //         }, {});
    //         const countsArray = Object.values(currentArray);
    //         // Calculate the overall total count by summing all counts across dates
    //         const totalCount = countsArray.reduce((sum, item) => sum + item.count, 0);
    //         // Add percentage calculation for each date entry based on overall total count
    //         countsArray.forEach(item => {
    //             item.percentage = parseFloat(((item.count / totalCount) * 100).toFixed(2)); // Calculate percentage
    //         });
    //         const tempArray = [countsArray.filter(row =>row.source === "AIS" )[0].percentage,countsArray.filter(row =>row.source === "radar" )[0].percentage]
    //         console.log(countsArray.filter(row =>row.source === "AIS" )[0].percentage);
    //         setTotalCount(tempArray);
    //     }
    //
    // }, [rawdData,selectedCluster]);

    useEffect(() => {
        if(rawdData.length>0){
            var currentArray = [];
            var currentallArray = []
            if(selectedCluster == null ||selectedCluster=="all"){
                setTotalCount([100,100]);

            }
            else{
                currentallArray = [...rawdData];
                var totalAIS = currentallArray.filter(row =>row.source === "AIS").length;
                var totalRadar = currentallArray.filter(row =>row.source === "radar").length;
                var currentRadar = currentallArray.filter(row =>row[selectedClusterAlgo] === selectedCluster && row.source === "radar").length;
                var currentAIS = currentallArray.filter(row =>row[selectedClusterAlgo] === selectedCluster && row.source === "AIS").length;
                setTotalCount([(currentAIS/totalAIS)*100,(currentRadar/totalRadar)*100]);



            }



        }

    }, [rawdData,selectedCluster,selectedClusterAlgo]);


    return(
        <ThemeProvider theme={darkTheme}>

            <Navbar/>
            <Toolbar/>
            <CssBaseline/>
            <div style={{
                position: "relative",
                transform: 'scale(1)',
                padding: "20px",
                alignContent: "center",
                justifyContent: "center",
                display: "flex",
            }}>


                {/*<TripleToggleSwitch  onChange={onChange} labels={labels}/>*/}
                <ToggleButtonGroup
                    color="primary"
                    value={dataType}
                    exclusive
                    onChange={onChange}
                    aria-label="Platform"
                >
                    <ToggleButton value="AIS">AIS</ToggleButton>
                    <ToggleButton value="all">Both</ToggleButton>
                    <ToggleButton value="radar">Radar</ToggleButton>

                </ToggleButtonGroup>
                <FormControl
                    sx={{
                        width: "10%",
                        marginLeft: "10px"
                    }}
                >
                    <InputLabel id="demo-simple-select-label">Cluster</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        //value={age}
                        label="Cluster"
                        onChange={clusterSelect}
                    >
                        <MenuItem value={"all"}>
                            All Clusters
                        </MenuItem>
                        {uniqueClusters.map((value) => (
                            <MenuItem value={value}>
                                Cluster {value}
                            </MenuItem>

                        ))}
                        {/*<MenuItem value={10}>Ten</MenuItem>*/}
                        {/*<MenuItem value={20}>Twenty</MenuItem>*/}
                        {/*<MenuItem value={30}>Thirty</MenuItem>*/}
                    </Select>

                </FormControl>

                <FormControl
                    sx={{
                        width: size.width*.20,
                        marginLeft: "10px",
                    }}
                >
                    <InputLabel id="demo-simple-select-label">Cluster Algorithms</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        //value={age}
                        label="Cluster Algorithms"
                        onChange={clusterAlgoSelect}
                        value={selectedClusterAlgo}
                    >
                        <MenuItem value={"Kmeans_cluster"}>
                            KMeans Clustering
                        </MenuItem>
                        <MenuItem value={"BMM_cluster"}>
                            Bayesian Gaussian Mixture
                        </MenuItem>


                    </Select>
                </FormControl>


            </div>
            <p></p>
            <div style={{textAlign: "center"}}>


                <LineChart
                    device_height={size.height}
                    device_width={size.width}
                    rawdata={rawdData}
                    dataType={dataType}
                    selectedCluster={selectedCluster}
                    selectedClusterAlgo={ selectedClusterAlgo}
                />
                <Circle_Chart
                    device_height={size.height}
                    device_width={size.width}
                    selectedCluster={selectedCluster}
                    rawdata={rawdData}
                    selectedClusterAlgo={ selectedClusterAlgo}
                />

                <div style={{justifyContent: "center",
                    display: "flex",
                }}>
                <Stack
                    direction="row"
                    sx={{ flexWrap: 'wrap' }}
                    divider={<Divider orientation="vertical" style={{borderInlineWidth:"1px", borderColor:"#FFFFFF"}} flexItem />}
                    spacing={15}
                >

                        <Stack
                            direction="row"
                            spacing={2}
                        >
                            <Line_Bar line={["AIS", parseInt(totalCount[0])]}
                                      device_height={size.height}
                                      device_width={size.width}
                                      selectedClusterAlgo={ selectedClusterAlgo}/>
                            <Line_Bar line={["Radar", parseInt(totalCount[1])]}
                                      device_height={size.height}
                                      device_width={size.width}
                                      selectedClusterAlgo={ selectedClusterAlgo}/>
                        </Stack>
                    <Horizon_Bar
                        device_height={size.height}
                        device_width={size.width}
                        rawdata = {rawdData}
                        selectedCluster={selectedCluster}
                        selectedClusterAlgo={ selectedClusterAlgo}
                        setSelected_column = {setSelected_column}
                        sizeref={sizeref}
                    />



                </Stack>



                </div>
                <div style={{justifyContent: "center",
                    display: "flex",marginTop: "10px"
                }}>
                    <LineChart_daily
                        selected_column = {selected_column}
                        device_height={size.height}
                        device_width={size.width}
                        rawdata={rawdData}
                        selectedCluster={selectedCluster}
                        selectedClusterAlgo={ selectedClusterAlgo}

                    />

                </div>



            </div>
            {/*<div id="linebar">*/}


            {/*    <Line_Bar line={["rarely evaluate", 22]}*/}
            {/*              device_height={size.height}*/}
            {/*              device_width={size.width}/>*/}

            {/*</div>*/}


        </ThemeProvider>
    )
}


function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {

        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);

    }, []);

    return windowSize;
}

export default Dashboard;