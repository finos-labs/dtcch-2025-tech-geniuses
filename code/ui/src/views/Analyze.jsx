import { Box, Typography } from "@mui/material";
import Chatbot from "../components/Chatbot";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import  Axios  from "axios";

function Analyze() {
    const location = useLocation();
    const input = location.state?.docs
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await Axios.post("https://klswll0tw9.execute-api.us-west-2.amazonaws.com/dev", input);
              //   setHeaders(Object.keys(response.data.body.companies[0]))
              //   setApiData(response.data.body.companies);
              console.log(response.data)
            //   setExistingData(response.data.body.companies)
            
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchData();
      }, []);
 return (
<Box sx={{ p: 3 }}>
<Typography variant="h5">Analyze</Typography>
<Chatbot from="analyze" />
</Box>
 );
}
export default Analyze;