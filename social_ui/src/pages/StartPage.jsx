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
  Tooltip,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ImageIcon from "@mui/icons-material/Image";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NavLink, Outlet } from "react-router-dom";

const drawerWidth = 240;
const HEADER_HEIGHT = 64;

const theme = createTheme({
  palette: { mode: "dark", primary: { main: "#22d3ee" } },
  shape: { borderRadius: 16 },
  typography: { fontWeightBold: 800 },
});

const navItems = [
  { label: "Dashboard",   icon: <DashboardIcon />, to: "/startpage/dashboard", end: true },
  { label: "Track",       icon: <SearchIcon />,    to: "/startpage/track" },
  { label: "Personality", icon: <PersonIcon />,    to: "/startpage/personality" },
  { label: "Image Search",icon: <ImageIcon />,     to: "/startpage/image-search" },
  { label: "Setup",       icon: <SettingsIcon />,  to: "/startpage/setup" },
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
      <List sx={{ mt: 3, px: 1, py: 0.5, gap: 0.25, display: "grid" }}>
        {navItems.map((i) => (
          <Tooltip key={i.label} title={i.label} arrow disableHoverListener={{ md: true }}>
            <ListItemButton
              component={NavLink}
              to={i.to}
              // @ts-ignore
              end={i.end}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                px: { xs: 1, md: 1.25 },
                py: 1,
                gap: 1,
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
              }}
            >
              <ListItemIcon>{i.icon}</ListItemIcon>
              <ListItemText
                primary={i.label}
                primaryTypographyProps={{ fontWeight: 600 }}
                sx={{ display: { xs: "none", md: "block" } }}
              />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* -------- Top Header (like your screenshot) -------- */}
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          height: HEADER_HEIGHT,
          justifyContent: "center",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.70) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(6px)",
          zIndex: (t) => t.zIndex.drawer + 1, // stay above drawer
        }}
      >
        <Toolbar sx={{ minHeight: HEADER_HEIGHT, px: 2 }}>
          {/* Left: logo + burger (burger hidden on md+) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileOpen((v) => !v)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Replace the img src with your logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src="/image/logo/logo.png"
                alt="Nexvision"
                sx={{ height: 50, display: { xs: "none", md: "block" } }}
              />
            </Box>
          </Box>

          {/* Center filler (keeps header flat & clean) */}
          <Box sx={{ flex: 1 }} />

          {/* Right: user area */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 0.5, borderColor: "rgba(255,255,255,0.12)" }}
            />
            <Avatar sx={{ width: 28, height: 28 }}>W</Avatar>
            <Typography sx={{ display: { xs: "none", md: "block" } }}>wilson</Typography>
            <IconButton size="small" color="inherit">
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* -------- Layout below header -------- */}
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#0b0f15" }}>
        {/* Side nav: temporary on mobile, permanent on md+; both sit under header */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                mt: `${HEADER_HEIGHT}px`,
                height: `calc(100% - ${HEADER_HEIGHT}px)`,
              },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                mt: `${HEADER_HEIGHT}px`,
                height: `calc(100% - ${HEADER_HEIGHT}px)`,
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main content: add top margin equal to header height */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 3 },
            mt: `${HEADER_HEIGHT}px`,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
