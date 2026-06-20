import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
function ProtectedRoute(){
    const {token} = useAuth();

    if(!token){
        return(
            <Navigate to={"/login"} replace></Navigate>
        ) 
    }else{
        return(
            <Outlet/> //lleva a la ruta que se quiere ver desde el inicio
        )
    }
}

export default ProtectedRoute;