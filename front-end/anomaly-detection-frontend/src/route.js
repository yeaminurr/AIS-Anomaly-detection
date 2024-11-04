import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Clusters from "./pages/Clusters";
import App from "./App";

import React from "react";
import {useState} from "react";


export const router = createBrowserRouter(
    [
        {path:"/", element:<App/>},
        {path:"/clusters", element:<Clusters />},


    ]
)