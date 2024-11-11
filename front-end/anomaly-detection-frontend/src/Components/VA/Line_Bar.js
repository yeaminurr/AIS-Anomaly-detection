import React, {useEffect, useRef} from "react";
import * as d3 from "d3";
const Line_Bar = props => {
    var count = 0;
    const chartRefNbar = useRef(null);


    useEffect(() => {
        //console.log(props.line)
            d3.select(chartRefNbar.current).select("svg").remove();
            var data=props.line
            const margin = {top: 60, right:20, bottom: 80, left: 20}
            const  height = props.device_height *.22  - margin.top - margin.bottom;
            const width = props.device_width*.10 - margin.left-margin.right;
            const svg = d3.select(chartRefNbar.current)
                .append("svg")
                .attr("class","linebar")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height+ margin.top + margin.bottom)
                .append("g")
                .attr("transform", 'translate('+height/2+', '+width/2+')');
            // data= [data,["",100-data[1]]];
            // const x = d3.scaleLinear()
            //     .domain([0, Math.max(...data.map(d => d[1]))])
            //     .range([ 0, width]);
            // const y = d3.scaleBand()
            //     .domain((data.map(d => d[0])))
            //     .range([ 0, width]);

            var mainchart2 = svg
                .append("rect")
                .attr("class","bar1")
                .attr('x',0)
                .attr("y",height/2.5)
                .attr("width",width*.70)
                .attr("height",height/4)
                .attr('fill', '#808080');
        //#FFE9C7
            var mainchart = svg
                .append("rect")
                .attr("class","bar1")
                .attr('x',0)
                .attr("y",height/2.5)
                .attr("width",0)
                .attr("height",height/4)
                .attr('fill', '#FCB344');
        mainchart
            .transition()
            .duration(800)
            .attr("width",((width*.70)*(data[1]/100)))


           var label_num = svg
                .append("text")
                .text(0+"%")
                .attr("font-size",width*.39+'px')
                .attr("class","label")
                .attr("text-anchor", "middle")
                .attr("x",(width*.70)/2)
                .attr("y",height - height/1.45)
                .attr("width",width*.70)
                .attr("font-weight", "bold")
                .attr("fill","#E9752F")

        label_num
            .transition()
            .duration(800)
            .tween("text", function() {
                var i = d3.interpolate(0, data[1]);  // Number(d.percentage.slice(0, -1))
                return function(t) {
                    label_num.text(i(t).toFixed(0)+"%");
                };

            })



            svg
                .append("text")
                .text(data[0])
                .attr("font-size",width*.09+'px')
                .attr("class","label")
                .attr("text-anchor", "middle")
                .attr("x",(width*.70)/2)
                .attr("y",height - height/10)
                .attr("width",width*.70)
                .attr("font-weight", "bold")
                .attr("fill","#ffffff")


            mainchart.on("click",function () {
                label_num
                    .transition()
                    .duration(800)
                    .tween("text", function() {
                        var i = d3.interpolate(0, data[1]);  // Number(d.percentage.slice(0, -1))
                        return function(t) {
                            label_num.text(i(t).toFixed(0)+"%");
                        };

                    })
                mainchart
                    .attr("width",0);

                mainchart
                    .transition()
                    .duration(800)
                    .attr("width",((width*.70)*(data[1]/100)));



            })




            // svg.append('rect')
            //     .attr('x', 10)
            //     .attr('y', 120)
            //     .attr('width', 600)
            //     .attr('height', 40)
            //     .attr('stroke', 'black')
            //     .attr('fill', '#69a3b2');


    });
            return(
                <div ref = {chartRefNbar}
                     // style={{transform:'scale(.6)'}}
                ></div>
            );
}

export default Line_Bar;