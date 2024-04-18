import logo from './logo.svg';
import './App.css';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import React, {useEffect, useRef, useState} from "react";
import data from "./26_2023_01_tracks_radar.json"
import Sidebar from "./Components/Sidebar";
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import horizontal_bar from "./Components/Horizontal_bar";
import {vesselTypesDict} from "./vesselType";
import VesselDialog from "./Components/VesselDialog";
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RouteIcon from '@mui/icons-material/Route';
import $ from 'jquery';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';



function App() {


  const [mydata,setmydata] = useState(null);
  const [aisdata,setaisdata] = useState(null);
  const startDate = useRef(null);
  const endDate = useRef(null);
  const [filterSubmit,setfilterSubmit] = useState(false);
  const maplayer = useRef(null);
  const circleLayer = useRef(null);
  const circleLayerAIS = useRef(null);
  const fg =   useRef(null);
  const fg_AIS =   useRef(null);
  const finaljs = useRef(null);
  const totalradar = useRef(null);
  const totalais = useRef(null);
  const totalradarpredicted = useRef(null);
  const vesselTypeOnly = useRef({});
  const vesselColorOnly = useRef({});
  const selectedVessel = useRef([]);
  const [currentdialog,setcurrentdialog] = useState(null);
  const [dialogState, setdialogState] = useState(false)
  const dialogdataname = useRef(null);
  const seachMMSIvalue = useRef("");
  const [radarswitch,setradarswitch] = useState(true)
  const [aisswitch,setaisswitch] = useState(true)
  const [width,setwidth] = useState(null)
  const leaflet_ids = useRef({});
  const confvalue = useRef([0, 100]);
  const selectedCircleLayerdialog = useRef(null);
  //const temporal_prediction = useRef(false);
  const [temporal_prediction,settemporal_prediction] = useState(false)
  const [spatialThresholdVisibility,setspatialThresholdVisibility] = useState(false);
  const temporal_prediction_start = useRef(0);
  const temporal_prediction_end = useRef(0)

      //runs only the first time and fetches data if you want to fetch data on any other time use the deps
  useEffect(() => {
    window.addEventListener("resize", function() {
      setwidth(window.innerWidth);
    });

    if(maplayer.current){
      console.log("ekhaneeee")
      maplayer.current.remove()
      maplayer.current=null;
    }
    maplayer.current = L.map('map', {
      center: [51.505, -0.09],
      zoom: 150
    });

    var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: 'png'
    });
    Stadia_AlidadeSmoothDark.addTo(maplayer.current);


    //createMap();
    //fetchdata("2023-01-06 00:00:00","2023-01-06 20:00:00");
    startDate.current = 1672977600;
    endDate.current = 1673049600;

    fetchdata(1672977600,1673049600,[]);
    //console.log("kfsdddddddddddddddddddddddd");
    // Simplifying the dictionary to include only the number and the description

    for (const [key, value] of Object.entries(vesselTypesDict)) {
      //console.log(key,value["description"])
      vesselTypeOnly.current[key] = value["description"]
      vesselColorOnly.current[key]= value["color"]
    }

    //console.log(vesselTypeOnly)
    L.LayerGroup.include({
      hide: function() {
        for (var id in this._layers) {
          //console.log(this._layers[id]);
          if (this._layers[id].setStyle) {
            //this._layers[id].setStyle({opacity: 0, fillOpacity: 0});
            this._layers[id].setStyle({opacity: 0, fillOpacity: 0});
            //console.log()


          }
        }
      },
      show: function() {
        //console.log(leaflet_ids.current)
        for (var id in this._layers) {

          if (this._layers[id].setStyle) {
            //console.log((leaflet_ids.current[id])?"true":"false");
            var fillOpacity = 1;
            var opacity =1;
            //(leaflet_ids.current[id])?(leaflet_ids.current[id].fillOpacity)?fillOpacity=leaflet_ids.current[id].fillOpacity
                if (leaflet_ids.current[id]){
                  //console.log("aschchi")
                  if (leaflet_ids.current[id].fillOpacity){
                    console.log("herehere")
                  fillOpacity = leaflet_ids.current[id].fillOpacity
                    //console.log(fillOpacity)
                    this._layers[id].setStyle(
                        {fillOpacity: parseFloat(leaflet_ids.current[id].fillOpacity)});
                  }
                  else{
                    console.log("herehere44")
                    console.log(leaflet_ids.current[id]);
                    console.log(leaflet_ids.current[id].fillOpacity);
                    this._layers[id].setStyle(
                        {fillOpacity:1});
                  }
                  if (leaflet_ids.current[id].opacity){
                    opacity = leaflet_ids.current[id].opacity
                    this._layers[id].setStyle(
                        {opacity:  parseFloat(leaflet_ids.current[id].opacity)});}
                  else{
                    console.log("herehere22");
                    console.log(leaflet_ids.current[id]);
                    this._layers[id].setStyle(
                        {opacity:1});
                  }
                  //console.log(fillOpacity+","+opacity)


                }
                else{
                  //console.log("there")
                  this._layers[id].setStyle(
                      {opacity: opacity, fillOpacity: fillOpacity});
                }

                //console.log(fillOpacity+","+opacity);

            //this._layers[id].setStyle({opacity: 1, fillOpacity: 1});
          //     this._layers[id].setStyle(
          //         {opacity: opacity, fillOpacity: fillOpacity}
          //
          //         // (leaflet_ids.current[id].fillOpacity )?{opacity: leaflet_ids.current[id].opacity, fillOpacity: leaflet_ids[id].current.fillOpacity}:
          //         //     {opacity: leaflet_ids.current[id].opacity, fillOpacity: 1}
          // );
            }
        }
      }
    });
//     var legend = L.control({position: 'bottomleft'});
//     legend.onAdd = function (map) {
//       var div = L.DomUtil.create('div', 'info legend'),
//           grades = [0, 10, 20, 50, 100], // Example grade breakpoints for a numeric legend
//           labels = ['<strong>Categories</strong>'];
//       // Generate a label with a colored square for each grade
//
//         div.innerHTML +=
//             '<i class="circle" style="background:' + "#00ff60"+ '"></i> ' +
//             "sdsd";
//
//
//       return div;
//     };
//
// // Step 3: Add the legend to the map
//     legend.addTo(maplayer.current);

  }, []);

  useEffect(() => {
    if(filterSubmit){

    setfilterSubmit(false);
      console.log(dayjs(startDate.current*1000));
      console.log(dayjs(endDate.current*1000));
      console.log(startDate.current);
      console.log(endDate.current);
      console.log(selectedVessel.current);

      console.log(confvalue.current);
      console.log("haha")
      console.log(temporal_prediction);

      leaflet_ids.current = {}
    fetchdata(startDate.current,endDate.current,selectedVessel.current);



    }
    else return;


  }, [filterSubmit]);

  const fetchdata = (startDatevar,endDatevar,selectedVesselvar) =>{
    // if(!startDatevar) startDatevar=  "2023-01-06 00:00:00";
    // if(!endDatevar) endDatevar=  "2023-01-06 20:00:00";
    if(!startDatevar) startDatevar=  1672977600;
    if(!endDatevar) endDatevar=  1673049600;

    //if(!endDatevar) endDatevar=  1673049600;
    if(selectedVesselvar.length === 0){
      selectedVesselvar = Object.keys(vesselTypeOnly.current).map(key => parseInt(key))
    }
    let temporal = "false"
    //console.log(selectedVesselvar)
    if(temporal_prediction){
      temporal = "true"
    }

    finaljs.current = JSON.stringify({
      "startDate": startDatevar,
      "endDate": endDatevar,
      "selectedVessel":selectedVesselvar,
      "confidence":confvalue.current,
      "temporal_prediction":temporal,
      "temporal_prediction_start":temporal_prediction_start.current,
      "temporal_prediction_end":temporal_prediction_end.current
    })


   // fetch(`http://localhost:5000/api/getdata/mongo/?startDate=${startDatevar}&endDate=${endDatevar}`,{
    fetch(`http://localhost:5000/api/getdata/mongo/`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:finaljs.current

    }).then((response) => response.json())
        .then((data) =>{
          //console.log(data);
          setmydata(data);
          totalradar.current = data.length
          totalradarpredicted.current = data.filter(item => item.hausdorff_distance.mmsi !== 0).length;
          console.log( totalradarpredicted.current)
          //startDate.current = endDate.current = null;

        })


    fetch(`http://localhost:5000/api/getais/`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:finaljs.current

    }).then((response) => response.json())
        .then((data) =>{
          //console.log(data);
          setaisdata(data);
          totalais.current = data.length
          //startDate.current = endDate.current = null;

        })

  }




  useEffect(() => {

    if ( aisdata==null) {
      //console.log(mapdiv.current)
      return;}
    else{
      console.log("here")
      //console.log(mydata);
      //console.log(data);
      var myStyle = {
        "color": "#5efc83",
        "weight": 1,
        "opacity": 0.65
      };

      //maplayer.current.clearLayers();
      if(!circleLayerAIS.current )circleLayerAIS.current = L.layerGroup().addTo(maplayer.current);
      if(!fg_AIS.current ) fg_AIS.current = L.featureGroup().addTo( maplayer.current);
      //console.log(fg);
      fg_AIS.current.clearLayers();

      circleLayerAIS.current.clearLayers();
      //markers.clearLayers();
      let markers = L.geoJSON(aisdata, {
        style: myStyle

      });
      if (markers.options.style.opacity!=0) leaflet_ids.current[markers._leaflet_id] = markers.options.style;
      fg_AIS.current.addLayer(markers);

      add_circles(aisdata,circleLayerAIS,"AIS");

    }

  },[aisdata]);




