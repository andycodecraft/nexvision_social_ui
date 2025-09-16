// npm i @mui/material @mui/lab @emotion/react @emotion/styled @mui/icons-material
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardHeader,
  IconButton,
  Typography,
  Chip,
  Stack,
  Avatar,
  AvatarGroup,
  Tooltip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Skeleton,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useProfiles } from "../context/ProfilesContext";
import { styled } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PublicIcon from "@mui/icons-material/Public";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SvgIcon from "@mui/material/SvgIcon";
import { listCollections, removeCollection } from "../api/collection";

const RADIUS_PX = 8;
// Minimal X icon
function XIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M4 3h4.2l4.2 5.6L16.8 3H20l-6.5 8.5L20 21h-4.2l-4.6-6-4.7 6H4l7-9.3L4 3z" />
    </SvgIcon>
  );
}

const platforms = [
  { key: "all", label: "All", color: "default" },
  { key: "LinkedIn", label: "", color: "#0A66C2", Icon: LinkedInIcon },
  { key: "x", label: "", color: "#1D9BF0", Icon: XIcon },
  {
    key: "instagram",
    label: "",
    color: "#E1306C",
    Icon: InstagramIcon,
  },
  { key: "facebook", label: "", color: "#1877F2", Icon: FacebookIcon },
  { key: "youtube", label: "", color: "#FF0000", Icon: YouTubeIcon },
  { key: "tiktok", label: "", color: "#25F4EE", Icon: MusicNoteIcon },
  { key: "web", label: "", color: "#22d3ee", Icon: PublicIcon },
];

const GradientHeader = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(34,211,238,0.20), rgba(99,102,241,0.20))",
  border: "1px solid rgba(255,255,255,0.10)",
  backdropFilter: "blur(6px)",
}));

const Cover = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 180,
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundImage:
    "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.55))",
}));

const Overlay = styled(Box)(() => ({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "#fff",
  padding: 16,
}));

const ActionDots = ({ onEdit, onOpen, onDelete }) => {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ position: "absolute", top: 8, right: 8, color: "common.white" }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onOpen?.();
          }}
        >
          <OpenInNewIcon fontSize="small" sx={{ mr: 1 }} /> Open
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onEdit?.();
          }}
        >
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onDelete?.();
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </>
  );
};

function prettyDate(iso) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "";
  }
}

