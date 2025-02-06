import { useEffect, useState } from "react";
import { Box, Button, Typography, Card, Grid, CardContent, Backdrop, CircularProgress } from "@mui/material";
import MarketTable from "../components/MarketTable";
import { historicalData, predictedData } from "../data/historicalData";
import Chatbot from "../components/Chatbot";
import Axios from "axios";
function View() {
    const [showPrediction, setShowPrediction] = useState(false);
    const [existingData, setExistingData] = useState([]);
    const [loading, setLoading] = useState(false);    
    const [chatQuery, setChatQuery] = useState("");
    const [portfolio, setPortfolio] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get("https://vszsuwqrx5znei4sssizlp3qra0kvejv.lambda-url.us-west-2.on.aws/");
                
                if (Array.isArray(response.data.company)) {
                    //   setHeaders(Object.keys(response.data.body.companies[0]))
                    //   setApiData(response.data.body.companies);
                    setPortfolio(response.data)
                    setExistingData(response.data.company)
                } else {
                    console.warn("API returned an empty array or unexpected data format");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);
    const handleChatSubmit = async (input) => {
        setChatQuery(input)
        setShowPrediction(true)
        setLoading(true)
    };
    return (
        <>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", minHeight: "100vh"}}>
            <Backdrop open={loading} sx={{ color: '#ddd', zIndex: 1300, backdropFilter: "blur(1px)" }}>
                <CircularProgress color="inherit" />
            </Backdrop>
           {showPrediction && <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5">Portfolio View</Typography>
                <Box>
                <MarketTable data={existingData} title="" id="view" />
                </Box>
                <Grid container spacing={3} my={1} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Summary Card */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2, height: "100%" }}>
                            <CardContent>
                                <Typography variant="h6" color="primary">
                                    Summary
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {portfolio?.summary || "No summary available"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Growth Rate Card */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 , height: "100%"}}>
                            <CardContent>
                                <Typography variant="h6" color="primary">
                                    Growth Rate
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        mt: 1,
                                        fontWeight: "bold",
                                        color: "green", // Highlight positive growth
                                    }}
                                >
                                    {portfolio?.growth_rate || "N/A"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2, height: "100%" }}>
                            <CardContent>
                                <Typography variant="h6" color="primary">
                                    Benchmark
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {portfolio?.benchmark || "No summary available"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box> }
            <Box sx={{  marginTop: "auto" ,position: "sticky", bottom: 0  }}>
                <Chatbot onChatSubmit={handleChatSubmit} />
            </Box>
            </Box>

        </>
    );
}
export default View;