//for updating radar data
  useEffect(() => {

    if ( mydata==null) {
      //console.log(mapdiv.current)
      return;}
    else{
      console.log("here")
      //console.log(mydata);
      //console.log(data);
      var myStyle = {
        "color": "#ff7800",
        "weight": 1,
        "opacity": 0.65
      };

      //maplayer.current.clearLayers();
      if(!circleLayer.current )circleLayer.current = L.layerGroup().addTo(maplayer.current);
      if(!fg.current ) fg.current = L.featureGroup().addTo( maplayer.current);
      //console.log(fg);
      fg.current.clearLayers();

      circleLayer.current.clearLayers();
      //markers.clearLayers();
      let markers = L.geoJSON(mydata, {
        style: myStyle
        // style: function(feature) {
        //   console.log(feature);
        //   // Apply condition based on the 'value' property
        //   if (feature.hausdorff_distance.distance  == 0) {
        //     // Style for values greater than 15
        //     return {color: "#ff7800", weight: 1, opacity: 0.65};
        //   } else {
        //     // Style for values 15 or less
        //     return {color: "#0000ff", weight: 1, opacity:0.65 };
        //   }
        // }

      });
      //console.log(markers);

      console.log(markers._leaflet_id);
      //console.log((markers.options.style.fillOpacity)?"true":"false");
      if (markers.options.style.opacity!=0) leaflet_ids.current[markers._leaflet_id] = markers.options.style;
      //console.log(leaflet_ids.current[markers._leaflet_id].opacity)
      //console.log((leaflet_ids.current[markers._leaflet_id].fillOpacity)?"true":"false");


      fg.current.addLayer(markers);
      try{
        maplayer.current.fitBounds(markers.getBounds());
      }
      catch {
        console.log("bounderror")
      }
      
      maplayer.current.setZoom(11);
      add_circles(mydata,circleLayer,"Radar");

    }

  },[mydata]);

  async function add_circles(data,circleLayer,source ){


    let avghaursdoff = 0;
    if(source=="Radar" && temporal_prediction.current){
      const response = await fetch('http://localhost:5000/api/getdata/totaltrajectory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const responseData = await response.json();
      avghaursdoff = (responseData["total_distance"]/responseData["total_trajectories"])*.80


    }


    data.forEach((routes) => {
      try{
        let color;
        if(source=="Radar"){
          color = "#0ac5ff"
          if(temporal_prediction.current){
            if(routes.hausdorff_distance.distance>=avghaursdoff){
              routes.hausdorff_distance.mmsi = 0;
              routes.hausdorff_distance.distance = 0;
              routes.vesselName = "Unidentified";
              routes.vesselType = 0;


            }
          }
        if (routes.hausdorff_distance.mmsi  == 0) {
          color = "#ff6e37"
          //console.log(routes.hausdorff_distance);
        }
        }
        else{
          color = "#ffe562"
        }


      let latLng = [routes.geometry.coordinates[routes.geometry.coordinates.length-1][1],routes.geometry.coordinates[routes.geometry.coordinates.length-1][0]];
      let marker = L.circleMarker(latLng, {
          color: color,
          fillOpacity: .7,
          opacity: 1,
          radius: 5.5,
        });

        marker.on("click", function (e) {
          //routes["dialog"]=true;
          //console.log(routes);

          setcurrentdialog(routes);
          dialogdataname.current = source;
          setdialogState(true);
        });
        // Assign a unique ID to the marker using L.stamp()
        let markerId = L.stamp(marker);

        if(marker.options.opacity!=0) leaflet_ids.current[markerId] = marker.options;

        //console.log("haha")
        //console.log(leaflet_ids.current[markerId].fillOpacity);
        //console.log(marker.options);
        circleLayer.current.addLayer(marker);
        //console.log("added")


      }
      catch (err){
        console.log(err);
      }

  });
  }
  const searchMMSI  = (event) =>{
    console.log(seachMMSIvalue);
    event.preventDefault();
    fetchdataforMMSI(startDate.current,endDate.current,parseInt(seachMMSIvalue.current))
  }

  const fetchdataforMMSI = (startDatevar,endDatevar,MMSI) =>{

    if(!startDatevar) startDatevar=  1672977600;
    if(!endDatevar) endDatevar=  1673049600;
    //if(!endDatevar) endDatevar=  1673049600;

    //console.log(selectedVesselvar)

    finaljs.current = JSON.stringify({
      "startDate": startDatevar,
      "endDate": endDatevar
    })
    //leaflet_ids.current = {}


    // fetch(`http://localhost:5000/api/getdata/mongo/?startDate=${startDatevar}&endDate=${endDatevar}`,{
    fetch(`http://localhost:5000/api/getdata/mmsi/`+MMSI,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:finaljs.current

    }).then((response) => response.json())
        .then((data) =>{
          //console.log(data);
          setmydata(data);
          console.log(data);
          totalradar.current = data.length
          //startDate.current = endDate.current = null;

        })


    fetch(`http://localhost:5000/api/getais/mmsi/`+MMSI,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:finaljs.current

    }).then((response) => response.json())
        .then((data) =>{
          //console.log(data);
          setaisdata(data);
          totalais.current = data.length
          //startDate.current = endDate.current = null;

        })

  }
  const reset = (event) =>{
    seachMMSIvalue.current=""
    $("#inputMMSI").val('');
    setfilterSubmit(true);
  }
  //const label = { inputProps: { 'aria-label': 'AIS' } };
  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
  }));
  useEffect(() => {
    if(temporal_prediction){
      setspatialThresholdVisibility(true);
    }
    else{
      setspatialThresholdVisibility(false);
    }

      setfilterSubmit(true);

  }, [temporal_prediction]);

  useEffect(() => {
    if(circleLayerAIS.current && fg_AIS.current){
    if(aisswitch){
      circleLayerAIS.current.show();
      fg_AIS.current.show()
      if(selectedCircleLayerdialog.current) selectedCircleLayerdialog.current.show();
    }
    else{
      circleLayerAIS.current.hide();
      fg_AIS.current.hide()
      if(selectedCircleLayerdialog.current) selectedCircleLayerdialog.current.hide();
    }
    }
    if(circleLayer.current && fg.current){
      if(radarswitch){
        circleLayer.current.show();
        fg.current.show()
      }
      else{
        circleLayer.current.hide();
        fg.current.hide()
      }
    }

  }, [aisswitch,radarswitch]);
  const clicksetais = (event) => {
    setaisswitch(event.target.checked)
    //console.log(event.target.checked);

  }

  const clicksettemporal = (event) => {
    settemporal_prediction(!temporal_prediction)
    //console.log(event.target.checked);

  }
  const clicksetradar = (event) => {
    setradarswitch(event.target.checked)
   // console.log(event.target.checked);
    //console.log(window.innerWidth)
  }

  // useEffect(() => {
  //   console.log(width)
  // }, [width]);
  const temporal_threshold = () =>{
    console.log(temporal_prediction_start.current);
    console.log(temporal_prediction_end.current);
    setfilterSubmit(true);
  }



  return (
<div >

    <div className="App" id="map" style={{height:"100vh",position:"relative"}}>

      <Sidebar right style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '150px',
        height: '100%',
        background: 'white',
        zIndex: 20, // Ensure this is above the Leaflet map's z-index
        padding: '10px',
        boxSizing: 'border-box',

      }}
               startDate  = {startDate} endDate = {endDate} filter={setfilterSubmit} jsonfilter = {finaljs}
               filtervar={filterSubmit} totalradar={totalradar} vesseltype ={vesselTypeOnly} selectedVessel = {selectedVessel}
               totalais={totalais}
               totalradarpredicted={totalradarpredicted}
               //setConfvalue = {setconfValue}
               confvalue = {confvalue}



      />

      <Box sx={{
        position: 'absolute',
        top: 0, // Adjust top as needed
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000, // Ensure it's above other elements
        backgroundColor: 'rgba(255, 255, 255, 0)', // Optional, for visibility
        borderRadius: '4px', // Optional, for styled corners
        boxShadow: 2, // Optional, for a slight shadow
        marginTop:3,

      }}>

      <Paper
          onSubmit={searchMMSI}
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.80)',
              width : {xs: '100%', // 100% width on extra-small screens
                sm: 600, // 600px width on small screens
                md: 700, // 700px width on medium screens
                lg: 800, // 800px width on large screens
                xl: 900, // 900px width on extra-large screens
                 }

      }}
        >
        {/*<Switch {...label} defaultChecked />*/}
        {/*<FormControlLabel*/}
        {/*    sx={{paddingRight:"5px",fontSize:"7px"}}*/}
        {/*    value="start"*/}
        {/*    control=*/}
        {/*    label="Radar: "*/}
        {/*    labelPlacement="start"*/}
        {/*/>*/}
        {/*<p style={{paddingRight:"-5px",fontSize:"15px"}}>Radar: </p>*/}
        {/*{<Switch sx={{ transform: 'scale(0.85) translateX(-15%)'}} defaultChecked />}*/}
        <Stack direction="row" spacing={1} alignItems="center" sx={{paddingLeft:"5px"}}>
          <Typography>Temporal Prediction : </Typography>
          <AntSwitch  inputProps={{ 'aria-label': 'ant design' }}
                      defaultChecked={temporal_prediction}
                      onChange={clicksettemporal}/>

          <Typography>Radar : </Typography>
          <AntSwitch  inputProps={{ 'aria-label': 'ant design' }}
          //onClick =
                      defaultChecked={radarswitch}
                     onChange={clicksetradar}
          />
          <Typography>AIS : </Typography>
          <AntSwitch  inputProps={{ 'aria-label': 'ant design' }}
                     defaultChecked={aisswitch}
                     onChange={clicksetais}/>
        </Stack>


      <InputBase
          sx={{ ml: 1, flex: 1,color:"black" }}
          id = "inputMMSI"
          placeholder="Seach MMSI"
          inputProps={{ 'aria-label': 'search google maps' }}
          //ref = {seachMMSIvalue}
          onChange={ (event)=>{seachMMSIvalue.current=event.target.value}}
          //value = {seachMMSIvalue.current}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search"
      onClick={searchMMSI}
      >
        <SearchIcon />
      </IconButton>
        <IconButton
            onClick={reset}
        >
          < RestartAltIcon/>
        </IconButton>
        </Paper>
      </Box>



      <Box sx={{
        position: 'absolute',
        top: "96%", // Adjust top as needed
        left: '1%',
        transform: 'translateY(-100%)',
        display: 'flex',

        zIndex: 1000, // Ensure it's above other elements
        //backgroundColor: 'rgba(255, 255, 255, 0)', // Optional, for visibility
        borderRadius: '4px', // Optional, for styled corners
        boxShadow: 2, // Optional, for a slight shadow
        marginTop:3,

      }}>

      <Paper
          onSubmit={searchMMSI}
          component="form"
          sx={{ p: '2px 4px', display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.70)',
            width : {xs: '100%', // 100% width on extra-small screens
              sm: 180, // 600px width on small screens
              md: 180, // 700px width on medium screens
              lg: 180, // 800px width on large screens
              xl: 180, // 900px width on extra-large screens
            },


            height : {xs: '100%', // 100% width on extra-small screens
              sm: 250, // 600px width on small screens
              md: 250, // 700px width on medium screens
              lg: 250, // 800px width on large screens
              xl: 250, // 900px width on extra-large screens
            }

          }}
      >

        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1}  sx={{paddingLeft:"5px",paddingTop:"5px", alignItems:"center"}} style={{alignItems:"center"}}>
            <h4 style={{textAlign:"center", alignItems:"center"}}>Navigation Helper</h4>
          </Stack>
        <Stack direction="row" spacing={1}  sx={{paddingLeft:"5px",paddingTop:"5px"}}>
          <i className={"circle"} style = {{backgroundColor:"#5efc83"}}></i>
          <p style={{textAlign:"left", fontSize:"12px", fontWeight:"bold", paddingRight:"5px"}}>Current Vessel Position : AIS </p>

        </Stack>
        <Stack direction="row" spacing={1}  sx={{paddingLeft:"5px",paddingTop:"5px"}}>
          <i className={"circle"} style={{backgroundColor:"#ff7800"}}></i>
          <p style={{textAlign:"left", fontSize:"12px", fontWeight:"bold", paddingRight:"5px"}}>Current Unpredicted Vessel Position : Radar </p>

        </Stack>
        <Stack direction="row" spacing={1}  sx={{paddingLeft:"5px",paddingTop:"5px"}}>
          <i className={"circle"} style={{backgroundColor:"#0ac5ff"}}></i>
          <p style={{textAlign:"left", fontSize:"12px", fontWeight:"bold", paddingRight:"5px"}}>Current Predicted Vessel Position : Radar </p>

        </Stack>

          <Stack direction="row" spacing={1}  sx={{paddingLeft:"5px",paddingTop:"5px"}}>
            <RouteIcon style={{color:"#5efc83"}}></RouteIcon>
            <p style={{textAlign:"left", fontSize:"12px", fontWeight:"bold", paddingRight:"5px"}}>AIS Path </p>

          </Stack>
          <Stack direction="row" spacing={1}  sx={{paddingLeft:"5px",paddingTop:"5px"}}>
            <RouteIcon style={{color:"#ff7800",}}></RouteIcon>
            <p style={{textAlign:"left", fontSize:"12px", fontWeight:"bold", paddingRight:"5px"}}>Radar Path </p>

          </Stack>



        </Stack>


      </Paper>
      </Box>


      <VesselDialog
      currentDialog = {currentdialog}
      setcurrentDialog = {setcurrentdialog}
      dialogdataname = {dialogdataname}
      filters = {finaljs}
      maplayer = {maplayer}
      circleLayer = {circleLayer}
      dialogState = {dialogState}
      setdialogState = {setdialogState}
      selectedCircleLayer = {selectedCircleLayerdialog}
      />
      <></>


          <Slide direction="right" in={spatialThresholdVisibility} >
          <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            zIndex: 1000, // Ensure it's above other elements
            backgroundColor: 'rgb(255,255,255)', // Optional, for visibility
            borderRadius: '4px',
            position: 'absolute',
            top: "20%", // Adjust top as needed
            left: '1%',
            transform: 'translateY(-100%)',
            display: 'flex',


          }}
          noValidate
          autoComplete="off"
      >
        <div>
          <Typography>Write The Temporal Threshold (In minutes)</Typography>
          <TextField


              label="Start Time"
              defaultValue={temporal_prediction_start.current}
              //value={temporal_prediction_start.current}
              onChange={(event)=>{temporal_prediction_start.current=event.target.value}}
          />
          <TextField

              label="End Time"
              defaultValue={temporal_prediction_end.current}
              onChange={(event)=>{temporal_prediction_end.current=event.target.value}}

          />
          <Button sx={{top: "19%", marginRight:"5px"}} variant="contained" onClick={temporal_threshold}>Submit</Button>
        </div>
      </Box>
          </Slide>



    </div>



</div>



  );
}

export default App;
