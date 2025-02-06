import { AppBar, Toolbar, Typography } from "@mui/material";
function Header({ title }) {
 return (
<AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
<Toolbar>
<Typography variant="h6">{title}</Typography>
</Toolbar>
</AppBar>
 );
}
export default Header;