import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";
export const WebContext = createContext();

export default ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        
    }, []);

    return (
        <div>
            {!isLoaded ? <div></div> :
                <WebContext.Provider value={{  }}>
                    {children}
                </WebContext.Provider>}
        </div>
    )
}