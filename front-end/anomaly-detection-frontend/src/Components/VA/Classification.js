import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import * as ort from 'onnxruntime-web';
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {Container, LinearProgress} from "@mui/material";


const Classification = (props) =>{
    const [showPrediction, setShowPrediction] = useState(false);
    const [data,setData] = useState([]);
    const [predictionData,setPredictionData] = useState([]);
    const chartRefbar = useRef(null);
    const svg = useRef(null);
    const [showPredictionChart, setShowPredictionChart] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAIS,setShowAIS] = useState(false);
    const [aisType,setAisType] = useState("");




    useEffect(() => {
        console.log(props.tempStorage);
        if(props.tempStorage &&props.tempStorage[0]){
        setData(props.cluster_data.filter(d => d.key ===  props.tempStorage[0]));

        }
      // Array of IDs you want to "click"

    }, [props.tempStorage]);
    useEffect(() => {
        if(data && data[0]){
        console.log(data)
        if(data[0].source == "radar"){

            setShowPrediction(true);
            setShowPredictionChart(false)
            setShowAIS(false)
            console.log("showing prediction");
            props.setCountPrediction(true)
        }
        else {
            setShowPrediction(false);
            setShowPredictionChart(false)
            setShowAIS(true);
            //var dataType= data[0].mapped_target_name_shorten
            setAisType(getSources(data[0].mapped_target_name_shorten))
            props.setCountPrediction(false)

        }
        }
    }, [data]);

    function getSources(name) {
        if (name === 'Cargo Ships') {
            return 'Cargo Ships';
        } else if (name === 'Support and Utility Vessels' || name === 'Military ops') {
            return 'Support, Utility, and Military Vessels';
        } else if (name === 'Passenger and Recreational' || name === 'Others') {
            return 'Passenger, Recreational, and Others';
        } else {
            return null; // Handle unexpected values or -1
        }
    }


    function doPrediction() {
        setLoading(true);
        const prediction_data=[
            data[0].min_speed_s,
            data[0].max_speed_s,
            data[0].curviness_s,
            data[0].heading_st_s,
            data[0].turning_me_s,
            data[0].circ_mean_s,
            data[0].speed_diff_s,
            data[0].dist_diff__s
        ]
        console.log(prediction_data)
        var selectedAlgo = props.algorithm
        fetch(`http://localhost:5001/predict`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "features": prediction_data,
                "algorithm":selectedAlgo
            })

        }).then((response) => response.json())
            .then((data) =>{
                setLoading(false);
                //console.log(data);

                setPredictionData(data)
                setShowPredictionChart(true);
                //console.log(data[0])
                //startDate.current = endDate.current = null;

            })



    }




    useEffect(() => {
        if(showPredictionChart){
        var plotdata = predictionData.probabilities
            console.log(plotdata)
            plotdata= Object.fromEntries(
                Object.entries(plotdata).map(([key, value]) => [key, (value * 100).toFixed(2)])
            );
        console.log(plotdata)



        const plotdataMain= Object.entries(plotdata)


        // set the dimensions and margins of the graph;
        const margin = {top: 26.66, right: 320.66, bottom: 26.66, left: 26.66}
        const  height = props.device_height - (props.device_height * .70) - margin.top - margin.bottom;
        const width = props.device_width - (props.device_width * .70) - margin.left-margin.right;

        d3.select(chartRefbar.current).select("svg").remove();



        //console.log(size.current)
// append the svg object to the body of the page
        svg.current = d3.select(chartRefbar.current)
            .append("svg")
            .attr("class","horizontal_bar")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height+ margin.top + margin.bottom)
            .append("g")
            .attr("transform", 'translate('+margin.left+', '+margin.top+')');



        // Add X axis
        // Combine values from both objects into one array


        //const maxX = Math.max(...allValues);

        const x = d3.scaleLinear()
            .domain([0, 100])
            .range([ 0, width]);




        const y = d3.scaleBand()
            .domain((plotdataMain.map(d => d[0])))
            .range([ 0, height]).padding(0.2);



        // svg.append("g")
        //     .call(d3.axisLeft(y));


        // Mainbar
        //for transition modified bar
        var bardiagram = svg.current.selectAll("all")
            .append('g')
            .data(plotdataMain)
            .join("rect")
            .attr("x", x(0) )
            .attr("y", d => y(d[0]))
            .attr("width", 0)
            .attr("height", y.bandwidth())
            .attr("fill", "#FCB344")
            .attr("padding","20px");

        svg.current.selectAll("rect")
            .data(plotdataMain)
            .transition()
            .duration(2000)
            .attr("width", d => x(d[1]))
            .delay((d,i) => {return i*200})



        svg.current.selectAll(".text")
            .data(plotdataMain)
            .enter()
            .append("text")
            .text(function (d){return d[1]+"%"})
            .attr("font-size", "20px")
            .attr("class","label")
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .attr("fill","white")
            .attr("x", 0)
            .attr("y",function (d,i){ return y(d[0])+((y.bandwidth())/2+7)})

        // svg.selectAll(".label")
        //     .data(data)
        //     .transition()
        //     .duration(2000)
        //     .attr("x", function (d){return width*.08})
        //     .delay((d,i) => {return i*200})
        //test
        svg.current.selectAll(".label")
            .data(plotdataMain)
            .transition()
            .duration(2000)
            .attr("x", function (d){return x(0)+(((d[1].toString().length+3)/2)*10)})
            .delay((d,i) => {return i*200})

        var bar_out_text = svg.current.selectAll(".text")
            .data(plotdataMain)
            .enter()
            .append("text")
            .text(function (d){return d[0]})
            .attr("font-size", "11px")
            .attr("class","bar_out")
            .attr("text-anchor", "left")
            .attr("font-size", "20px")
            .attr("fill","#DC7345")
            .attr("font-weight", "bold")
            .attr("x", function (d){return 0})
            .attr("y",function (d,i){ return y(d[0])+((y.bandwidth())/2+8)})

        //transition bar_out_text
        svg.current.selectAll(".bar_out")
            .data(plotdataMain)
            .transition()
            .duration(2000)
            .attr("x", function (d){
                if(d[1]<10){
                    return x(d[1])+75
                }
                else if(d[1]<15){
                    return x(d[1])+52
                }
                else if(d[1]<40){
                    return x(d[1])+40
                }
                else{
                    return x(d[1])+10
                }


            })
            .delay((d,i) => {return i*200})


        }
    },[predictionData])
    useEffect(()=>{
        console.log(loading)},[loading])


    return (

        <div style={{
            textAlign: "center",
            alignContent: "center",
            alignItems: 'center',
            justifyContent: "center",
            display: "flex",
            margin: "15px"
        }}>
            {showAIS  &&
                <Box component="section" sx={{
                    p: 2,
                    backgroundColor: '#636363',
                    width: props.device_width * .40,
                    textAlign: 'center',
                    justifyContent: "center",
                    display: "flex",
                    boxShadow: "2px 2px 2px 0 rgba(255,255,255, 0.5)", // Optional for styling
                    borderRadius: 2, // Optional for rounded corners

                }}>
                    <h4 style={{textAlign: "center"}}>Vessel Source AIS - Category {aisType}</h4>

                </Box>

            }


            {showPrediction &&
                <Box component="section" sx={{
                    p: 2,
                    backgroundColor: '#636363',
                    width: props.device_width * .40,
                    textAlign: 'center',
                    justifyContent: "center",
                    display: "flex",
                    boxShadow: "2px 2px 2px 0 rgba(255,255,255, 0.5)", // Optional for styling
                    borderRadius: 2, // Optional for rounded corners

                }}>




                    <Stack  sx={{alignItems: "center"  }}>

                        <Stack direction="row"
                               spacing={3}
                               sx={{alignItems: "center"}}>
                            <h4 style={{textAlign: "center"}}>Predict Using {props.text} Algorithm</h4>
                            <Button variant="contained" onClick={doPrediction}>Predict</Button>

                            {showPredictionChart &&
                                <Button variant="contained" onClick={() => {
                                    setShowPredictionChart(false)
                                }}>Close Prediction</Button>
                            }
                            <Button variant="contained" onClick={() => {
                                setShowPrediction(false)
                            }}>Clear This Portion</Button>


                        </Stack>


                        {loading &&

                                <Box sx={{ width: '100%' }}>
                                    <p></p>
                                    <LinearProgress />
                                </Box>

                        }
                        {showPredictionChart &&
                            <div style={{
                                justifyContent: "center",
                                display: "block", marginTop: "10px"
                            }}>
                                <div ref={chartRefbar} id="hbardiv"></div>
                            </div>
                        }






                    </Stack>










                    {/* LinearProgress aligned to the bottom */}


                </Box>

            }



        </div>
    );
}
export default Classification;