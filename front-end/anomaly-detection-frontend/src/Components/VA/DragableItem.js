import React from 'react';
import { useDrag } from 'react-dnd';
import Box from '@mui/material/Box';

const ItemTypes = {
    ITEM: 'item',
};

function DraggableItem({ name,width,height }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.ITEM,
        item: { name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    const widthd =width*.20;
    const heightd = height*10;


    return (
        <div style = {{padding:"5px"}}>




    <Box
        ref={drag}
        component="section"

        sx={{
            width: widthd,
            height: 40,
            display: 'flex',
            borderRadius: 1,
            backgroundColor: isDragging ? '#001343' : '#000000',
            textAlign:"center",
            justifyContent: 'center',
            alignItems: 'center',
            borderColor:'white',
            border:"1px solid",
            boxShadow:"2px 2px 2px 0 rgba(255,255,255, 0.5);"



        }}
    >
        {name}
    </Box>
        </div>
    );
}

export default DraggableItem;
