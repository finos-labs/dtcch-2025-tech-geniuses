import { Drawer, List, ListItem, ListItemText } from "@mui/material";

import { useNavigate } from "react-router-dom";

const menuItems = [

  { text: "View", path: "/" },

  { text: "Discover", path: "/discover" },

  { text: "Extract", path: "/extract" },

  { text: "Analyze", path: "/analyze" },

  { text: "Report", path: "/report" },

];

function Sidebar({ setTitle }) {

  const navigate = useNavigate();

  return (
<Drawer

      variant="permanent"

      sx={{ width: 200, flexShrink: 0, "& .MuiDrawer-paper": { width: 200 } }}
>
<List>

        {menuItems.map(({ text, path }) => (
<ListItem button key={text} onClick={() => { navigate(path); setTitle(text); }}>
<ListItemText primary={text} />
</ListItem>

        ))}
</List>
</Drawer>

  );

}

export default Sidebar; 