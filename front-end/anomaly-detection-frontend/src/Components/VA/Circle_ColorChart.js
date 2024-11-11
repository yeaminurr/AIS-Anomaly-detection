import React, {useEffect, useRef} from "react";
import * as d3 from 'd3';
import shadow from './Filter/filter'
import json_data from "./data.json";
//import './CSS/Circle_ColorChart.css'


const Circle_Chart = (props) => {

    const chartRef = useRef(null);
    const svg = useRef(null);
    useEffect(() => {
        if(props.selectedCluster != null && props.selectedCluster!="all" ){


            const countsByType = props.rawdata.filter(row => row.source === "AIS" && row.Kmeans_cluster === props.selectedCluster ).reduce((acc, entry) => {
                const type = entry.mapped_target_name;

                // If the date already exists in the accumulator, increment the count
                if (acc[type]) {
                    acc[type].count += 1;
                } else {
                    // If the date does not exist, initialize it with count 1
                    acc[type] = {type: type, count: 1};
                }

                return acc;
            }, {});
            console.log(countsByType)
            const countsArray = Object.values(countsByType);
            // Calculate the overall total count by summing all counts across dates
            const totalCount = countsArray.reduce((sum, item) => sum + item.count, 0);
            // Add percentage calculation for each date entry based on overall total count
            countsArray.forEach(item => {
                item.percentage = parseFloat(((item.count / totalCount) * 100).toFixed(2)); // Calculate percentage
            });
            const countsArraySliced = countsArray.slice(0,8);






            d3.select(chartRef.current).select("svg").remove();

        // var data = [["Very", 23],
        //     ["Moderately", 50],
        //     ["Not Very", 17],
        //     ["Not at All", 7]]
            var data=Object.entries(json_data["circle_color"]);

        const margin = {top: 10, right: 60, bottom: 60, left: 60}
        const height = props.device_height - (props.device_height * .75)  - margin.top - margin.bottom;
        const width = props.device_width - (props.device_width * .20) - margin.left - margin.right;

// append the svg object to the body of the page
        svg.current = d3.select(chartRef.current)
            .append("svg")
            .attr("class","CircleChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 'translate(' + margin.left + ', ' + margin.top + ')');

        // Add X axis
        const x = d3.scaleBand()
            .domain((countsArraySliced.map(d => d.type)))
            .range([width/(countsArraySliced.length+2), width]).padding(0.18);

        const y = height / 2;
        console.log(x.bandwidth())
            console.log(d3.min(countsArraySliced.map(d => d.percentage)))

        const ycolor_r = d3.scaleLinear()
            .domain([ d3.min(countsArraySliced.map(d => d.percentage)),d3.max(countsArraySliced.map(d => d.percentage))])
            .range([ .3,1]);

        //for transition modified bar
        var circle = svg.current.selectAll("all")
            .append('g')
            .data(countsArraySliced)
            .join("circle")
            .attr("class","Tr_group")
            .attr('cx', d=>x(d.type))
            .attr("cy", y)
            .attr('r', x.bandwidth()/2)
            .attr("fill","none")
            .attr("stroke",function(d,i){
                return "rgba(255,100,40,"+ycolor_r(d.percentage)+")"})
            .style("stroke-width", "8px")






        var label  =svg.current.selectAll(".text")
            .data(countsArraySliced)
            .enter()
            .append("text")
            .text(function (d){return d.percentage+"%"})
            .attr("font-size", x.bandwidth()/2*.55+'px')
            .attr("class","label")
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .attr("x", d=>( x(d.type)))
            .attr("y",y+((x.bandwidth()/2*.5)/2))
            .attr("fill","#4b4b4b")

            var label2  =svg.current.selectAll(".text")
                .data(countsArraySliced)
                .enter()
                .append("text")
                .text(function (d){return d.type})
                .attr("font-size", d=>{
                    if (d.type.length>20){
                        return  x.bandwidth()/2*.25+'px'
                    }
                    else if(d.type.length>11){
                        return  x.bandwidth()/2*.3+'px'
                    }
                    else{
                        return  x.bandwidth()/2*.4+'px'
                    }


                   })
                .attr("class","label")
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")
                .attr("x", d=>( x(d.type)))
                .attr("y",(y*2)+((x.bandwidth()/2*.6)/2)+10)
                .attr("fill","#4b4b4b")

        shadow(svg.current);

        //circle.append(label);


        circle
            .on("mousemove",function (d,i) {
                circle.style("opacity", 0.3);
                //console.log(i);
                label
                    .style('opacity', function (link_d) {
                        return link_d[1] === i[1]? 1.4 : .3;})
                label2
                    .style('opacity', function (link_d) {
                        return link_d[1] === i[1]? 1.4 : .3;})
                // label.style("opacity", 0.3);
                // line.style("opacity", 0.3);
                this.style.filter="url(#glow)";
                this.style.opacity = 1.4;
                //pie.select(this).style('opacity', "0.7")
            })
            .on("mouseout",function () {
                //final_chart.style("filter","url(#glow)");
                circle.style("opacity", 1);
                label.style("opacity", 1);
                label2.style("opacity", 1);
                this.style.filter="";
                //pie.select(this).style('opacity', "0.7")
            });



        // circle.append('text')
        //     .attr('text-anchor', 'middle')
        //     .text(function (d){return d[1]+"%"})
        //     .attr("font-size", "14px")
        //     .attr("class","label")
        //     .attr("text-anchor", "middle")

        //x(d[0])

        }
        else{
            d3.select(chartRef.current).select("svg").remove();
        }

    },[props.device_height, props.device_width,props.rawdata , props.selectedCluster]);



    return (
      <div>
          <div ref = {chartRef}>

          </div>

      </div>
    );

}

export default Circle_Chart;