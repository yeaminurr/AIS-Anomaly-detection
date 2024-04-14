import {createTheme} from "@mui/material/styles";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { blue } from '@mui/material/colors';
export const theme = createTheme({
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: 'white', // Change text color
                    '&::placeholder': {
                        color: 'white', // Change placeholder text color
                        opacity: 1, // Make sure the placeholder is fully visible
                    }
                },
            },
        },
    },
    palette: {
        // You might need to adjust the contrastText or other related palette colors if you're using a dark background
        mode: 'dark', // Consider using dark mode for better visual compatibility with white text
    },
});


export const ColorButton = styled(Button)(({ theme }) => ({
    color: "#000000",
    backgroundColor: "#adadad",
    '&:hover': {
        backgroundColor: blue[700],
    },
}));
