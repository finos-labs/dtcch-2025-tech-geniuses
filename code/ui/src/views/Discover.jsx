import { Box, Typography, Paper, Button, Checkbox, FormControlLabel, Fab, Tabs, Tab, Popover, Divider, Backdrop, CircularProgress } from "@mui/material";
import ExtractIcon from '@mui/icons-material/FileCopy'
import Chatbot from "../components/Chatbot";
import DocumentCard from "../layouts/cards";
import MarketTable from "../components/MarketTable";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/material";

const dropAnimation = keyframes`
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

function Discover() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [existingData, setExistingData] = useState([]);
    const [intResponseData, setIntResponseData] = useState([]);
    const [selectedQualifiers, setSelectedQualifiers] = useState([]);
    const [discoverResponseData, setDiscoverResponseData] = useState(null);
    const [preserverDiscover, setPreserverDiscover] = useState([])
    const [discoverResponseDataS, setDiscoverResponseDataS] = useState([]);
    const [keywordData, setKeywordData] = useState([]);
    const [chatQuery, setChatQuery] = useState("");
    const [showDoc, setShowDoc] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [activeTab, setActiveTab] = useState("p");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [suggestions, setSuggestions] = useState([]); // Stores suggested queries
    const [anchorElSuggestions, setAnchorElSuggestions] = useState(null); // Popover state


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await Axios.get("https://vszsuwqrx5znei4sssizlp3qra0kvejv.lambda-url.us-west-2.on.aws/");
                if (Array.isArray(response.data.company)) {
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
    useEffect(() => {
        if (selectedKeywords.length === 0) {
            setDiscoverResponseData(preserverDiscover); // Reset if no keywords selected
        } else {
            const selectedTitles = keywordData.data
                .filter(item => selectedKeywords.includes(item.keyword)) // Find keyword matches
                .flatMap(item => item.title); // Extract titles from matched keywords
    
            const filteredDiscoverData = preserverDiscover.filter(item =>
                selectedTitles.includes(item.title) // Only keep docs matching selected keywords
            );
    
            setDiscoverResponseData(filteredDiscoverData);
        }
    }, [selectedDocs, selectedKeywords, preserverDiscover, keywordData, selectedQualifiers]);
    //discover sections
    const handleTabChange = (event, newValue) => {
        setActiveTab();
    };

    // Handle popover open/close
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    // Handle keyword selection
    const handleKeywordToggle = (keyword) => {
        setSelectedKeywords((prevSelected) => {
            const newKeywords = prevSelected.includes(keyword)
                ? prevSelected.filter(k => k !== keyword) // Remove keyword if already selected
                : [...prevSelected, keyword]; // Add keyword if not selected
    
            return newKeywords;
        });
    };
    //

    const handleNavigate = () => {
        navigate('/extract', { state: { docs: selectedDocs } });
    };
    const handleSelect = (doc) => {
        
        // setSelectedDocs((prevState) =>
        //     prevState.includes(doc) ? prevState.filter(item => item !== doc) : [...prevState, doc]
        // );
        setSelectedDocs(prevState => {
            // Check if the document is already selected, and toggle it
            const updatedState = prevState.includes(doc)
                ? prevState.filter(item => item.title !== doc.title)
                : [...prevState, doc];

            return updatedState;
        });
        
    };
    const fetchIntentData = async (input) => {
        setLoading(true)
        try {
            const response = await Axios.post("https://qxc18i47db.execute-api.us-west-2.amazonaws.com/discover_intent_0", { query: input });
            return response.data.qualifiers;
        } catch (error) {
            console.error("Error fetching intent data", error);
        } finally {
            setLoading(false)
        }
    };
    const fetchDiscoverData = async () => {
        try {
            const response = await Axios.post("https://6pf1ub9mud.execute-api.us-west-2.amazonaws.com/discover_main",
                { query: chatQuery, qualifiers: selectedQualifiers });
            return response.data;
        } catch (error) {
            console.error("Error fetching intent data", error);
        }
        finally {
            setLoading(false)
        }
    };
    const handleSelectOption = (option) => {

        setSelectedQualifiers((prev) =>
            prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
        );
    };
    const handleSubmitSelection = async () => {
        setLoading(true)
        try {
            const disres = await fetchDiscoverData();
            setKeywordData(disres.keyword);
            setPreserverDiscover(disres.values)
            setDiscoverResponseData(disres.values); // Store the final response for MarketTable
            setDiscoverResponseDataS(disres.add_values)
            setKeywords(disres.keyword.data.map(item => item.keyword))
            setShowDoc(true);
            if (disres.keyword.suggested_query && disres.keyword.suggested_query.length > 0) {
                setSuggestions(disres.keyword.suggested_query);
            }
        }
        catch (error) {
            console.error("Error fetching discover data:", error);
        }
    };
    const handleChatSubmit = async (input) => {
        setChatQuery(input)
        setShowDoc(false)
        setSuggestions([])
        setLoading(true)
        try {
            const intres = await fetchIntentData(input);
            setIntResponseData(intres)
        } catch (error) {
            console.error("Error fetching market data:", error);
        }
    };
    return (
        <>
        <Backdrop open={loading} sx={{ color: "#ddd", zIndex: 1300, backdropFilter: "blur(1px)" }}>
            <CircularProgress color="inherit" />
        </Backdrop>

        {discoverResponseData && suggestions.length > 0 && (
            <>
                {/* FAB for opening suggestions */}
                <Fab
                    color="secondary"
                    onClick={(e) => setAnchorElSuggestions(e.currentTarget)}
                    sx={{
                        position: 'fixed',
                        bottom: 50,  
                        right: 20,  
                        zIndex: 1000,
                        animation: `${dropAnimation} 0.5s ease-out`
                    }}
                    title="Suggested Queries"
                >
                    <Typography variant="body1">💡</Typography>
                </Fab>
        
                {/* Popover for displaying suggestions */}
                <Popover
                    open={Boolean(anchorElSuggestions)}
                    anchorEl={anchorElSuggestions}
                    onClose={() => setAnchorElSuggestions(null)}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                >
                    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography variant="h6">Suggested Queries</Typography>
                        {suggestions.map((query, index) => (
                            <Button
                                key={index}
                                variant="outlined"
                                sx={{ textAlign: "left" }}
                                onClick={() => {
                                    setAnchorElSuggestions(null); // Close popover
                                    handleChatSubmit(query); // Start discovery with the selected query
                                    setSelectedQualifiers([])
                                }}
                            >
                                {query}
                            </Button>
                        ))}
                    </Box>
                </Popover>
            </>
        )}
        

        <Box sx={{ height: "100vh", padding: 2, display: "flex", flexDirection: "column" }}>
            {/* First Section (70%) */}
            <Box sx={{ flex: 8, display: "flex", flexDirection: "column" }}>
                <Box sx={{ flex: 1, display: "flex", gap: 2 }}>
                    {/* Left Section */}
                    <MarketTable data={existingData} title="" id="discover" />
                    {/* Right Section */}
                    {intResponseData?.length > 0 && (<Paper sx={{ width: '70vw', overflowY: 'auto', height: '75vh' }}>



                        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                            {!showDoc && Array.isArray(intResponseData) && intResponseData.length > 0 && (
                                <Box sx={{display: "flex", flexWrap: "wrap", flexDirection: "column"}}>
                                    <h3>Enhance your query based on below parameters</h3>
                                    {intResponseData.map((option, index) => (
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Checkbox
                                                    checked={selectedQualifiers.includes(option)}
                                                    onChange={() => handleSelectOption(option)}
                                                />
                                            }
                                            label={option}
                                        />
                                    ))}
                                    <Button variant="contained" onClick={handleSubmitSelection} disabled={selectedQualifiers.length <= 0} sx={{marginTop: "2em"}}>
                                        Submit Selection
                                    </Button>
                                </Box>
                            )}
                            {showDoc && (
                                <Box>
                                    <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} >
                                        <Tab label="Primary" value="p" />
                                        <Tab label="Secondary" value="s" />
                                    </Tabs>
                                    <Divider/>
                                    {activeTab == 'p' && (<>
                                        <Button variant="outlined" onClick={handlePopoverOpen} sx={{ my: 2, mx: 5 }}>
                                            Select Keywords
                                        </Button>

                                        {/* Popover with checkboxes */}
                                        <Popover
                                            open={open}
                                            anchorEl={anchorEl}
                                            onClose={handlePopoverClose}
                                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                        >
                                            <Box sx={{ p: 2, display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
                                                {keywords.map((keyword, index) => (
                                                    <FormControlLabel
                                                        key={index}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedKeywords.includes(keyword)}
                                                                onChange={() => handleKeywordToggle(keyword)}
                                                            />
                                                        }
                                                        label={keyword}
                                                        sx={{textTransform: "capitalize"}}
                                                    />
                                                ))}
                                            </Box>
                                        </Popover>

                                        {/* Document Cards - Section 1 */}
                                        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                                            {discoverResponseData?.map((doc,index) => (
                                                <DocumentCard
                                                    key={"pri "+index}
                                                    doc={doc}
                                                    onSelect={handleSelect}
                                                    isSelected={selectedDocs.some(item => item.title === doc.title)}
                                                    flag = {"pri "+index}
                                                />
                                            ))}
                                        </Box>
                                    </>)}
                                    {activeTab == "s" && <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                                        {discoverResponseDataS.map((doc, index) => (
                                            <DocumentCard
                                                key={"sec "+ index}
                                                doc={doc}
                                                onSelect={handleSelect}
                                                isSelected={selectedDocs.some(item => item.title === doc.title)}
                                                flag = {"sec "+index}
                                            />
                                        ))}
                                    </Box>}
                                </Box>

                            )}
                        </Box>
                    </Paper>)}
                </Box>
                {selectedDocs.length > 0 && (
                    <Fab
                        color="primary"
                        onClick={handleNavigate}
                        sx={{
                            position: 'fixed',
                            bottom: 100,  // Distance from bottom
                            right: 20,    // Distance from left side
                            zIndex: 1000,  // Ensure the button is above other content
                            animation: selectedDocs.length > 0 ? `${dropAnimation} 0.5s ease-out` : 'none',
                        }}
                    >
                        <ExtractIcon titleAccess="Extract" />
                    </Fab>)}

            </Box>

            {/* Second Section (30%) */}
            <Box sx={{ flex: 2, marginTop: 2 }}>
                <Chatbot onChatSubmit={handleChatSubmit} />
            </Box>

        </Box>
        </>
    );
}
export default Discover;