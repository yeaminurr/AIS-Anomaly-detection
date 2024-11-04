import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
function Selection(props){
    const selectionRef = useRef();
    const svg = useRef();

    useEffect(() => {
        let container = d3.select(selectionRef.current);
        svg.current = container.select("#svgScatterContainer");

        // Clear previous chart if it exists
        if (!svg.current.empty()) {
            svg.current.remove();
        }

        // Data for scatter plot
        let data = props.cluster_data;
        if(props.dataTypes.length == 0){
            data=[]
        }
        else if (props.dataTypes.length == 1){
            if(props.dataTypes[0].name == "AIS Data"){
                data = data.filter(row => row.source === "AIS"); // Change 'cluster' to your column name
            }
            else if (props.dataTypes[0].name == "Radar Data"){
                data = data.filter(row => row.source === 'radar'); // Change 'cluster' to your column name
            }

        }




        // Set dimensions for the scatterplot
        const width = props.device_width - 650;
        const height = props.device_height - 268;

        svg.current = container
            .append("svg")
            .attr("id", "svgScatterContainer")
            .attr("width", width)
            .attr("height", height)
            .call(
                d3.zoom().on("zoom", (event) => {
                    svg.current.attr("transform", event.transform);
                })
            )
            .append("g")
            .attr("transform", "translate(10,0)");

        // Define scales for t-SNE features (tsne1, tsne2)
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.tsne1))
            .range([0, width - 100]);

        const y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.tsne2))
            .range([height - 100, 0]);

        // Create axes
        // svg.append("g")
        //     .attr("transform", `translate(0,${height - 100})`)
        //     .call(d3.axisBottom(x));
        //
        // svg.append("g")
        //     .call(d3.axisLeft(y));

        // Define color scheme for KMeans clusters
        const colors = d3.schemeTableau10;

        // Add scatter points
        svg.current.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.tsne1))
            .attr("cy", d => y(d.tsne2))
            .attr("r", 2)
            .attr("fill", d => colors[d.Kmeans_cluster])  // Use the kmeans column for color
            .style("opacity", 0.7)
            .on("click", function (e, d) {
                //handleSelectedChange(d);
                if(e.target.mousefire!="on"){
                    const itemColor = d3.select(e.target).attr("fill");
                    console.log(itemColor);
                    console.log(e);
                    //props.setSelectedData((prevItems=[]) => [...prevItems, d])

                    props.setSelectedData((prevItems = []) => {
                        // Check if 'd' is not already in the array (assuming 'd.key' is the unique identifier)
                        if (!prevItems.some(item => item.key === d.key)) {
                            return [...prevItems, d];
                        }
                        return prevItems; // If 'd' is already in the array, return without changes
                    });



                    d3.select(e.target)
                        .transition()
                        .duration(200)
                        .attr("fill","#ffffff")
                        .attr("r", 8)
                        .style("opacity", 1);
                    if(!e.target.basecolor){
                        e.target.basecolor = itemColor;
                    }

                     e.target.mousefire = "on";
                    d3.select(e.target).raise();}
                else{
                    e.target.mousefire = "off";
                    props.setSelectedData((prevItems = []) => prevItems.filter(item => item !== d));
                    d3.select(e.target)
                        .transition()
                        .duration(200)
                        .attr("r", 2)
                        .attr("fill",e.target.basecolor)
                        .style("opacity", 0.7);
                }




            })
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    //.attr("r", 8)
                    .style("opacity", 1);
            })
            .on("mouseout", function (e,d) {
                //if(e.target.mousefire!="on"){
                d3.select(this)
                    .transition()
                    .duration(200)
                    //.attr("r", 2)
                    .style("opacity", 0.7);

            //}
            });


        // Optional: Add legend based on KMeans clusters
        const legend = svg.current.selectAll(".legend")
            .data(d3.range(0, d3.max(data.map(d => parseInt(d.Kmeans_cluster))) + 1))
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legend.append("rect")
            .attr("x", width - 100)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => colors[d]);

        legend.append("text")
            .attr("x", width - 110)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .style("fill", "white")
            .text(d => `Cluster ${d}`);

    }, [props.cluster_data,props.dataTypes]);

    // Programmatic click based on `tempstorage`
    useEffect(() => {
        const idsToClick = props.tempStorage; // Array of IDs you want to "click"
        if (Array.isArray(idsToClick) && idsToClick.length > 0){

        idsToClick.forEach(id => {
            var mycircle = d3.select("#svgScatterContainer").selectAll("circle").filter(function(d){return id === d.key}).node()
            // console.log(mycircle)
            // console.log(id)
            // const circle = svg.current.select(`circle[data-key="${id}"]`);
            console.log("cicked")
            if (mycircle !== null) {
                console.log("cicked and got")
                // Simulate click
                mycircle.dispatchEvent(new Event("click"));

            }
        });}
    }, [props.tempStorage]); // This effect runs whenever `tempstorage` changes

    return (
        <div>

            <div ref={selectionRef} id="scatterContainer" style={{ height: props.device_height - 268 }}></div>
        </div>
    );
}
export default Selection;