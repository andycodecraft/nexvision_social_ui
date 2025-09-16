import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PublicIcon from "@mui/icons-material/Public";
import UserProfileDialog from "./UserProfileDialog";

// Platform mapping with standard MUI icons
const platformMap = {
  Facebook: { icon: FacebookIcon, color: "#1877F2" },
  YouTube: { icon: YouTubeIcon, color: "#FF0000" },
  LinkedIn: { icon: LinkedInIcon, color: "#0A66C2" },
  TikTok: { icon: MusicNoteIcon, color: "#25F4EE" },
  Web: { icon: PublicIcon, color: "#22d3ee" },
};

// Fallback: derive platform key from result.source text
const getPlatform = (source) => {
  if (!source) return null;
  const key = Object.keys(platformMap).find(
    (k) => k.toLowerCase() === source.toLowerCase()
  );
  return key ? platformMap[key] : null;
};

const middleTruncate = (str = "", max = 34) => {
  if (!str) return "-";
  if (str.length <= max) return str;
  const keep = Math.floor((max - 3) / 2);
  return `${str.slice(0, keep)}…${str.slice(-keep)}`;
};

const Row = ({ label, link, value, isId }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
    <Box
      sx={{
        width: 100,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      {link && (
        <Tooltip title={link}>
          <IconButton
            component="a"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>

    <Box sx={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 0.5 }}>
      {isId ? (
        <>
          <Tooltip title={value}>
            <Typography
              sx={{
                fontFamily: "monospace",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {middleTruncate(value, 40)}
            </Typography>
          </Tooltip>
          <IconButton size="small" onClick={() => navigator.clipboard?.writeText(value)}>
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </>
      ) : (
        <Typography
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {typeof value === "string" || typeof value === "number" ? value : value ?? "-"}
        </Typography>
      )}
    </Box>
  </Box>
);

export default function PostsTable({ data, minH = 360, maxH = 380 }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const list = useMemo(() => data || [], [data]);

  const handleOpenUser = (u) => {
    if (!u) return;
    // If user is a string, convert to minimal object
    const normalized = typeof u === "string" ? { name: u } : u;
    setUser(normalized);
    setOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        {list.map((item, idx) => {
          const platform = getPlatform(item.source);
          const PlatformIcon = platform?.icon;

          // pull user info if it's an object
          const profile =
            typeof item.user === "object" && item.user !== null ? item.user : null;

          return (
            <Card
              key={idx}
              sx={{
                borderRadius: 1.5,
                bgcolor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                "&:hover": { borderColor: "primary.main" },
                minHeight: minH,
                maxHeight: maxH,
                height: maxH,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ py: 2, px: 2.25, flex: 1 }}>
                {/* Header: Source icon + name, and clickable profile avatar (if present) */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {PlatformIcon ? (
                      <PlatformIcon sx={{ color: platform.color }} />
                    ) : (
                      <Avatar sx={{ width: 24, height: 24 }}>
                        {item.source?.[0]}
                      </Avatar>
                    )}
                    <Typography fontWeight={700}>{item.source}</Typography>
                  </Box>

                  {/* Right: clickable profile avatar if user object present */}
                  {profile ? (
                    <Tooltip title={`Open ${profile.name || "user"} profile`}>
                      <Avatar
                        src={profile.profileImage}
                        alt={profile.name}
                        sx={{
                          width: 40,
                          height: 40,
                          cursor: "pointer",
                          border: "2px solid rgba(255,255,255,0.2)",
                          "&:hover": { borderColor: "primary.main", transform: "scale(1.05)" },
                          transition: "all .15s ease",
                        }}
                        onClick={() => handleOpenUser(profile)}
                      >
                        {(profile.name || "?").slice(0, 1)}
                      </Avatar>
                    </Tooltip>
                  ) : null}
                </Box>

                {/* Title (link icon) */}
                <Row label="Title" link={item.title} />

                {/* UID */}
                <Row label="UID" value={item.uid} isId />

                {/* Page (thumbnail else link icon) */}
                <Row
                  label="Page"
                  link={item.pageUrl}
                />

                {/* Links */}
                <Row
                  label="Links"
                  value={item.links && item.links.length ? item.links.join(", ") : "-"}
                />

                {/* Stats */}
                <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Likes</Typography>
                    <Typography>{item.likes ?? 0}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Shares</Typography>
                    <Typography>{item.shares ?? 0}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Comments</Typography>
                    <Typography>{item.comments ?? 0}</Typography>
                  </Box>
                </Box>

                {/* ID */}
                <Row label="ID" value={item.id} isId />

                {/* Score */}
                <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Score
                    </Typography>
                    <Typography>{item.score}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Normalized Score
                    </Typography>
                    <Typography>{item.normalizedScore}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* User detail modal */}
      <UserProfileDialog open={open} onClose={() => setOpen(false)} user={user} />
    </>
  );
}
