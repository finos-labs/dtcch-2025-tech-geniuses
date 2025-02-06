import { Box, Typography, Button, Fab, Popover, Card, CardHeader, CardContent, CardActions, IconButton, Collapse, Divider, Backdrop, CircularProgress } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Chatbot from "../components/Chatbot";
import MarketTable from "../components/MarketTable";
import Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import { useState, useEffect, useRef } from "react";
import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

function Extract() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);    
  const extractedDocs = location.state?.docs || [];
  const companyIds = extractedDocs.map(doc => doc.Company_ID);
  const [existingData, setExistingData] = useState([]);
  const [extractedData, setExtractedData] = useState([]);
  const [chatQuery, setChatQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [responseDataList, setResponseDataList] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [expandedDocs, setExpandedDocs] = useState({});
  const fabRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
    setLoading(true);
      try {
        const response = await Axios.get("https://vszsuwqrx5znei4sssizlp3qra0kvejv.lambda-url.us-west-2.on.aws/");
        if (Array.isArray(response.data.company)) {
          setExistingData(response.data.company);
        } else {
          console.warn("API returned an empty array or unexpected data format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    fetchDatas(companyIds);
  }, []);

  const fetchDatas = async (input) => {
    setLoading(true);
    try {
      const response = await Axios.post("https://we5h7xhvlqffasmvbeijtypg3u0dqpqu.lambda-url.us-west-2.on.aws/", { company_ids: input });
      setExtractedData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (input) => {
    setChatQuery(input);
    setLoading(true);
    try {
      const inputObject = {
        company_id: JSON.parse(sessionStorage.getItem('rows'))[0].companyId,
        query: input
      };
      
      const response = await Axios.post("https://4qfpz1abxj.execute-api.us-west-2.amazonaws.com/dev", inputObject);
      setResponseDataList(prevList => [...prevList, { query: input, data: response.data }]);
      setTimeout(() => {
        setAnchorEl(fabRef.current);  
      }, 500);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDocExpand = (index) => {
    setExpandedDocs(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };


  const toggleExpand = (index) => {
    setExpandedCards(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const open = Boolean(anchorEl);
  const id = open ? "fab-popover" : undefined;

  return (
    <Box sx={{ padding: 2, display: "flex", flexDirection: "column" }}>
      <Backdrop open={loading} sx={{ color: '#ddd', zIndex: 1300, backdropFilter: "blur(1px)" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ flex: 8, display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 1, display: "flex", gap: 1 }}>
          <MarketTable sx={{ height: '100%' }} data={existingData} title="" id="view" />
          <MarketTable data={Object.entries(extractedData).map(([companyId, data]) => ({ companyId, ...data }))} title="" id="extract" />
        </Box>

        { responseDataList.length > 0 && <Fab ref={fabRef} color="primary" onClick={() => setAnchorEl(fabRef.current)} sx={{ position: 'fixed', bottom: 110, right: 40, zIndex: 1000 }}>
          <QuestionAnswerRoundedIcon titleAccess="Analyze" />
        </Fab>}

        {/* Popover containing response cards */}
        <Popover 
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
          transformOrigin={{ vertical: 'center', horizontal: 'right' }}
          sx={{ marginRight: 2, borderRadius: 20 }}
        >
          <Box sx={{ padding: 2, width: '650px', overflowY: 'auto', background: "#edf6f9" }}>
            {responseDataList.map((responseItem, index) => (
              <Card key={index} sx={{ marginBottom: 2, borderLeft: '5px solid lightgreen', borderRight: '5px solid lightgreen' }}>
                <CardHeader title={responseItem.query} />
                <Divider />
                <CardContent>
                  <Typography variant="body2">{responseItem.data.answer}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <IconButton onClick={() => toggleExpand(index)}>
                    {expandedCards[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </CardActions>
                <Divider />
                <Collapse in={expandedCards[index]} timeout="auto" unmountOnExit>
                  <CardContent>
                    {responseItem.data.documents.map((doc, docIndex) => (
                       <Card key={docIndex} sx={{ padding: 1, margin: 1, boxShadow: 2, borderLeft: '3px solid #f72585' }}>
                          <Typography variant="body2" fontWeight="bold">{doc.metadata.Document_Name}</Typography>
                          <Typography variant="caption" align="right">{doc.metadata.Company_Name}</Typography>
                          <IconButton onClick={() => toggleDocExpand(docIndex)}>
                           {expandedDocs[docIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        <Collapse in={expandedDocs[docIndex]} timeout="auto" unmountOnExit>
                           <Typography variant="body2">{doc.content}</Typography>
                           <IconButton sx={{ color: '#f72585', float: 'right' }} href={doc.metadata._source_uri} target="_blank">
                            {doc.metadata.Document_Type === "CONCALL" ? <AudiotrackOutlinedIcon /> : doc.metadata.Document_Type === "WEB" ? <LanguageOutlinedIcon /> : <PictureAsPdfOutlinedIcon />}
                          </IconButton>
                        </Collapse>
                      </Card>
                    ))}
                  </CardContent>
                </Collapse>
              </Card>
            ))}
          </Box>
        </Popover>
      </Box>
      <Box sx={{ flex: 2, mt: 1 }}>
        <Chatbot onChatSubmit={handleChatSubmit} />
      </Box>
    </Box>
  );
}

export default Extract;
