import React, {useEffect, useRef} from "react";
import * as d3 from "d3";
import json_data from "./data.json";

const Horizon_Bar = (props) => {
    var count = 0;
    const chartRefbar = useRef(null);

    function dataPrep(){
        var data1 = []
        var data2 = []

        // Function to calculate average
        const avg = (array) => array.reduce((sum, value) => sum + value, 0) / array.length;

// Extract each column as an array and calculate its average

        const averagesall = {
            min_speed: 100,
            max_speed: 100,
            avg_speed: 100,
            curviness: 100,
            heading_st: 100,
            // Continue with other properties as needed
        };

        if(props.selectedCluster=="all" || props.selectedCluster== null){

            return[averagesall,averagesall]
        }
        else{
            const alldata = props.rawdata;
            const alldata2 = props.rawdata.filter(row => row.Kmeans_cluster === props.selectedCluster);
            const averages = {
                min_speed: avg(alldata.map(item => item.min_speed)),
                max_speed: avg(alldata.map(item => item.max_speed)),
                avg_speed: avg(alldata.map(item => item.avg_speed)),
                curviness: avg(alldata.map(item => item.curviness)),
                heading_st: avg(alldata.map(item => item.heading_st)),
                // Continue with other properties as needed
            };
            const averagesfiltered = {
                min_speed: avg(alldata2.map(item => item.min_speed)),
                max_speed: avg(alldata2.map(item => item.max_speed)),
                avg_speed: avg(alldata2.map(item => item.avg_speed)),
                curviness: avg(alldata2.map(item => item.curviness)),
                heading_st: avg(alldata2.map(item => item.heading_st)),
                // Continue with other properties as needed
            };
            const final = {
                min_speed: ((averagesfiltered.min_speed/averages.min_speed)*100).toFixed(0),
                max_speed: ((averagesfiltered.max_speed/averages.max_speed)*100).toFixed(0),
                avg_speed: ((averagesfiltered.avg_speed/averages.avg_speed)*100).toFixed(0),
                curviness: ((averagesfiltered.curviness/averages.curviness)*100).toFixed(0),
                heading_st: ((averagesfiltered.heading_st/averages.heading_st)*100).toFixed(0),
                // Continue with other properties as needed
            };


            return [averagesall,final]

        }

    }


    useEffect(() => {

            //const data=Object.entries(json_data["Horizontal_Bar"]);
        // const data=[["Innovation Group" , 7],
        //     ["Business Unit" , 7],
        //     ["Executive Management", 12],
        //     ["Multiple Groups' Decision" ,33],
        //     ["IT Group", 39]]


        const datapreparation = dataPrep();
        d3.select(chartRefbar.current).select("svg").remove();
        const data= Object.entries(datapreparation[1])
        const dataAll= Object.entries(datapreparation[0])

    // set the dimensions and margins of the graph;
        const margin = {top: 26.66, right: 220.66, bottom: 26.66, left: 26.66}
       const  height = props.device_height - (props.device_height * .55) - margin.top - margin.bottom;
       const width = props.device_width - (props.device_width * .75) - margin.left-margin.right;

            // const margin = {top: 40-26.66, right: 250-166.66, bottom: 40-26.66, left: 40-26.66}
            // const  height = 500-333.33 - margin.top - margin.bottom;
            // const width = 500+170-446.66 - margin.left-margin.right;
// append the svg object to the body of the page
    const svg = d3.select(chartRefbar.current)
        .append("svg")
        .attr("class","horizontal_bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height+ margin.top + margin.bottom)
        .append("g")
        .attr("transform", 'translate('+margin.left+', '+margin.top+')');
    console.log(data)

        // const svg = d3.select(chartRefbar.current)
        //     .append("svg")
        //     .attr("width", width + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        //     .append("g")
        //     .attr("transform", `translate(${margin.left}, ${margin.top})`);
    // Add X axis
        // Combine values from both objects into one array
        const allValues = [
            ...Object.values(datapreparation[0]),
            ...Object.values(datapreparation[1])
        ];

// Find the maximum value
        const maxX = Math.max(...allValues);

        const x = d3.scaleLinear()
        .domain([0, maxX])
        .range([ 0, width]);

        // svg.append("g")
        //     .attr("transform", `translate(0, ${height})`)
        //     .call(d3.axisBottom(x))
        //     .selectAll("text")
        //     .attr("transform", "translate(-10,0)rotate(-45)")
        //     .style("text-anchor", "end");

        const y = d3.scaleBand()
        .domain((data.map(d => d[0])))
        .range([ 0, height]).padding(0.4);



        // svg.append("g")
        //     .call(d3.axisLeft(y));

        //const data_ready = Object.entries(data);
            //actual bar diagram
            // var bardiagram = svg.selectAll("all")
            //     .append('g')
            //     .data(data)
            //     .join("rect")
            //     .attr("x", x(0) )
            //     .attr("y", d => y(d[0]))
            //     .attr("width", d => x(d[1]))
            //     .attr("height", y.bandwidth())
            //     .attr("fill", "#69b3a2")
            //     .attr("padding","20px");
    // Mainbar
    //for transition modified bar
    var bardiagram = svg.selectAll("all")
        .append('g')
        .data(data)
        .join("rect")
        .attr("x", x(0) )
        .attr("y", d => y(d[0]))
        .attr("width", 0)
        .attr("height", y.bandwidth())
        .attr("fill", "#FCB344")
        .attr("padding","20px");

            svg.selectAll("rect")
                .data(data)
                .transition()
                .duration(2000)
                .attr("width", d => x(d[1]))
                .delay((d,i) => {return i*200})



        //for transition modified bar
        var bardiagram2 = svg.selectAll("all")
            .append('g')
            .data(dataAll)
            .join("rect")
            .attr("x", x(0) )
            .attr("y", d => y(d[0])+y.bandwidth()+2)
            .attr("width", d => x(d[1]))
            .attr("height", y.bandwidth()*.30)
            .attr("fill", "#44fc84")
            .attr("padding","20px");

        // svg.selectAll("rect")
        //     .data(dataAll)
        //     .transition()
        //     .duration(2000)
        //     .attr("width", d => x(d[1]))
        //     .delay((d,i) => {return i*200})


            bardiagram.on("click",function (mydata,myi) {
                console.log(myi[0]);
                svg.selectAll("rect")
                    .data(data)
                    .transition()
                    .duration(500)
                    .attr("width", function (d,i){
                        if(d[0]==myi[0]){

                            return(x(d[1]));
                        }
                        else{
                            return 0;
                        }
                    })
                    .delay((d,i) => {return i*50})

                svg.selectAll(".label")
                    .data(data)
                    .transition()
                    .duration(500)
                    .attr("x",

                        function (d,i){
                            if(d[0]==myi[0]){

                                return width*.08;
                            }
                            else{
                                return 0;
                            }
                        })

                    .delay((d,i) => {return i*50})

                svg.selectAll(".bar_out")
                    .data(data)
                    .transition()
                    .duration(500)
                    .attr("x",
                        function (d,i){
                            if(d[0]==myi[0]){

                                return x(d[1])+10;
                            }
                            else{
                                return 20;
                            }
                        })
                    .delay((d,i) => {return i*50})


            })
            bardiagram.on("mouseout",function (mydata,myi) {
                console.log(myi[0]);
                svg.selectAll("rect")
                    .data(data)
                    .transition()
                    .duration(500)
                    .attr("width",  d => x(d[1]))
                    .delay((d,i) => {return i*50})

                svg.selectAll(".label")
                    .data(data)
                    .transition()
                    .duration(500)
                    .attr("x", function (d){return x(0)+(((d[1].toString().length+3)/2)*12)})
                    .delay((d,i) => {return i*50})

                svg.selectAll(".bar_out")
                    .data(data)
                    .transition()
                    .duration(500)
                    .attr("x", function (d){
                        if(d[1]<10){
                            return x(d[1])+55
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
                    .delay((d,i) => {return i*50})

            })


            svg.selectAll(".text")
                .data(data)
                .enter()
                .append("text")
                .text(function (d){return d[1]+"%"})
                .attr("font-size", "20px")
                .attr("class","label")
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")
                .attr("fill","white")
                .attr("x", 0)
                .attr("y",function (d,i){ return y(d[0])+((y.bandwidth())/2+8)})

            // svg.selectAll(".label")
            //     .data(data)
            //     .transition()
            //     .duration(2000)
            //     .attr("x", function (d){return width*.08})
            //     .delay((d,i) => {return i*200})
        //test
        svg.selectAll(".label")
            .data(data)
            .transition()
            .duration(2000)
            .attr("x", function (d){return x(0)+(((d[1].toString().length+3)/2)*12)})
            .delay((d,i) => {return i*200})

            var bar_out_text = svg.selectAll(".text")
                .data(data)
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
            svg.selectAll(".bar_out")
                .data(data)
                .transition()
                .duration(2000)
                .attr("x", function (d){
                    if(d[1]<10){
                        return x(d[1])+55
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



    })



    return(
        <div>
        <div ref={chartRefbar} id="hbardiv"></div>
        </div>
    );
}

export default Horizon_Bar;