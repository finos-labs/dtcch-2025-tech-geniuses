import { Box, Typography, Card, Divider, Button, CardHeader, Backdrop, CircularProgress } from "@mui/material";
import Chatbot from "../components/Chatbot";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PictureAsPdf as PdfIcon } from "@mui/icons-material";

function Report() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);    
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);

  const handleChatSubmit = async (input) => {
    setLoading(true);
    try {
      const response = await axios.post(
        // "https://si8zczq3z3.execute-api.us-west-2.amazonaws.com/dummyReport",
        "https://hq5ac5kxbc.execute-api.us-west-2.amazonaws.com/ReportGeneration",
        { query: input }
      );
      
      if (response.data?.highcharts_code) {
        const highchartsCode = response.data.highcharts_code.replace("const option = ", "").replaceAll("\n", "").replaceAll(";", "");
        
        const parsedOptions = eval(`(${highchartsCode})`);
        
        const newResponse = {
          query: input,
          chartOptions: parsedOptions,
          insights: response.data?.insights || "",
        };
        setResponses((prev) => [...prev, newResponse]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
        setLoading(false)
    }
  };

  const handleDownloadReport = async () => {
    const doc = new jsPDF();
    for (let i = 0; i < responses.length; i++) {
      const chartElement = document.getElementById(`chart-container-${i}`);
      if (chartElement) {
        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 10, 180, 90);
        doc.text(responses[i].query, 10, 105, { maxWidth: 180 });
        doc.text(responses[i].insights, 10, 120, { maxWidth: 180 });
        if (i < responses.length - 1) doc.addPage();
      }
    }
    doc.save("report.pdf");
  };

  return (
    <Box sx={{ height: "100vh", padding: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflowY: "auto" }}>
        <Backdrop open={loading} sx={{ color: '#ddd', zIndex: 1300, backdropFilter: "blur(1px)" }}>
            <CircularProgress color="inherit" />
        </Backdrop>
      <Box sx={{ overflowY: "scroll" }}>
        {responses.map((res, index) => (
          <Card key={index} id={`chart-container-${index}`} 
            sx={{ mb: 2, overflowY: "auto", borderLeft: '6px solid #8338ec', borderRight: '5px solid #8338ec' }} 
            ref={index === responses.length - 1 ? containerRef : null}>
            <CardHeader title={res.query} />
            <Divider/>
            <HighchartsReact highcharts={Highcharts} options={res.chartOptions} />
            <Divider />
            <Typography sx={{ p: 2 }}>{res.insights}</Typography>
          </Card>
        ))}
      </Box>
      <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        {responses.length > 0 && (
          <Button variant="contained" startIcon={<PdfIcon />} onClick={handleDownloadReport} sx={{ mt: 2, ml: 'auto', width: '250px' }}>
            Download Report
          </Button>
        )}
        <Chatbot onChatSubmit={handleChatSubmit} />
      </Box>
    </Box>
  );
}

export default Report;

