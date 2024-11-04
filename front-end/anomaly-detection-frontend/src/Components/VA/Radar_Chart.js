import {React,useEffect,useState} from "react";
import RadarChart from "react-svg-radar-chart";
import * as d3 from "d3";
import "./compareChart.css";

function Radar_Chart(props) {
    const colors = d3.schemeTableau10;
    const [adjustedData, setAdjustedData] = useState([]);

    // Update adjustedData whenever props.selectedData changes
    useEffect(() => {
        if (Array.isArray(props.selectedData)) {
            const newData = props.selectedData.map((s, index) => ({
                data: {
                    min_speed: Number(s.min_speed_s),
                    max_speed: Number(s.max_speed_s),
                    avg_speed: Number(s.avg_speed_s),
                    //curviness: Number(s.curviness_s),
                  //  heading_st: Number(s.heading_st_s),
                    turning_me: Number(s.turning_me_s),
                    circ_mean: Number(s.circ_mean_s),
                    speed_diff: Number(s.speed_diff_s),
                   // dist_diff: Number(s.dist_diff__s),
                },
                meta: { color: colors[index % colors.length] },
            }));
            setAdjustedData(newData);

        }
    }, [props.selectedData]);
    useEffect(() => {
        console.log(adjustedData)
    }, [adjustedData]);
    // Radar chart options
    const defaultOptions = {
        axes: true,
        scales: 1,
        captions: true,
        captionMargin: 35,
        dots: true,
        zoomDistance: 1.3,
        captionProps: () => ({
            className: "caption",
            textAnchor: "middle",
            fontSize: 10,
            fontFamily: "sans-serif",
        }),
        dotProps: () => ({
            className: "dot",
        }),
    };

    return (
        <div style={{ paddingLeft: "20em" }}>
            <h2 className="title">Select points from the scatterplot to compare data.</h2>
            <div style={{ textAlign: "center", marginTop: "-48px" }}>
                <RadarChart
                    options={defaultOptions}
                    captions={{
                        min_speed: "min_speed",
                        max_speed: "max_speed",
                        avg_speed: "avg_speed",
                      //  curviness: "curviness",
                      //  heading_st: "heading_st",
                        turning_me: "turning_me",
                        circ_mean: "circ_mean",
                        speed_diff: "speed_diff",
                      //  dist_diff: "dist_diff",
                    }}
                    data={adjustedData}
                    size={props.device_height - 200}
                />
            </div>
        </div>
    );
}

// function areEqual(prevProps, nextProps) {
//     console.log(prevProps === nextProps);
// }

export default Radar_Chart;
