import React, {useEffect, useRef} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import {vesselTypesDict} from "../vesselType";
//import json_data from "./data.json";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root':{
        backgroundColor:"rgba(255,255,255,0.88)",
        textColor:"rgb(0,0,0)",
        color:"rgb(0,0,0)"
    }


}));

const VesselDialog = (props) => {
    const currentSelected = useRef(null);
    //const selectedCircleLayer = useRef(null);
    const handleClose = () =>{
        props.setdialogState(false)
    }
    console.log( props.currentDialog)
    const markpredictedAIS = () => {
        console.log(props.currentDialog["vesselName"])
        console.log(props.currentDialog["hausdorff_distance"])

        if(!props.selectedCircleLayer.current )props.selectedCircleLayer.current = L.layerGroup().addTo(props.maplayer.current);
        props.selectedCircleLayer.current.clearLayers();
        let source = ""

        if (props.dialogdataname.current == "AIS") {
            currentSelected.current = props.currentDialog["mmsi"]
            source = "AIS"
        } else {
            currentSelected.current = props.currentDialog["hausdorff_distance"]["mmsi"]
            source = "AIS"
        }
        fetch(`http://localhost:5000/api/getais/mmsi/` + currentSelected.current, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: props.filters.current

        }).then((response) => response.json())
            .then((data) => {
                //console.log(data);
                data.forEach((routes) => {
                    //console.log(data);
                    let latLng = [routes.geometry.coordinates[routes.geometry.coordinates.length - 1][1], routes.geometry.coordinates[routes.geometry.coordinates.length - 1][0]];
                    let marker = L.circleMarker(latLng, {
                        color: "#ff0000",
                        fillOpacity: .7,
                        opacity: 1,
                        radius: 5.5,

                    }).bindPopup("<b>Source : "+source+"</b><br>MMSI: "+currentSelected.current);



                    routes["marker"]= "marked";


                    marker.on("click", function (e) {
                        props.setcurrentDialog(routes);
                        props.dialogdataname.current = "AIS";
                        props.setdialogState(true);
                    });
                    props.selectedCircleLayer.current.addLayer(marker);
                    iampopup();
                    function iampopup(){
                        // console.log("hey I am popup");
                        marker.openPopup()
                    }
                });
                if("ais_first" in props.currentDialog["hausdorff_distance"]){

             let  ais_start =  [ props.currentDialog["hausdorff_distance"]["ais_first"]["coordinates"][1],props.currentDialog["hausdorff_distance"]["ais_first"]["coordinates"][0]]
                let  ais_last =  [ props.currentDialog["hausdorff_distance"]["ais_last"]["coordinates"][1],props.currentDialog["hausdorff_distance"]["ais_last"]["coordinates"][0]]

                let marker2 = L.circleMarker(ais_start, {
                    color: "#fdfdfd",
                    fillOpacity: .7,
                    opacity: 1,
                    radius: 5.5,

                }).bindPopup("<b>Start</b>"+currentSelected.current);
                let marker3 = L.circleMarker(ais_last, {
                    color: "#fdfdfd",
                    fillOpacity: .7,
                    opacity: 1,
                    radius: 5.5,

                }).bindPopup("<b>end</b>"+currentSelected.current);
                props.selectedCircleLayer.current.addLayer(marker2);
                props.selectedCircleLayer.current.addLayer(marker3);
                }

            });
        props.setdialogState(false);
    }

                //startDate.current = endDate.current = null;


    return(<div>

            <BootstrapDialog
                sx = {{color:"rgba(12,12,12,0.66)"}}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"sm"}
                aria-labelledby="customized-dialog-title"
                open={ (props.dialogState) ?true : false}
            >
                <DialogTitle sx={{ m: 0, p: 2 , paddingBottom:0,paddingRight:"12%"}} id="customized-dialog-title">
                    Data Source : {props.dialogdataname.current}
                </DialogTitle>
                <DialogTitle sx={{ m: 0, p: 2, paddingTop:0 }} id="customized-dialog-title">
                    MMSI : {

                    (props.dialogdataname.current=="AIS"&&props.currentDialog)?props.currentDialog["mmsi"]:
                        (props.currentDialog&&props.currentDialog["hausdorff_distance"]["mmsi"]!=0)?props.currentDialog["hausdorff_distance"]["mmsi"]:"Undefined"

                }
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: "black",
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Vessel Name: {props.currentDialog?.vesselName?props.currentDialog["vesselName"]:"Unindentified"}
                    </Typography>
                    <Typography gutterBottom>
                        Vessel Type: {props.currentDialog?.vesselType? vesselTypesDict[parseInt(props.currentDialog["vesselType"])]["description"]:"Unindentified"}

                    </Typography>
                    <Typography gutterBottom>
                        {props.dialogdataname.current=="AIS"?"Heading: "+props.currentDialog["tracks"][0]["heading"]:""}

                    </Typography>
                    <Typography gutterBottom>
                       Confidence: {(props.currentDialog?.confidence)?parseFloat(props.currentDialog["confidence"])*100 +"%":(props.currentDialog?.tracks)?parseFloat(props.currentDialog["tracks"][0]["confidence"])*100+"%":""}

                    </Typography>
                </DialogContent>
                <DialogActions>
                    { (props.dialogdataname.current=="Radar")&&(props.currentDialog&&props.currentDialog["hausdorff_distance"]["mmsi"]!=0)&&
                    <Button autoFocus onClick={markpredictedAIS}>
                        Find Predicted AIS
                    </Button>
                    }
                    { (props.currentDialog?.marker)&&
                        <Button autoFocus onClick={markpredictedAIS}>
                            Remove Marker
                        </Button>
                    }

                </DialogActions>
            </BootstrapDialog>



    </div>
    )
}
export default VesselDialog;