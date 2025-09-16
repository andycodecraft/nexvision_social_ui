// src/components/CreateCollection.jsx
// npm i @mui/material @mui/lab @emotion/react @emotion/styled @mui/icons-material
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Divider,
  Button,
  Tooltip,
  Avatar,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  ListItemAvatar,
  Checkbox, // ⬅️ added
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LaunchIcon from "@mui/icons-material/Launch";
import SearchIcon from "@mui/icons-material/Search";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PublicIcon from "@mui/icons-material/Public";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";
import SvgIcon from "@mui/material/SvgIcon";
import { getProfiles, saveCollection } from "../api/collection";

/* ------------------------ Minimal X/Twitter icon ------------------------ */
function XIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M4 3h4.2l4.2 5.6L16.8 3H20l-6.5 8.5L20 21h-4.2l-4.6-6-4.7 6H4l7-9.3L4 3z" />
    </SvgIcon>
  );
}

/* ----------------------------- Styled bits ----------------------------- */
const GradientHeader = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  background:
    "linear-gradient(135deg, rgba(34,211,238,0.35), rgba(99,102,241,0.35))",
  border: "1px solid rgba(255,255,255,0.10)",
  backdropFilter: "blur(6px)",
}));

const StickyActions = styled(Box)(({ theme }) => ({
  position: "sticky",
  bottom: 0,
  zIndex: theme.zIndex.appBar,
  background: "rgba(13,20,32,0.85)",
  backdropFilter: "blur(8px)",
  borderTop: "1px solid rgba(255,255,255,0.08)",
}));

/* --------------------------- Platform options -------------------------- */
const platformOptions = [
  { key: "Twitter", label: "X (Twitter)", icon: XIcon, color: "#1D9BF0" },
  {
    key: "instagram",
    label: "Instagram",
    icon: InstagramIcon,
    color: "#E1306C",
  },
  { key: "Facebook", label: "Facebook", icon: FacebookIcon, color: "#1877F2" },
  { key: "Youtube", label: "YouTube", icon: YouTubeIcon, color: "#FF0000" },
  { key: "LinkedIn", label: "LinkedIn", icon: LinkedInIcon, color: "#0A66C2" },
  { key: "Tiktok", label: "TikTok", icon: MusicNoteIcon, color: "#25F4EE" },
  { key: "web", label: "Web", icon: PublicIcon, color: "#22d3ee" },
];

/* ------------------- Debounced, abortable people search ------------------- */
function usePeopleSearch(query, minLen = 2, delay = 300, platform = "Twitter") {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const ctrlRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!query || query.trim().length < minLen) {
      setResults([]);
      setLoading(false);
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (ctrlRef.current) ctrlRef.current.abort();
      const ctrl = new AbortController();
      ctrlRef.current = ctrl;

      setLoading(true);
      try {
        const { ok, data } = await getProfiles({ platform, query });
        if (!ok || !data?.status) setResults([]);
        else setResults(Array.isArray(data.response) ? data.response : []);
      } catch (e) {
        if (e.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timerRef.current);
      if (ctrlRef.current) ctrlRef.current.abort();
    };
  }, [query, minLen, delay, platform]);

  return { results, loading };
}

/* ------------------------------ Tag (pill) ------------------------------ */
function TagPill({
  text,
  color = "primary.main",
  Icon = LinkedInIcon,
  onDelete,
}) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.25,
        py: 0.75,
        bgcolor: "rgba(34,211,238,0.16)",
        border: "1px solid rgba(34,211,238,0.35)",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: color,
          opacity: 0.9,
        }}
      />
      <Typography sx={{ fontWeight: 700 }}>{text}</Typography>
      <Icon sx={{ fontSize: 16, color, opacity: 0.9 }} />
      <IconButton
        size="small"
        onClick={onDelete}
        aria-label="remove"
        sx={{ p: 0.25 }}
      >
        ×
      </IconButton>
    </Box>
  );
}

