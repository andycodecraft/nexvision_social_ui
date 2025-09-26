// src/pages/CollectionDetailPage.tsx
// npm i @mui/material @mui/icons-material @emotion/react @emotion/styled
import {
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Slider,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import LanguageIcon from "@mui/icons-material/Language";
import CategoryIcon from "@mui/icons-material/Category";
import ReplayIcon from "@mui/icons-material/Replay";
import ArticleIcon from "@mui/icons-material/Article";
import VerifiedIcon from "@mui/icons-material/Verified";
import SortIcon from "@mui/icons-material/Sort";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProfiles } from "../context/ProfilesContext";
import MiniProfilesBar from "../components/MiniProfilesBar";
import PostsTable from "../components/PostsTable";
import { listPosts } from "../api/post";

const platformDefs = [
  { key: "x", label: "X", color: "#1d9bf0" },
  { key: "tg", label: "TG", color: "#2ca5e0" },
  { key: "in", label: "IN", color: "#0a66c2" },
  { key: "ig", label: "IG", color: "#e1306c" },
  { key: "tt", label: "TT", color: "#010101" },
  { key: "am", label: "AMZ", color: "#ff9900" },
  { key: "fb", label: "FB", color: "#1877f2" },
  { key: "yt", label: "YT", color: "#ff0000" },
  { key: "th", label: "TH", color: "#ff5ca1" },
];

