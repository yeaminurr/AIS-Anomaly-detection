import React, {useEffect, useRef} from "react";
import * as d3 from "d3";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import {vesselTypesDict} from "../vesselType";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import 'bootstrap/dist/css/bootstrap.css'
import Stack from '@mui/material/Stack';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from '@mui/material/Divider';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({

    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),

    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root':{
        backgroundColor:"rgba(255,255,255,0.5)",
        textColor:"rgb(0,111,255)",
        color:"rgb(0,111,255)"
    }
}));
const DifferenceDialog = (props) =>{



    const handleClickOpen = () => {
        props.setDifferenceDialogopen(true);
    };
    const handleClose = () => {
        props.setDifferenceDialogopen(false);
    };

    return(
        <div>
            <React.Fragment>
                {/*<Button variant="outlined" onClick={handleClickOpen}>*/}
                {/*    Open dialog*/}
                {/*</Button>*/}
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    sx = {{right:"72%"}}
                    open={props.differenceDialogopen}
                    hideBackdrop
                    disableEnforceFocus
                >

                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Modal title
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <div className="row gx-0">
                            <div className="col-12">
                                <Stack direction="row" spacing={1} alignItems="center" sx={{justifyContent:"center"}} >

                                    <Typography sx = {{textAlign:"center", color:'black'}}>Distance Difference : </Typography>
                                    <Typography sx = {{textAlign:"center", fontSize:"28px",fontWeight:"bold"}}>10.54 </Typography>
                                    <ArrowDropUpIcon style={{ fontSize: 50, color:"rgb(255,0,0)", margin:"0px",padding:"0px" }} />
                                </Stack>


                            </div>
                            <div className="col-6" style={{ borderRight: '2px solid #000' }}>
                                <Typography sx = {{textAlign:"center", color:'black'}}>Speed Difference : </Typography>
                                <Stack direction="row" spacing={0} sx={{justifyContent:"center"}}>
                                <Typography sx = {{textAlign:"center", fontSize:"28px",fontWeight:"bold"}}>2.00 </Typography>
                                <ArrowDropDownIcon style={{ fontSize: 50, color:"rgb(0,255,89)", margin:"0px",padding:"0px" }} />
                            </Stack>
                            </div>


                            <div className="col-6" style={{ borderLeft: '2px solid #000' }}>
                                <Typography sx = {{textAlign:"center", color:'black'}}>Heading Difference : </Typography>
                                <Stack direction="row" spacing={0} sx={{justifyContent:"center"}}>
                                    <Typography sx = {{textAlign:"center", fontSize:"28px",fontWeight:"bold"}}>6.29 </Typography>
                                    <ArrowDropUpIcon style={{ fontSize: 50, color:"rgb(255,0,0)", margin:"0px",padding:"0px" }} />
                                </Stack>
                            </div>
                            {/*<div className="col">*/}
                            {/*    <Typography sx = {{textAlign:"center"}}>hi</Typography>*/}
                            {/*</div>*/}

                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                            Save changes
                        </Button>
                    </DialogActions>


                </BootstrapDialog>
            </React.Fragment>

        </div>
    )
}
export default DifferenceDialog