import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Clusters from "./pages/Clusters";
import App from "./App";
import Dashboard from "./pages/Dashboard";

import React from "react";
import {useState} from "react";


export const router = createBrowserRouter(
    [
        {path:"/", element:<App/>},
        {path:"/clusters", element:<Clusters />},
        {path:"/dashboard", element:<Dashboard />},


    ]
)