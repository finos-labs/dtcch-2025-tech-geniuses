import React, { useState } from "react";
import { Box, TextField, Button, Modal, Typography, Paper, CircularProgress, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy"; // Bot Icon

const Chatbot = ({onChatSubmit, from}) => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extract, setExtract] = useState(false);
  const [analyze, setAnalyze] = useState(false);
  
  const handleSend = () => {
    
    if (message.trim()) {
      onChatSubmit(message);
      setLoading(true);
      setMessage("");
      setLoading(false)
      // Simulate delay before showing the modal (e.g., bot processing response)
      // setTimeout(() => {
      //   setLoading(false);
      //   props.from == 'extract' ? setExtract(true) : props.from == 'analyze' ? setAnalyze(true) : setOpen(true);
      // }, 1500); // 1.5-second delay
    }
  };

  const fetchQuery = async (path,formdata) => {
    const url = path == 'extract' ? "https://jw3yqvwye0.execute-api.us-west-2.amazonaws.com/def" : "https://klswll0tw9.execute-api.us-west-2.amazonaws.com/dev";
    
    }

  return (
    <Box sx={{ bottom: 20, right: 20, pl: 1, pr:1 }}>
      {/* Chat Input Box */}
      <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 1, borderRadius: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask me something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SmartToyIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSend} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
        </Button>
      </Paper>

      {/* Modal Window */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6">Chatbot Response</Typography>
          <Typography sx={{ mt: 2 }}>{message}</Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Box>
      </Modal>
     { extract && <Box
          sx={{
            padding: 2,
            margin: 2,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            border: "double",
            height: "61vh"
          }}
        >
          <Typography variant="h6">Chatbot Response</Typography>
          <Typography sx={{ mt: 2 }}>{message}</Typography>
      </Box> }
    </Box>
  );
};

export default Chatbot;
