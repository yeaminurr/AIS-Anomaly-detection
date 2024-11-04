import React from 'react';
import { useDrop } from 'react-dnd';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const ItemTypes = {
    ITEM: 'item',
};

function DropZone({ onDrop, onRemove, droppedItems, children }) {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.ITEM,
        drop: (item) => onDrop(item), // Call onDrop from App.js

    }));

    return (
        <div ref={drop}
             style={{ position: 'relative' }}>
            {/* Render any custom content passed from App.js */}


            {/* Render dropped items */}
            <div  style={{right: `10px`}}>
            <Stack spacing={1} direction="row">
            {droppedItems.map((item, index) => (
                // <div
                //     key={index}
                //     onClick={() => onRemove(item)} // Remove item on click
                //     style={{
                //         position: 'absolute',
                //         width:"200px",
                //
                //         top: '10px',
                //         right: `${10 + index * 40}px`, // Space items slightly apart
                //         padding: '8px',
                //         backgroundColor: 'lightcoral',
                //         cursor: 'pointer',
                //     }}
                // >
                    <Stack spacing={1} direction="column" key={index} onClick={() => onRemove(item)}>
                        <Button variant="contained" >{item.name}</Button>
                    </Stack>





            ))}
            </Stack>
            </div>
            {children}

            {/*<div*/}
            {/*    ref={ref}*/}
            {/*    //className="page"*/}
            {/*    style={{border: "2px solid", width: "1000px", height: "1000px", borderColor: "black"}}*/}
            {/*    onDragOver={(e) => e.preventDefault()}*/}
            {/*>*/}
            {/*    {widgets.map((widget, index) => (*/}
            {/*        <div className="dropped-widget" key={index}>*/}
            {/*            {widget}*/}
            {/*            <button onClick={() => onRemove(widget)}></button>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*    <LineChartComponent columns={widgets}/>*/}

            {/*</div>*/}
        </div>


    )
        ;
}

export default DropZone;
