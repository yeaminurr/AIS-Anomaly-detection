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

const Dashboard = () => {
    const [rawdData,setRawdata] = useState([]);
    const size = useWindowSize();
    const [dataType,setDataType] = useState("Both");
    console.log(size.width);
    console.log(size.height);
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
                    ldate: parseDate(d.ldate) // Replace 'date' with the actual name of your date column in the CSV
                };
            }

        ).then((data) => {
            setRawdata(data)
        });


    }, []);
    const onChange = (value) =>setDataType(value );
    const labels = {
        left: {
            title: "AIS",
            value: "AIS"
        },
        right: {
            title: "Radar",
            value: "Radar"
        },
        center: {
            title: "Both",
            value: "all"
        }
    }


    return(
        <ThemeProvider theme={darkTheme}>

            <Navbar/>
            <Toolbar/>
            <CssBaseline />
            <div style={{position:"relative", transform: 'scale(.8)' , padding:"20px"}}>


            <TripleToggleSwitch  onChange={onChange} labels={labels}/>
                <ToggleButtonGroup
                    color="primary"
                    value={dataType}
                    exclusive
                    onChange={onChange}
                    aria-label="Platform"
                >
                    <ToggleButton value="web">Web</ToggleButton>
                    <ToggleButton value="android">Android</ToggleButton>
                    <ToggleButton value="ios">iOS</ToggleButton>
                </ToggleButtonGroup>


            </div>
<p></p>
        <div style={{textAlign:"center"}}>

            
            
            <LineChart
                device_height={size.height}
                device_width={size.width}
                rawdata = {rawdData}
                dataType = {dataType}
            />
        </div>
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