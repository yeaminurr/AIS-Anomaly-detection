import React, {useContext, useEffect, useRef, useState} from "react";
import App from "../App";
import cluster_data_csv from  "../rawdata/export_data.csv"
import { csv } from "d3";
import Selection from "../Components/VA/Selection";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableItem from "../Components/VA/DragableItem";
import DropZone from '../Components/VA/DropZone';
import Navbar from "../Components/VA/Navbar";
import Toolbar from "@mui/material/Toolbar";
import Radar_Chart from "../Components/VA/Radar_Chart";
import {AppContext} from "../AppContext";
import Classification from "../Components/VA/Classification";


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#161920', // Custom background color for the entire app
            // paper: '#3a3a3a', // Background for Paper components (e.g., Cards)
        },
    },
});
function Clusters(){
    const [cluster_data, setCluster_data] = useState(new Array());
    const size = useWindowSize();
    const [dataType, setdataType] = React.useState('');
    const [droppedItems, setDroppedItems] = useState([]);
    const [selectedData, setSelectedData] = React.useState([]);
    const [currentSelection, setCurrentSelection] = React.useState([]);
    const { selectedMap, setSelectedMap} = useContext(AppContext);
    const [selectedCluster,setSelectedCluster] = useState("Kmeans_cluster");
    const [countPrediction,setCountPrediction] = useState(false);



    useEffect(() => {
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
                    mapped_target_name_shorten: d.mapped_target_name_shorten,
                    BMM_cluster: +d.BMM_cluster

                };
            }

        ).then((data) => {
         setCluster_data(data)
        });


    }, []);
    useEffect(() => {
        console.log(selectedData)
    }, [selectedData]);


    const handleDrop = (item) => {

                setDroppedItems((prevItems) => {
                    // Check if the dropped item is already in the list
                    if (prevItems.includes(item)) {
                        alert("This is already there");
                        console.log("Item already exists:", item.name);
                        return prevItems;  // Return the same array if item is already there
                    } else {
                        const updatedItems = [...prevItems, item];

                        return updatedItems;  // Return the new array with the added item
            }
        });
    };
    useEffect(() => {
        console.log(droppedItems)
    }, [droppedItems]);

    const handleRemove = (item) => {
        // Remove the clicked item from the drop zone
        setDroppedItems((prevItems) => prevItems.filter((i) => i.name !== item.name));
    };

    // useEffect(() => {
    //     console.log("Called Me")
    //     console.log(selectedMap)
    // },[selectedMap])
    const [tempStorage, setTempStorage] = React.useState([]);


    useEffect(() => {
        console.log(tempStorage);
    }, [tempStorage]);
    useEffect(() => {
        const handleStorageChange = () => {
            const updatedData = JSON.parse(localStorage.getItem("selectedMap"));
            setTempStorage(updatedData);
            console.log("Updated selectedMap in Clusters:", updatedData);
            localStorage.removeItem("selectedMap");
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const clusterSelect=(event)=>{
        setSelectedCluster(event.target.value);
    }
    useEffect(() => {
        console.log(selectedCluster);
    }, [selectedCluster]);

    return(
        <ThemeProvider theme={darkTheme}>

            <Navbar/>
            <Toolbar/>
            <CssBaseline />

            <DndProvider backend={HTML5Backend}>
                <div style={{padding: "5px"}}>

                    <div>
                        <div style={{
                            height: "100%",
                            width: "100%",
                            display: "flex"
                        }}>
                            <div>

                                {selectedCluster == "Kmeans_cluster" ?
                                    <h2 className="title">T-SNE Scatter Plot of Vessels in K-Means Clusters</h2> :
                                    <h2 className="title">T-SNE Scatter Plot of Vessels in Bayesian Gaussian Mixture Clusters</h2>}
                                <DropZone
                                    onDrop={handleDrop}
                                    onRemove={handleRemove}
                                    droppedItems={droppedItems}

                                >

                                    <Selection
                                        cluster_data={cluster_data}
                                        device_height={size.height}
                                        device_width={size.width}
                                        dataTypes={droppedItems}
                                        setSelectedData={setSelectedData}
                                        SelectedData={selectedData}
                                        setCurrentSelection={setCurrentSelection}
                                        tempStorage={tempStorage}
                                        selectedCluster={selectedCluster}

                                    />
                                </DropZone>
                            </div>
                            <div style={{paddingTop: "50px", width: size.width * .20}}>
                                <h7>Drag and Drop Boxes to the Left to Visualize Data</h7>

                                <DraggableItem name="AIS Data" height={size.height} width={size.width}/>

                                <DraggableItem name="Radar Data" height={size.height} width={size.width}/>


                                <FormControl
                                    sx={{
                                        width: size.width * .20,
                                        marginLeft: "10px",
                                        marginTop: "10px"
                                    }}
                                >
                                    <InputLabel id="demo-simple-select-label">Cluster</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        //value={age}
                                        label="Cluster"
                                        onChange={clusterSelect}
                                        value={selectedCluster}
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


                        </div>
                    </div>


                    {/*<div>*/}
                    {/*    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>*/}
                    {/*        <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>*/}
                    {/*        <Select*/}
                    {/*            labelId="demo-simple-select-filled-label"*/}
                    {/*            id="demo-simple-select-filled"*/}
                    {/*            value={dataType}*/}
                    {/*            onChange={handleChange}*/}
                    {/*        >*/}
                    {/*            <MenuItem value="">*/}
                    {/*                <em>None</em>*/}
                    {/*            </MenuItem>*/}
                    {/*            <MenuItem value={10}>AIS Data</MenuItem>*/}
                    {/*            <MenuItem value={20}>Radar Data</MenuItem>*/}
                    {/*            <MenuItem value={30}>Both</MenuItem>*/}
                    {/*        </Select>*/}
                    {/*    </FormControl>*/}

                    {/*</div>*/}
                    <div style={{
                        alignContent: "center",
                        justifyContent: "center",
                    }}>
                        <Classification

                            cluster_data={cluster_data}
                            device_height={size.height}
                            device_width={size.width}
                            tempStorage={tempStorage}
                            algorithm = {"gboost"}
                            text = {"Gradient Boosting"}
                            countPrediction = {countPrediction}
                            setCountPrediction = {setCountPrediction}
                        />
                        {countPrediction &&
                            <Classification

                                cluster_data={cluster_data}
                                device_height={size.height}
                                device_width={size.width}
                                tempStorage={tempStorage}
                                algorithm = {"adaboost"}
                                text = {"Ada Boosting"}
                                countPrediction = {countPrediction}
                                setCountPrediction = {setCountPrediction}

                            />
                        }


                    </div>

                    <Radar_Chart
                        selectedData={selectedData}
                        device_height={size.height}
                    />


                </div>
            </DndProvider>
        </ThemeProvider>
    )

}

// Hook
function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
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

export default Clusters;