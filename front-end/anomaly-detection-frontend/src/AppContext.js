import React, { createContext, useState,useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [selectedMap, setSelectedMap] = useState();
    // const [user, setUser] = useState(null);  // Example of another state
    // const [theme, setTheme] = useState("light"); // Another example
    // useEffect(() => {
    //     // This effect will run whenever selectedMap changes
    //     console.log("selectedMap updated in context:", selectedMap);
    //     // Add any additional side effects here if needed
    // }, [selectedMap]);

    useEffect(() => {
        // Sync localStorage whenever selectedMap changes
        localStorage.setItem("selectedMap", JSON.stringify([selectedMap]));
        console.log(selectedMap)
        // Dispatch storage event to notify other components in the same tab
        window.dispatchEvent(new Event("storage"));
    }, [selectedMap]);

    return (
        <AppContext.Provider value={{
            selectedMap,
            setSelectedMap,

        }}>
            {children}
        </AppContext.Provider>
    );
};