export default function DashboardPage() {
  const [tab, setTab] = useState("active"); // "active" | "inactive" | "all"
  const [platform, setPlatform] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const { profiles, setProfiles } = useProfiles();

  // Fetch collections
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      const { ok, data } = await listCollections({
        status: tab === "all" ? undefined : tab,
        q: query || undefined,
        platform: platform === "all" ? undefined : platform,
      });
      if (!mounted) return;
      if (!ok || data?.status === false) {
        setError(data?.message || "Failed to load collections.");
        setRows([]);
      } else {
        // Accept either {status:true,response:[...]} or array directly
        const items = Array.isArray(data?.response)
          ? data.response
          : Array.isArray(data)
          ? data
          : [];
        setRows(items);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [tab, platform]); // (query) filtered client-side for instant feel

  // Client-side quick filter by name/usernames
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((c) => {
      const inName = (c?.name || "").toLowerCase().includes(q);
      const inProfiles = (c?.profiles || []).some(
        (p) =>
          (p?.name || "").toLowerCase().includes(q) ||
          (p?.username || "").toLowerCase().includes(q)
      );
      return inName || inProfiles;
    });
  }, [rows, query]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collection?")) return;
    const { ok } = await removeCollection(id);
    if (ok) setRows((r) => r.filter((x) => x._id !== id));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <GradientHeader sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          gap={2}
          justifyContent="space-between"
        >
          <Stack direction="row" gap={1.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "#000",
                width: 44,
                height: 44,
              }}
            >
              <CollectionsBookmarkOutlinedIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Assets
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Saved collections dashboard
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "center" }}
            gap={1.5}
          >
            <TextField
              size="small"
              placeholder="Search collections or profiles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280 }}
            />
            <ToggleButtonGroup
              size="small"
              value={platform}
              exclusive
              onChange={(_, v) => v && setPlatform(v)}
              sx={{ flexWrap: "wrap" }}
            >
              {platforms.map(({ key, label, Icon, color }) => (
                <ToggleButton
                  key={key}
                  value={key}
                  sx={{ textTransform: "none", px: 1.1 }}
                >
                  {Icon ? (
                    <Icon fontSize="small" sx={{ mr: 0.75, color }} />
                  ) : null}
                  {label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 2 }}>
          <Tab label="Active Projects" value="active" />
          <Tab label="Inactive Projects" value="inactive" />
          <Tab label="All" value="all" />
        </Tabs>
      </GradientHeader>

      {/* Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
              <Card>
                <Skeleton variant="rectangular" height={180} />
                <CardContent>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                  <Skeleton width="80%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Box sx={{ p: 6, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="h6">Failed to load</Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {error}
          </Typography>
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ p: 6, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="h6">No collections</Typography>
          <Typography variant="body2">
            Try a different search or filter.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((col) => {
            const first = col?.profiles?.[0];
            const coverUrl = first?.image || "";
            const plat = (col?.platform || first?.platform || "").toString();
            const PlatIcon =
              platforms.find((p) => p.key.toLowerCase() === plat.toLowerCase())
                ?.Icon || LinkedInIcon;
            const platColor =
              platforms.find((p) => p.key.toLowerCase() === plat.toLowerCase())
                ?.color || "#0A66C2";
            const count = (col?.profiles || []).length;

            return (
              <Grid
                key={col._id || col.id || col.name}
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <Card
                  sx={{
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    minWidth: 320,
                  }}
                  elevation={3}
                >
                  <Box sx={{ position: "relative" }}>
                    <Cover
                      sx={{
                        backgroundImage: `${
                          coverUrl ? `url("${coverUrl}")` : ""
                        }, linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.65))`,
                      }}
                    >
                      <Overlay>
                        <Box>
                          <Typography
                            variant="h5"
                            fontWeight={800}
                            sx={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                          >
                            {col.name}
                          </Typography>
                          <Stack
                            direction="row"
                            gap={1}
                            justifyContent="center"
                            sx={{ mt: 1 }}
                          >
                            <Chip
                              size="small"
                              icon={<PlatIcon sx={{ color: platColor }} />}
                              label={plat || "Platform"}
                              sx={{
                                color: "#fff",
                                bgcolor: "rgba(255,255,255,0.18)",
                                borderColor: "rgba(255,255,255,0.3)",
                              }}
                              variant="outlined"
                            />
                            <Chip
                              size="small"
                              label={`${count} profile${
                                count === 1 ? "" : "s"
                              }`}
                              sx={{
                                color: "#fff",
                                bgcolor: "rgba(255,255,255,0.18)",
                              }}
                            />
                          </Stack>
                        </Box>
                      </Overlay>

                      <ActionDots
                        onOpen={() => console.log("open", col)}
                        onEdit={() => console.log("edit", col)}
                        onDelete={() => handleDelete(col._id)}
                      />
                    </Cover>
                  </Box>

                  <CardContent sx={{ pt: 2 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Top profiles
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {prettyDate(col?.createdAt)}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <AvatarGroup
                        max={4}
                        sx={{
                          "& .MuiAvatar-root": {
                            width: 34,
                            height: 34,
                            fontSize: 14,
                            cursor: "pointer", // show pointer on hover
                          },
                        }}
                      >
                        {(col.profiles || []).slice(0, 6).map((p) => {
                          const link =
                            p.platform?.toLowerCase() === "linkedin"
                              ? `https://www.linkedin.com/in/${p.username}`
                              : p.platform?.toLowerCase() === "x"
                              ? `https://twitter.com/${p.username}`
                              : "#";

                          return (
                            <Tooltip
                              key={p.username}
                              title={`${p.name || p.username}${
                                p.username ? ` (@${p.username})` : ""
                              }`}
                            >
                              <Box
                                component="span"
                                onClick={() =>
                                  link !== "#" && window.open(link, "_blank")
                                }
                                sx={{ display: "inline-flex" }}
                              >
                                <Avatar src={p.image || ""}>
                                  {(p?.name || p?.username || "?").slice(0, 1)}
                                </Avatar>
                              </Box>
                            </Tooltip>
                          );
                        })}
                      </AvatarGroup>

                      <Badge
                        color="primary"
                        badgeContent={count}
                        sx={{ mr: 0.5, ml: 2 }}
                      >
                        <Chip
                          size="small"
                          label="Profiles"
                          variant="outlined"
                        />
                      </Badge>
                    </Stack>
                  </CardContent>

                  <CardActionArea
                    onClick={() => {
                      console.log("open", col);
                      setProfiles(col);
                    }}
                    component={RouterLink}
                    to={`/startpage/dashboard/${col._id}`}
                    sx={{ borderTop: "1px solid", borderColor: "divider" }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: "primary.main", color: "#000" }}>
                          <OpenInNewIcon />
                        </Avatar>
                      }
                      title="Open collection"
                      subheader="View posts and analytics"
                    />
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