export default function CollectionDetailPage() {
  const { collectionId } = useParams();
  const [q, setQ] = useState("");
  const [platforms, setPlatforms] = useState(platformDefs.map((p) => p.key)); // all on
  const [lang, setLang] = useState("all");
  const [topic, setTopic] = useState("all");
  const [original, setOriginal] = useState("all");
  const [type, setType] = useState("all");
  const [unique, setUnique] = useState("false");
  const [sort, setSort] = useState("recency");
  const [view, setView] = useState("grid");
  const [range, setRange] = useState([0, 100]);
  const { profiles } = useProfiles();

  // ✅ NEW: multi-select profile ids
  const [selectedProfileIds, setSelectedProfileIds] = useState([]);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const detail = useMemo(
    () => ({ id: collectionId, name: `Posts for ${profiles.name}`, total: 0 }),
    [collectionId, profiles.name]
  );

  // Load posts
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      const { ok, data } = await listPosts(collectionId);

      if (!cancelled) {
        if (ok) {
          setResults(Array.isArray(data) ? data : data.response || []);
        } else {
          setError((data)?.message || "Failed to load posts");
        }
        setLoading(false);
      }
    }

    if (collectionId) fetchData();
    return () => {
      cancelled = true;
    };
  }, [collectionId]);

  // ✅ Default select all profiles when they arrive
  useEffect(() => {
    const items = Array.isArray(profiles?.profiles) ? profiles.profiles : [];
    if (items.length && selectedProfileIds.length === 0) {
      setSelectedProfileIds(items.map((p) => p.username));
    }
  }, [profiles?.profiles, selectedProfileIds.length]);

  const togglePlatform = (key) => {
    setPlatforms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // ✅ Filter results by selected profile ids (by userid/username/etc.)
  const filteredResults = useMemo(() => {
    if (!results?.length) return [];
    const selected = new Set(
      (selectedProfileIds || []).map((x) => String(x).toLowerCase())
    );

    const ownsPost = (r) => {
      const candidates = [
        r?.userid,
        r?.author?.id
      ]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase());
      return candidates.some((c) => selected.has(c));
    };
    // Start with profile filter
    
    let arr = selected.size ? results.filter(ownsPost) : results;
    
    // (optional) Apply text filter
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      arr = arr.filter(
        (r) =>
          String(r?.title || r?.text || "")
            .toLowerCase()
            .includes(needle) ||
          String(r?.url || r?.pageUrl || "")
            .toLowerCase()
            .includes(needle)
      );
    }

    // TODO: If you want platform filtering too, map `r.source` -> your keys
    // For now, we leave platform chips as UI only.

    // Sort
    if (sort === "recency") {
      arr = [...arr].sort(
        (a, b) => (b.publicationTime || 0) - (a.publicationTime || 0)
      );
    } else if (sort === "engagement") {
      arr = [...arr].sort(
        (a, b) =>
          (b.likes || 0) + (b.shares || 0) + (b.comment || 0) -
          ((a.likes || 0) + (a.shares || 0) + (a.comment || 0))
      );
    }

    return arr;
  }, [results, selectedProfileIds, q, sort]);

  return (
    <Container maxWidth={false} sx={{ py: 2, px: { xs: 1.5, md: 3 } }}>
      {/* Title + meta */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h5" fontWeight={800}>
            {detail.name}
          </Typography>
          <Chip
            size="small"
            variant="outlined"
            color="default"
            label="Feed"
            sx={{ borderColor: "rgba(255,255,255,0.2)" }}
          />
          <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />
          <Typography variant="body2" color="text.secondary">
            ID: {detail.id}
          </Typography>
        </Box>
      </Box>

      {/* Filters bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 1.5,
          bgcolor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Row 1: search + platforms + fake date-range ruler */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4} lg={3.5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setQ("")}>
                      <ReplayIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4.5} lg={5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
              {platformDefs.map((p) => {
                const active = platforms.includes(p.key);
                return (
                  <Tooltip key={p.key} title={p.label} arrow>
                    <Chip
                      clickable
                      onClick={() => togglePlatform(p.key)}
                      label={p.label}
                      avatar={<Avatar sx={{ bgcolor: p.color, color: "#fff" }}>{p.label[0]}</Avatar>}
                      variant={active ? "filled" : "outlined"}
                      sx={{
                        borderColor: active ? "transparent" : "rgba(255,255,255,0.2)",
                        bgcolor: active ? "rgba(255,255,255,0.12)" : "transparent",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>
          </Grid>

          <Grid item xs={12} md={3.5} lg={3.5}>
            <Box sx={{ px: 1 }}>
              <Slider size="small" value={range} onChange={(_, v) => setRange(v)} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: -1 }}>
                <Typography variant="caption" color="text.secondary">Start</Typography>
                <Typography variant="caption" color="text.secondary">End</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Row 2: dropdown filters + sort + view (unchanged UI) */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2.4}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="lang-label">Language</InputLabel>
              <Select
                labelId="lang-label"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                label="Language" // IMPORTANT: must match InputLabel
                startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2.4}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="lang-label">Topic</InputLabel>
              <Select
                labelId="lang-label"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                label="Language" // IMPORTANT: must match InputLabel
                startAdornment={<CategoryIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="en">Politics</MenuItem>
                <MenuItem value="de">Tech</MenuItem>
                <MenuItem value="ja">Finance</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2.4}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="lang-label">Original</InputLabel>
              <Select
                labelId="lang-label"
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                label="Original" // IMPORTANT: must match InputLabel
                startAdornment={<ReplayIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="en">Original</MenuItem>
                <MenuItem value="de">Repost</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2.4}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="lang-label">Type</InputLabel>
              <Select
                labelId="lang-label"
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type" // IMPORTANT: must match InputLabel
                startAdornment={<ArticleIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="txt">Text</MenuItem>
                <MenuItem value="img">Image</MenuItem>
                <MenuItem value="video">Video</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2.4}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="lang-label">Unique</InputLabel>
              <Select
                labelId="lang-label"
                value={unique}
                onChange={(e) => setUnique(e.target.value)}
                label="Unique" // IMPORTANT: must match InputLabel
                startAdornment={<VerifiedIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="false">False</MenuItem>
                <MenuItem value="true">True</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2.4}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="lang-label">Sort</InputLabel>
              <Select
                labelId="lang-label"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                label="Sort" // IMPORTANT: must match InputLabel
                startAdornment={<SortIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="recency">Recency</MenuItem>
                <MenuItem value="engagement">Engagement</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md="auto">
            <ToggleButtonGroup
              exclusive
              size="small"
              value={view}
              onChange={(_, v) => v && setView(v)}
              sx={{ ml: { md: 1 } }}
            >
              <ToggleButton value="grid">
                <GridViewIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs />
          <Grid item xs="auto">
            <Tooltip title="More filters" arrow>
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* ✅ Multi-select profiles bar */}
        <Box sx={{ mt: 1 }}>
          <MiniProfilesBar
            items={profiles?.profiles || []}
            selectedIds={selectedProfileIds}
            onChange={setSelectedProfileIds}
          />
        </Box>
      </Paper>

      <Box sx={{ mt: 2, minHeight: 420, position: "relative" }}>
        {loading && (
          <Typography variant="body2" color="text.secondary">
            Loading posts...
          </Typography>
        )}
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        {!loading && !error && <PostsTable data={filteredResults} view={view} />}
      </Box>
    </Container>
  );
}
