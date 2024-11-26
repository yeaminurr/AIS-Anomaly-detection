import React, {useContext, useEffect, useRef, useState} from "react";
import * as d3 from "d3";
const LineChart_daily = (props) => {
    const lineChart = useRef(null);
    const svg = useRef();
    const dataType = "all"

    useEffect( () => {

        if(props.selected_column!=null){


       function count_for_data(variable,column_name) {
           var mydata = []
           variable.forEach(d=>{
               const countsByDate = props.rawdata.filter(row => {
                   if(props.selectedCluster == null ||props.selectedCluster=="all"){
                       return row.source === d;
                   }
                   else {
                       return row.source === d && row[props.selectedClusterAlgo] === parseInt(props.selectedCluster);
                   }


               }


               ).reduce((acc, entry) => {
                   const date = entry.ldate;

                   // If the date already exists in the accumulator, increment the count
                   if (acc[date]) {
                       acc[date].count += 1;
                       acc[date].total+=entry[column_name]

                   } else {
                       // If the date does not exist, initialize it with count 1
                       acc[date] = {date: date, count: 1,total:entry[column_name]};
                   }

                   return acc;
               }, {});
               //Convert countsByDate object to an array and sort it by date
               const sortedData = Object.values(countsByDate).sort((a, b) => {
                   return new Date(a.date) - new Date(b.date);
               });
               //Calculate the overall total count by summing all counts across dates
               //const totalCount = sortedData.reduce((sum, item) => sum + item.count, 0);
               //Add percentage calculation for each date entry based on overall total count
               sortedData.forEach(item => {
                   item.avg = (item.total / item.count) .toFixed(2); // Calculate percentage
               });


               mydata.push(sortedData);
           })

            return mydata;
        }
        var getdata = []
        //console.log(countsByDate);
        getdata = count_for_data(["AIS","radar"],props.selected_column);
       //console.log(props.selectedCluster)


        //console.log(getdata[0])


        d3.select(lineChart.current).select("svg").remove();

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = props.device_width - (props.device_width * .20) - margin.left - margin.right,
            height = props.device_height - (props.device_height * .50) - margin.top - margin.bottom;

// append the svg object to the body of the page
        svg.current = d3.select(lineChart.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

//Read the data
//         d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv").then((data)=> {
//
//             // Format the data
//         getdata.forEach(d => {
//             d.date = d.date;
//             d.count = +d.count;
//         });


        // Now I can use this dataset:

        // Find the overall min and max dates and counts across all datasets for the scales
        const allData = getdata.flat(); // Combine all datasets into one array for extent calculation
        // console.log(getdata)
        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(allData, function (d) {
                return d.date;
            }))
            .range([0, width]);
        svg.current.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Max value observed:

        const max = d3.max(allData, function (d) {
            return +d.avg;
        })

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, max])
            .range([height,60]);
        svg.current.append("g")
            .call(d3.axisLeft(y));

        // Set the gradient
        // svg.current.append("linearGradient")
        //     .attr("id", "line-gradient")
        //     .attr("gradientUnits", "userSpaceOnUse")
        //     .attr("x1", 0)
        //     .attr("y1", y(0))
        //     .attr("x2", 0)
        //     .attr("y2", y(max))
        //     .selectAll("stop")
        //     .data([
        //         {offset: "0%", color: "blue"},
        //         {offset: "100%", color: "red"}
        //     ])
        //     .enter().append("stop")
        //     .attr("offset", function(d) { return d.offset; })
        //     .attr("stop-color", function(d) { return d.color; });

        // Define the area generator
        const area = d3.area()
            .x(d => x(d.date))
            .y0(height) // Set the baseline of the area to the x-axis
            .y1(d => y(d.avg)); // Set the top of the area to the line value

        const colors = ["#00ffbc", "#ff00bc"]; // Add more colors if more datasets



        getdata.forEach((dataset, i) => {
            // Add the line
            svg.current.append("path")
                .datum(dataset)
                .attr("fill", "none")
                .attr("stroke",colors[i % colors.length])
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(d.date)
                    })
                    .y(function (d) {
                        return y(d.avg)
                    })
                )


            // Add the area path
            svg.current.append("path")
                .datum(dataset)
                .attr("class","areas")
                .attr("fill", colors[i % colors.length]) // Use the gradient as the fill
                .style("opacity", 0.2)
                .attr("d", area);

            svg.current.selectAll(".areas").on("mouseover", function (e) {
                d3.select(this).style("opacity", 1);
            });

            svg.current.selectAll(".areas").on("mouseout", function (e) {
                d3.select(this).style("opacity", 0.2);
            });


        });
        if(getdata.length > 0){

        const legend = svg.current
            .selectAll(".legend")
            .data(getdata)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legend.append("rect")
            .attr("x", width - 100)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", (d, i) => colors[i]);

        legend.append("text")
            .attr("x", width - 110)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .style("fill", "white")
            .text((d, i) => (dataType === "all" ? ["AIS", "Radar"][i] : dataType === "AIS"?"AIS":dataType === "radar"?"Radar":""));
        }
        // })

        }
        else{
            d3.select(lineChart.current).select("svg").remove();
        }
    },[props.device_height, props.device_width,props.rawdata , props.selectedCluster,props.selectedClusterAlgo,props.selected_column])






    return(
        <div>

            <div ref={lineChart} id="svgLineChartdiv" ></div>
        </div>
    )
}

export default LineChart_daily;