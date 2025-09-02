// StartPage.tsx
// npm i @mui/material @emotion/react @emotion/styled @mui/icons-material
import * as React from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ImageIcon from "@mui/icons-material/Image";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { NavLink, Outlet } from "react-router-dom";

const drawerWidth = 240;

const theme = createTheme({
  palette: { mode: "dark", primary: { main: "#22d3ee" } }, // cyan
  shape: { borderRadius: 16 },
  typography: { fontWeightBold: 800 },
});

const navItems = [
  { label: "Dashboard",   icon: <DashboardIcon />, to: "/dashboard", end: true },
  { label: "Track",       icon: <SearchIcon />,    to: "/track" },
  { label: "Personality", icon: <PersonIcon />,    to: "/personality" },
  { label: "Image Search",icon: <ImageIcon />,     to: "/image-search" },
  { label: "Setup",       icon: <SettingsIcon />,  to: "/setup" },
];

export default function StartPage() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const drawer = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "rgba(255,255,255,0.04)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          NEXVISION
        </Typography>
      </Toolbar>

      <List sx={{ px: 1, py: 0.5, gap: 0.25, display: "grid" }}>
        {navItems.map((i) => {
          const Button = (
            <ListItemButton
              key={i.label}
              component={NavLink}
              to={i.to}
              // @ts-ignore (NavLink's 'end' prop pass-through)
              end={i.end}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                px: { xs: 1, md: 1.25 },
                py: 1,
                gap: 1,
                transition: "background-color 120ms, transform 120ms",
                "& .MuiListItemIcon-root": {
                  minWidth: 0,
                  mr: { xs: 0, md: 1.25 },
                  justifyContent: "center",
                },
                "&.active": {
                  bgcolor: "rgba(255,255,255,0.10)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                },
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: 2,
                },
              }}
            >
              <ListItemIcon>{i.icon}</ListItemIcon>
              <ListItemText
                primary={i.label}
                primaryTypographyProps={{ fontWeight: 600 }}
                sx={{ display: { xs: "none", md: "block" } }}
              />
            </ListItemButton>
          );

          return (
            <Box key={i.label}>
              {/* Tooltip helps on xs where label is hidden */}
              <Tooltip title={i.label} arrow disableHoverListener={{ md: true }}>
                {Button}
              </Tooltip>
            </Box>
          );
        })}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#0b0f15" }}>
        {/* Top bar (mobile) */}
        <Box
          component="header"
          sx={{
            position: { xs: "sticky", md: "static" },
            top: 0,
            zIndex: (t) => t.zIndex.appBar,
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            bgcolor: "rgba(13,20,32,0.8)",
            backdropFilter: "blur(6px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            width: "100%",
          }}
        >
          <IconButton color="inherit" onClick={() => setMobileOpen((v) => !v)}>
            <MenuIcon />
          </IconButton>
          <Typography fontWeight={800}>NEXVISION</Typography>
          <Box sx={{ width: 40 }} />
        </Box>

        {/* Permanent drawer on md+, temporary on mobile */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Right-side: render active page */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
            ml: { md: `${drawerWidth / 2}px` }, // ensure content doesn't sit under drawer
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
