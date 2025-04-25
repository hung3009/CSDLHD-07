import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";


export const useLoading = () => {
    const context = useContext(LoadingContext);
    return context;
  };
  