/* ------------------------------ Main page ------------------------------ */
export default function CreateCollectionPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("x");
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [starting, setStarting] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [open, setOpen] = useState(false);
  const startCtrlRef = useRef(null);
  const { results, loading } = usePeopleSearch(inputValue, 2, 300, platform);
  const activePlatform = platformOptions.find((p) => p.key === platform);

  const clearAll = () => {
    setName("");
    setPlatform("x");
    setUsernames([]);
    setSnack({ open: true, severity: "info", message: "Cleared all fields." });
  };

  const onSaveDraft = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSnack({ open: true, severity: "success", message: "Draft saved." });
    }, 700);
  };

  const onStart = async () => {
    // Basic validation
    if (!name.trim()) {
      setSnack({
        open: true,
        severity: "warning",
        message: "Please enter a collection name.",
      });
      return;
    }
    if (!Array.isArray(selectedProfiles) || selectedProfiles.length === 0) {
      setSnack({
        open: true,
        severity: "warning",
        message: "Select at least one profile.",
      });
      return;
    }

    try {
      setStarting(true);

      if (startCtrlRef.current) startCtrlRef.current.abort();
      startCtrlRef.current = new AbortController();

      const usernames = selectedProfiles
        .map((p) => (p?.username || "").trim())
        .filter(Boolean);

      const seen = new Set();
      const dedupedProfiles = selectedProfiles.filter((p) => {
        const u = (p?.username || "").toLowerCase();
        if (!u || seen.has(u)) return false;
        seen.add(u);
        return true;
      });

      const payload = {
        name: name.trim(),
        platform,
        profiles: dedupedProfiles,
      };
      
      const { ok, data } = await saveCollection(payload);
      // const data = await createCollection(payload, { signal: startCtrlRef.current.signal });
      setSnack({
        open: true,
        severity: "success",
        message: "Collection created!",
      });
      navigate("/startpage/dashboard");
    } catch (err) {
      if (err.name !== "AbortError") {
        const msg = (err?.message || "").slice(0, 500) || "Request failed.";
        setSnack({
          open: true,
          severity: "error",
          message: `Failed to start collection: ${msg}`,
        });
      }
    } finally {
      setStarting(false);
    }
  };

  // Normalize option/string to a handle (no leading @)
  const optionToHandle = (opt) => {
    if (!opt) return "";
    if (typeof opt === "string") return opt.replace(/^@/, "");
    return (opt.username || opt.name || "").replace(/^@/, "");
  };

  const normalizeOption = (opt) => {
    if (!opt) return null;
    if (typeof opt === "string") {
      const username = opt.replace(/^@/, "").trim();
      if (!username) return null;
      return {
        id: `manual:${username}`,
        username,
        name: username,
        description: "",
        profileImage: "",
        platform, // current selected platform
        source: "manual", // mark it came from free typing
      };
    }
    // attach platform if not present
    return { platform, source: "search", ...opt };
  };

  const dedupeByUsername = (arr) => {
    const seen = new Set();
    const out = [];
    for (const p of arr) {
      const u = (p?.username || "").toLowerCase();
      if (!u || seen.has(u)) continue;
      seen.add(u);
      out.push(p);
    }
    return out;
  };

  const addHandle = (h) => {
    const clean = (h || "").trim().replace(/^@/, "");
    if (!clean) return;
    setUsernames((prev) => [...new Set([...prev, clean])]);
  };

  const removeHandle = (h) =>
    setUsernames((prev) => prev.filter((x) => x !== h));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <GradientHeader
        sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, mb: 3 }}
      >
        <Box display="flex" alignItems="center" gap={2}>
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
              Create Account Based Project
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track posts from a single platform using the usernames you add
              below.
            </Typography>
          </Box>
        </Box>
      </GradientHeader>

      <Grid container spacing={3}>
        {/* Left */}
        <Grid item xs={12} md={7}>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.04)",
            }}
          >
            {/* Name */}
            <TextField
              fullWidth
              label="Collection Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CollectionsBookmarkOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Open collections manager">
                      <IconButton size="small">
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            <Divider sx={{ my: 3 }} />

            {/* Platform */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Platform
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={platform}
              onChange={(_, v) => v && setPlatform(v)}
              sx={{ flexWrap: "wrap", gap: 1 }}
            >
              {platformOptions.map(({ key, label, icon: Icon, color }) => (
                <ToggleButton
                  key={key}
                  value={key}
                  sx={{ textTransform: "none" }}
                >
                  <Stack direction="row" gap={1} alignItems="center">
                    <Icon sx={{ color }} fontSize="small" />
                    <Typography variant="body2">{label}</Typography>
                  </Stack>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Divider sx={{ my: 3 }} />

            {/* Usernames */}
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
            >
              <AlternateEmailIcon fontSize="small" />
              Type usernames
              <Tooltip title="Type to search. Click multiple results; the menu stays open. Press Enter to add free text.">
                <InfoOutlinedIcon fontSize="small" sx={{ opacity: 0.6 }} />
              </Tooltip>
            </Typography>

            {/* ===== Autocomplete: multi-select, menu stays open ===== */}
            <Autocomplete
              multiple
              freeSolo
              disableCloseOnSelect // ← keep menu open after each click
              clearOnBlur={false}
              blurOnSelect={false}
              value={selectedProfiles} // ← control selected values as strings
              options={results}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={(_, reason) => {
                // keep it open on select/remove; allow close on blur/escape
                setOpen(true);
                if (reason === "selectOption" || reason === "removeOption")
                  return setOpen(true);
                setOpen(false);
              }}
              filterOptions={(x) => x}
              inputValue={inputValue}
              onInputChange={(_, v, reason) => {
                // DON'T let MUI wipe the text after selecting an option
                if (reason === "selectOption") return; // keep current inputValue
                if (reason === "clear") return setInputValue(""); // only when user clicks the clear 'X'
                setInputValue(v);
              }}
              onChange={(_, newValue) => {
                // newValue can be strings and/or option objects
                const normalized = dedupeByUsername(
                  newValue.map(normalizeOption).filter(Boolean)
                );
                setSelectedProfiles(normalized);
                setOpen(true);
              }}
              isOptionEqualToValue={(opt, val) =>
                (opt?.username || "").toLowerCase() ===
                (val?.username || "").toLowerCase()
              }
              getOptionLabel={(opt) =>
                typeof opt === "string" ? opt : opt?.name || opt?.username || ""
              }
              openOnFocus
              autoHighlight
              loading={loading}
              renderTags={() => null} // we render pills below instead
              loadingText="Searching…"
              noOptionsText={
                inputValue.length < 2
                  ? "Type at least 2 characters"
                  : "No matches"
              }
              renderOption={(props, option) => {
                const handle = optionToHandle(option);
                const selected = selectedProfiles.some(
                  (p) =>
                    (p.username || "").toLowerCase() === handle.toLowerCase()
                );
                const primary = option.name || option.username || "Unknown";
                const secondary = [
                  option.description,
                  option.username && !option.username.startsWith('@') ? `@${option.username}` : option.username,
                ]
                  .filter(Boolean)
                  .join(" • ");

                return (
                  <ListItem
                    {...props}
                    key={option.id || option.username}
                    sx={{ py: 0.5 }}
                    // prevent input from losing focus on checkbox mousedown
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checkbox
                        edge="start"
                        checked={selected}
                        tabIndex={-1}
                        disableRipple
                        onMouseDown={(e) => e.preventDefault()}
                      />
                    </ListItemIcon>
                    <ListItemAvatar>
                      <Avatar src={option.profileImage || ""}>
                        {(primary || "?").slice(0, 1)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primaryTypographyProps={{ fontWeight: 600 }}
                      primary={primary}
                      secondary={secondary}
                    />
                  </ListItem>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={`Type the username on ${
                    activePlatform?.label || "platform"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputValue.trim()) {
                      e.preventDefault();
                      const next = dedupeByUsername([
                        ...selectedProfiles,
                        normalizeOption(inputValue),
                      ]);
                      setSelectedProfiles(next);
                      setOpen(true);
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress size={18} sx={{ mr: 1 }} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {/* Selected pills below */}
            {selectedProfiles.length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {selectedProfiles.map((p) => (
                    <TagPill
                      key={p.username}
                      text={p.username}
                      Icon={activePlatform?.icon || LinkedInIcon}
                      color={activePlatform?.color || "#0A66C2"}
                      onDelete={() =>
                        setSelectedProfiles((prev) =>
                          prev.filter(
                            (x) =>
                              (x.username || "").toLowerCase() !==
                              (p.username || "").toLowerCase()
                          )
                        )
                      }
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right */}
        <Grid item xs={12} md={5}>
          <Stack spacing={2}>
            <Card sx={{ borderRadius: 3, bgcolor: "rgba(255,255,255,0.04)" }}>
              <CardContent>
                <Stack direction="row" alignItems="center" gap={1.5}>
                  {activePlatform?.icon && (
                    <Avatar
                      sx={{
                        bgcolor: "rgba(34,211,238,0.18)",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <activePlatform.icon
                        sx={{ color: activePlatform.color }}
                      />
                    </Avatar>
                  )}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Selected platform
                    </Typography>
                    <Typography variant="h6" fontWeight={800}>
                      {activePlatform?.label}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, bgcolor: "rgba(255,255,255,0.04)" }}>
              <CardContent>
                <Stack direction="row" alignItems="center" gap={1}>
                  <TipsAndUpdatesRoundedIcon color="primary" />
                  <Typography variant="h6" fontWeight={800}>
                    Tips
                  </Typography>
                </Stack>
                <List dense sx={{ mt: 1 }}>
                  {[
                    "Select a platform you want to search.",
                    "Click multiple rows; the menu stays open.",
                    "Press Enter to add a free-typed handle.",
                  ].map((t) => (
                    <ListItem key={t} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleRoundedIcon
                          sx={{ color: "primary.main" }}
                          fontSize="small"
                        />
                      </ListItemIcon>
                      <ListItemText primary={t} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Sticky actions */}
      <StickyActions mt={3}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={1.5}
            justifyContent="flex-end"
          >
            <Button
              onClick={onSaveDraft}
              startIcon={<SaveOutlinedIcon />}
              disabled={saving}
              variant="outlined"
            >
              {saving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={clearAll}
              startIcon={<RestartAltOutlinedIcon />}
              color="error"
              variant="outlined"
            >
              Clear All
            </Button>
            <Button
              onClick={onStart}
              startIcon={<PlayArrowRoundedIcon />}
              variant="contained"
            >
              {starting ? "Starting..." : "Start Collection"}
            </Button>
          </Stack>
        </Container>
      </StickyActions>

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

/* ---------------- Optional local mock for getProfiles ----------------
export async function getProfiles({ platform, query }) {
  await new Promise((r) => setTimeout(r, 350));
  const pool = [
    { id: "1", name: "Wil Chow", username: "wil-chow-6b30071", description: "VP Growth" },
    { id: "2", name: "CapeNature", username: "cape-nature", description: "Conservation" },
    { id: "3", name: "Greenpeace", username: "greenpeace", description: "NGO" },
  ];
  const filtered = pool.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.username.toLowerCase().includes(query.toLowerCase())
  );
  return { ok: true, data: { status: true, response: filtered } };
}
--------------------------------------------------------------------- */
