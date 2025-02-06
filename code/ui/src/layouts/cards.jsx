import React, { useState } from 'react';
import { Card, CardContent, CardActions, Checkbox, Box, Typography, Button, Divider } from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';

const DocumentCard = ({ doc, onSelect, isSelected, flag }) => {
  let hideButton = flag.split(" ")[0] == "sec" ? true : false
  let colr = !isSelected ? "success" : "error";
  let text = isSelected ? "Selected" : "Select";
  const getIconByDocumentType = (documentType) => {
  switch (documentType) {
    case "CONCALL":
      return <AudiotrackOutlinedIcon titleAccess='AudioFile' />;
    case "WEB":
      return <LanguageOutlinedIcon titleAccess='Web'/>;
    default:
      return <PictureAsPdfOutlinedIcon titleAccess='Pdf'/>; // Default icon for unknown types
  }
}
  return (
    <Card sx={{ width: 250, margin: 2, boxShadow: 3, display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: "5px solid skyblue" }}>
      <CardContent>
        <Typography variant="h6">
          <a href={doc.source_uri} target="_blank" rel="noopener noreferrer" >
            {doc.Company_Name || 'Doc'}
          </a>
        </Typography>
        <Divider />
        <Typography variant="body2" color="text.secondary">
          {doc.excerpt}
        </Typography>
      </CardContent>
      {hideButton && <Typography sx={{display: "flex", flexDirection: "row-reverse", padding: 1}}>{getIconByDocumentType(doc.Document_Type)}</Typography> }
      {!hideButton && ( <>
        <Divider />
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button variant="contained" color={colr} onClick={() => onSelect(doc)} size='small' startIcon={getIconByDocumentType(doc.Document_Type)}>
          {text}
        </Button>
      </CardActions>
      </>)}
    </Card>
  );
};


export default DocumentCard;
