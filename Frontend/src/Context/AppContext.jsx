import { createContext,useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) =>{
    const [token,setToken] = useState()
    const navigate = useNavigate();
    const value = { token , setToken, navigate }
   

    

    return (
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider