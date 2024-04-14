import React, {useEffect, useRef} from "react";
import * as d3 from "d3";
//import json_data from "./data.json";

const Hbar = (props) => {
    var count = 0;
    const chartRefbar = useRef(null);
    const chartdata = useRef(null);
    let data = 0;
    const chartdataais = useRef(null);
    const wholedata = useRef([0,1]);
    let radarcheck = useRef(false);
    let aischeck = useRef(false);



    useEffect(() => {





        //d3.selectAll("svg > *").remove();
        if(!radarcheck.current){
         fetch(`http://localhost:5000/api/getdata/confidence/`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:props.jsonfilter.current

        }).then((response) => response.json())
            .then((dataj) =>{

                //setmydata(data);
                //chartdata.current = dataj;
                //startDate.current = endDate.current = null;
                chartdata.current=dataj.map(item => [item.Limit, item.count]);
                //chartdata.current=dataj.map(item => ({ [item.Limit]: item.count }));
                //console.log(dataj)
                console.log(chartdata.current);
                radarcheck.current = true;
                callfunc();


            })
        }
        if(!aischeck.current){

        fetch(`http://localhost:5000/api/getais/confidence/`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:props.jsonfilter.current

        }).then((response) => response.json())
            .then((dataj) =>{

                //setmydata(data);
                //chartdata.current = dataj;
                //startDate.current = endDate.current = null;
                chartdataais.current=dataj.map(item => [item.Limit, item.count]);
                //chartdataais.current=dataj.map(item => ({ [item.Limit]: item.count }));
                //console.log(dataj)
                console.log(chartdataais.current)
                aischeck.current = true;
                callfunc();







            })}
        // console.log(aischeck.current)
        // console.log(radarcheck.current)
        function callfunc() {


        if(aischeck.current&&radarcheck.current) {
            console.log("toomuchtime")
            wholedata.current[0] = {'category': "Radar", "values": chartdata.current};
            wholedata.current[1] = {'category': "AIS", "values": chartdataais.current};
            //console.log(wholedata.current);
            radarcheck.current = false;
            aischeck.current = false;
            let colors = [{"Name":"Radar", "color":"#f6b40e"},{"Name":"AIS","color":"#ad00bb"}]
            createbar(colors);

        }
        }



function createbar(colors){
        if(count===0){

        // const data=[["Innovation Group" , 7],
        //     ["Business Unit" , 7],
        //     ["Executive Management", 12],
        //     ["Multiple Groups' Decision" ,33],
        //     ["IT Group", 39]]
        console.log(chartdata.current);
        console.log(wholedata.current)
       // console.log(dataj);


    // set the dimensions and margins of the graph;
        const margin = {top: 25.66, right: 0.0, bottom: 20.66, left: 40.66}
       const  height = 250 - margin.top - margin.bottom;
       const width = 310 - margin.left-margin.right;

// append the svg object to the body of the page
    const svg = d3.select(chartRefbar.current)
        .append("svg")
        .attr("class","horizontal_bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height+ margin.top + margin.bottom)
        .append("g")
        .attr("transform", 'translate('+margin.left+', '+margin.top+')');

    // Add X axis
        const x = d3.scaleLinear()
        .domain([0,Math.max(Math.max(...chartdataais.current.map(d => d[1])),Math.max(...chartdata.current.map(d => d[1])))])
        .range([ 0, width]);

        console.log()

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");


        const y = d3.scaleBand()
        .domain((chartdata.current.map(d => d[0])))
        .range([ 0, height]).padding(0.2);
        svg.append("g")
                .call(d3.axisLeft(y))







    //for transition modified bar
    var bardiagram = svg.selectAll("all")
        .append('g')
        .data(chartdata.current)
        .join("rect")
        .attr("x", x(0)+1 )
        .attr("y", d => y(d[0]))
        .attr("width", d => x(d[1]))
        .attr("height", y.bandwidth()/2-1)
        .attr("fill", "#f6b40e")
        .attr("padding","20px");

        var bardiagram2 = svg.selectAll("all")
                .append('g')
                .data(chartdataais.current)
                .join("rect")
                .attr("x", x(0)+1 )
                .attr("y", d => y(d[0])+y.bandwidth()/2+1)
                .attr("width", d => x(d[1]))
                .attr("height", y.bandwidth()/2)
                .attr("fill", "#ad00bb")
                .attr("padding","20px");




            count = count+1
            var size = 15

            svg.selectAll("mydots")
                .data(colors)
                .enter()
                .append("rect")
                .attr("x", (width *.8))
                .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", function(d){ return d["color"]})

// Add one dot in the legend for each name.
            svg.selectAll("mylabels")
                .data(colors)
                .enter()
                .append("text")
                .attr("font-size", "12px")
                .attr("x", (width *.8) + size*1.2)
                .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", "white")
                .text(function(d){ return d["Name"]})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

        }}
    },[props.filter])



    return(
        <div>
        <div ref={chartRefbar} id="hbardiv"></div>
        </div>
    );
}

export default Hbar;