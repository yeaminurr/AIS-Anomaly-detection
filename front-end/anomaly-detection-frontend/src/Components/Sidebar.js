import {useEffect, useRef, useState} from "react";
//import { HiMenuAlt2 } from "react-icons/hi";
import MenuIcon from '@mui/icons-material/Menu';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import dayjs from 'dayjs';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MuiMenuItem  from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { DemoContainer , DemoItem} from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import "./cssfiles.css";
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import {
    Menu,
    MenuItem,
    ProSidebar,
    SubMenu,
    SidebarHeader

} from "react-pro-sidebar";
//import 'react-pro-sidebar/dist/css/styles.css';
import Hbar from "./Horizontal_bar";
import TrackCategory from "./trackCategory";

import "react-pro-sidebar/dist/css/styles.css";
import "./sidebar.css";
import {alignProperty} from "@mui/material/styles/cssUtils";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {theme, ColorButton} from "../themeMui";
import {vesselTypesDict} from "../vesselType";



// Create a custom theme



const Sidebar = (props) => {

     const [Selected, setSelected] = useState(null);
    const [collapsed, setCollapsed] = useState(true);
    const [vesselName, setvesselName] = useState([]);
    const name = [... new Set(Object.values(props.vesseltype.current))]
    const sidewidth  =useRef(null)
    //console.log(name)
    const onClickMenuIcon = (value) => {
        setSelected(value);
        setCollapsed(!collapsed);
        console.log(Selected)
        if(value==="Analytics"){
            sidewidth.current = "350px";
        }
        else{
            sidewidth.current="270px";
        }
        console.log(sidewidth.current)
    };


    const clickedButton =() =>{
        //console.log(vesselName);
        console.log(vesselName);
        let vessels = []
        for (const [key, value] of Object.entries(props.vesseltype.current)) {
            //console.log(key,value["description"])
            //vesselTypeOnly.current[key] = value["description"]
            if (vesselName.includes(value)){
            //console.log(key);
                vessels.push(parseInt(key));

            }

        }
        props.selectedVessel.current = vessels;

        props.filter(true);
    }

    const [value, setValue] = useState([0, 100]);

        const handleChange = (event, newValue) => {
            setValue(newValue);


        };
    useEffect(() => {
        props.confvalue.current[0] = value[0]/100;
        props.confvalue.current[1] = value[1]/100;
    }, [value]);
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 240,
            },
        },
    };
    const handleChangeDropdown = (event) => {
        const {
            target: { value },
        } = event;
        setvesselName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
            //console.log(value)
        );
        //typeof value === 'string' ? console.log("true"):console.log("false");
        //console.log(value);

    };




    return (

        <div style = {{display: "flex", flexDirection: "row-reverse", height: '100%'}}>
        <ProSidebar collapsed={collapsed} width={sidewidth.current} >


            <Menu>
                <SidebarHeader style={{textAlign:"center"}}>

                        {collapsed && <MenuIcon onClick={onClickMenuIcon}/>}
                        {!collapsed && <CloseIcon onClick={onClickMenuIcon}/>}

                </SidebarHeader>
                {collapsed &&
                    (
                        <>
                        <MenuItem style={{textAlign:"center"}} onClick={()=>onClickMenuIcon("Filter")}> <FilterAltIcon/>
                    <p style={{color:"white", fontSize:"10px",margin:0, padding:0}}>Filter</p></MenuItem>
                <MenuItem onClick={()=>onClickMenuIcon("Analytics")} style={{textAlign:"center"}}> <AnalyticsIcon/>
                    <p style={{color:"white", fontSize:"10px",margin:0, padding:0}}>Analytics</p>
                </MenuItem>
                        </>
                    )}
                {(!collapsed && (Selected==="Filter"))&&
                    <MenuItem>
                        <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} style={{color:"white"}}>
                            <DemoContainer components={['DatePicker',  'DateTimePicker']}>
                                <div >
                                    <DateTimePicker
                                        value  = {dayjs(props.startDate.current*1000)}
                                        onChange={(newValue) => {props.startDate.current = newValue.valueOf() / 1000;}}
                                        label="Enter Start time" />
                                    <p></p>
                                    <DateTimePicker label="Enter End time"
                                                    value = { dayjs(props.endDate.current*1000)}
                                                    onChange={(newValue) => {props.endDate.current = newValue.valueOf() / 1000;}}
                                    />
                                    <p></p>
                                        <div style={{textAlign:"center", alignItems:"center", alignContent:"center", position: "relative"}}>

                                            <Box sx={{ width: 200 }} style = {{transform: "translateX(+16%)",  zIndex:"10", marginBottom:"15px"}} >
                                                <p style={{color:"white", paddingBottom:"0px", marginBottom:"10px"}}> Confidence Level:</p>
                                                <Slider

                                                    style = {{paddingTop:"0px"}}
                                                    value={value}
                                                    onChange={handleChange}
                                                   //onChange={(data)=>console.log(data)}
                                                    valueLabelDisplay="auto"
                                                    //getAriaValueText={valuetext}
                                                    disableSwap
                                                    min={0}
                                                    max={100}
                                                />
                                            </Box>


                                            <div>
                                                <FormControl sx={{ m: 1, width: 240 }}>
                                                    <InputLabel id="demo-multiple-checkbox-label">Vessel Type</InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-checkbox-label"
                                                        id="demo-multiple-checkbox"
                                                        multiple
                                                        value={vesselName}
                                                        onChange={handleChangeDropdown}
                                                        input={<OutlinedInput label="Vessel Type" />}
                                                        renderValue={(selected) => selected.join(', ')}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {name.map((name) => (
                                                            <MuiMenuItem key={name} value={name}>
                                                                <Checkbox checked={vesselName.indexOf(name) > -1} />
                                                                <ListItemText primary={name} />
                                                            </MuiMenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
<p></p>
                                            <div>
                                                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                                                    <p style={{color:"white", paddingBottom:"0px", marginBottom:"10px"}}> Spatial Threshold for Prediction</p>
                                                    <FormControl variant="standard">

                                                        <InputLabel sx={{paddingTop:"-10px", marginTop:"-10px"}} htmlFor="input-with-icon-adornment">
                                                            (Write a Value from .0001 to 1)
                                                        </InputLabel>


                                                        <Input
                                                            id="input-with-icon-adornment"
                                                            startAdornment={
                                                                <InputAdornment position="start">

                                                                </InputAdornment>
                                                            }
                                                        />
                                                    </FormControl>
                                                </Box>

                                            </div>



                                    <ColorButton variant="contained"
                                    onClick={clickedButton}>Submit</ColorButton></div>



                                </div>
                            </DemoContainer>
                        </LocalizationProvider>
                        </ThemeProvider>
                    </MenuItem>
                }

                {(!collapsed && (Selected==="Analytics"))&&
                    <>
                        <MenuItem style={{backgroundColor:"rgba(58,58,58,0.7)"}}>
                            <p style={{color:"white", paddingBottom:"0px", marginTop:"0px",marginLeft:"0px", marginBottom:"0px", textAlign:"center"}}> Total AIS Tracks : {props.totalais.current}</p>
                        </MenuItem>
                        <p></p>
                        <MenuItem style={{backgroundColor:"rgba(58,58,58,0.7)"}}>
                            <p style={{color:"white", paddingBottom:"0px", marginTop:"0px",marginLeft:"0px", marginBottom:"0px", textAlign:"center"}}> Total Radar Tracks : {props.totalradar.current}</p>
                        </MenuItem>
                        <p></p>
                    <MenuItem style={{backgroundColor:"rgba(58,58,58,0.7)"}}>
                        <p style={{color:"white", paddingBottom:"0px", marginTop:"0px",marginLeft:"0px", marginBottom:"0px", textAlign:"center"}}> Total Predicted Radar Tracks : {props.totalradarpredicted.current}</p>
                    </MenuItem>
                        <p></p>
                    <MenuItem style={{backgroundColor:"rgba(58,58,58,0.7)"}}>
                        <p style={{color:"white", paddingBottom:"0px", marginBottom:"-10px",marginLeft:"0px"}}> Tracks by Confidence Level:</p>
                        <Hbar jsonfilter={props.jsonfilter} filter = {props.filtervar}/>
                    </MenuItem>
                        <p></p>
                        <MenuItem style={{backgroundColor:"rgba(58,58,58,0.7)"}}>
                            <p style={{color:"white", paddingBottom:"0px", marginBottom:"-10px",marginLeft:"0px"}}> Tracks by Vessel Type:</p>
                            <TrackCategory jsonfilter={props.jsonfilter} filter = {props.filtervar}
                            vesselType = {props.vesseltype}/>
                        </MenuItem>
                    </>
                }

            </Menu>


        </ProSidebar>
            </div>
    );
};

export default Sidebar;