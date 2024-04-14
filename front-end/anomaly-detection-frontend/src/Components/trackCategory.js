import React, {useEffect, useRef} from "react";
import {vesselTypesDict} from "../vesselType";
import * as d3 from "d3";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const TrackCategory= (props) => {
  var count = 0;
  const chartdataradar = useRef(null);
  let data = 0;
  const chartdataais = useRef(null);
  const chartRefbar = useRef(null);
  const chartRefbarAIS = useRef(null);


  async function  fetchdata ()  {
    const radarTrack = await fetch(`http://localhost:5000/api/getdata/countbytype/`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:props.jsonfilter.current

    })
    const aistrack = await fetch(`http://localhost:5000/api/getais/countbytype/`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:props.jsonfilter.current

    })

    //await fetchdata();
    let radardata =  await radarTrack.json();
    let aisdata = await aistrack.json();
    // chartdataradar.current = radardata.map(item => [item.vesselType, item.count]);
    // chartdataais.current = aisdata.map(item => [item.vesselType, item.count]);
    let currentradar = radardata;
    let currentais = aisdata;
   // console .log()

    for(let i =0 ; i < currentradar.length ; i++){

      let current = vesselTypesDict[parseInt(currentradar[i]["vesselType"])]["description"]

      currentradar[i]["vesselTypeCode"] = currentradar[i]["vesselType"];
      currentradar[i]["vesselColor"] = vesselTypesDict[parseInt(currentradar[i]["vesselType"])]["color"];
      currentradar[i]["vesselType"] = current;




    }
    for(let i =0 ; i < currentais.length ; i++){

      let current = vesselTypesDict[parseInt(currentais[i]["vesselType"])]["description"]
      currentais[i]["vesselColor"] = vesselTypesDict[parseInt(currentais[i]["vesselType"])]["color"];
      currentais[i]["vesselTypeCode"] = currentais[i]["vesselType"];
      currentais[i]["vesselType"] = current;


    }
    chartdataradar.current = currentradar;
    //chartdataais.current = currentais;
    console.log(chartdataais.current)
    //console.log()
   // console.log(JSON.stringify(currentradar));
    //
    // const groupedcurrentradar = currentradar.reduce((acc, cur) => {
    //   if (acc[cur.vesselType]) {
    //     acc[cur.vesselType] += cur.count;
    //   } else {
    //     acc[cur.vesselType] = cur.count;
    //   }
    //   return acc;
    // }, {});
    const groupedcurrentais = currentais.reduce((acc, cur) => {

      if (acc[cur.vesselType]) {
        acc[cur.vesselType]["count"] += cur.count;
      } else {
        acc[cur.vesselType] = {}
        acc[cur.vesselType]["vesselType"]=cur.vesselType
        acc[cur.vesselType]["count"] =  cur.count;
        acc[cur.vesselType]["vesselColor"]= cur.vesselColor;
        acc[cur.vesselType]["vesselTypeCode"] = cur.vesselTypeCode;

      }

      return acc;
    }, {});
    const groupedcurrentradar = currentradar.reduce((acc, cur) => {

      if (acc[cur.vesselType]) {
        acc[cur.vesselType]["count"] += cur.count;
      } else {
        acc[cur.vesselType] = {}
        acc[cur.vesselType]["vesselType"]=cur.vesselType
        acc[cur.vesselType]["count"] =  cur.count;
        acc[cur.vesselType]["vesselColor"]= cur.vesselColor;
        acc[cur.vesselType]["vesselTypeCode"] = cur.vesselTypeCode;

      }

      return acc;
    }, {});


    chartdataais.current = Object.keys(groupedcurrentais).map(function(key){
      return groupedcurrentais[key];
    })
    chartdataradar.current = Object.keys(groupedcurrentradar).map(function(key){
      return groupedcurrentradar[key];
    })
    console.log(chartdataais.current );


    // // console.log(groupedcurrentradar);
    // Object.entries(groupedcurrentradar).forEach(([key, value]) => {
    //
    //   if(!groupedcurrentais[key]){
    //     groupedcurrentais[key] = 0
    //   }
    //
    // });
    // Object.entries(groupedcurrentais).forEach(([key, value]) => {
    //
    //   if(!groupedcurrentradar[key]){
    //     groupedcurrentradar[key] = 0
    //   }
    //
    // });


    //chartdataradar.current = radardatacopy;
    // console.log(groupedcurrentais);
    // console.log(groupedcurrentradar);
    if (count == 0){
    createbar(chartRefbar,chartdataradar);
    createbar(chartRefbarAIS,chartdataais);
    count+=1;
    }
  }

  useEffect(() => {
  fetchdata();






      }//[props.filter])
  ,[])

  function createbar(reference,data){
    // set the dimensions and margins of the graph
   // if
    let firstheight
    if (data.current.length<5){
      firstheight = data.current.length * 75;
    }
    else{
      firstheight = data.current.length * 20;
    }

    var margin = {top: 5, right: 25, bottom: 20, left: 10},
        width = 330 - margin.left - margin.right,
        height = firstheight - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select(reference.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    //console.log(chartdataradar);
    var x = d3.scaleLinear()
        .domain([0, Math.max(...data.current.map(item => item.count))])
        .range([ 0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    // Y axis
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.current.map(item => item.vesselType))
        .padding(.1);

    //Bars
    svg.selectAll("myRect")
        .data(data.current)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d["vesselType"]) })
        .attr("width", function(d) { return x(d["count"]); })
        .attr("height", y.bandwidth() )
        .attr("fill", function (d) {
          //console.log(d["color"]);
          return d["vesselColor"]
        })

    svg.selectAll(".text")
        .data(data.current)
        .enter()
        .append("text")
        .text(function (d){return d["vesselType"]})
        .attr("font-size", "10px")
        .attr("class","label")
        .attr("text-anchor", "right")
        //.attr("font-weight", "bold")
        .attr("fill","white")
        .attr("x",  function (d){
          if(x(d["count"])< width/3){
            return x(d["count"])+5
          }
          else{
            return width*.04
          }
          })
        .attr("y",function (d,i){ return y(d["vesselType"])+((y.bandwidth())/2)+3})
  }


  return(<div>
    <h4 style={{paddingBottom:0}}>Radar Tracks:</h4>
      <div ref={chartRefbar} id="hbardiv"></div>
    <h4 style={{paddingBottom:0}}>AIS Tracks:</h4>
    <div ref={chartRefbarAIS} id="hbardiv2"></div>

  </div>);
}
export default TrackCategory;