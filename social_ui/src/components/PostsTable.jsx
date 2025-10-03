// src/components/PostsTable.jsx
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Tooltip,
  IconButton,
  Link,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import UserProfileDialog from "./UserProfileDialog";

// Platform mapping with standard MUI icons
const platformMap = {
  Facebook: { icon: FacebookIcon, color: "#1877F2" },
  YouTube: { icon: YouTubeIcon, color: "#FF0000" },
  LinkedIn: { icon: LinkedInIcon, color: "#0A66C2" },
  TikTok: { icon: MusicNoteIcon, color: "#25F4EE" },
  Twitter: { icon: TwitterIcon, color: "#22d3ee" },
  Instagram: { icon: InstagramIcon, color: '#E4405F'}
};

const getPlatform = (source) => {
  if (!source) return null;
  const key = Object.keys(platformMap).find(
    (k) => k.toLowerCase() === String(source).toLowerCase()
  );
  return key ? platformMap[key] : null;
};

const middleTruncate = (str = "", max = 34) => {
  if (!str) return "-";
  if (str.length <= max) return str;
  const keep = Math.floor((max - 3) / 2);
  return `${str.slice(0, keep)}…${str.slice(-keep)}`;
};

// Label/value row
const Row = ({ label, children }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 1 }}>
    <Box
      sx={{
        width: 100,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        pt: 0.25,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
  </Box>
);

export default function PostsTable({
  data,
  minH = 360,
  maxH = 380,
  contentHeight = 96,
}) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const list = useMemo(() => data || [], [data]);

  const handleOpenUser = (u) => {
    if (!u) return;
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

          const profile =
            typeof item.user === "object" && item.user !== null ? item.user : null;

          const content =
            item.content ||
            item.cleanTitle ||
            item.text ||
            item.caption ||
            item.title ||
            "";

          const pageLink = item.url || null;

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
                {/* Header */}
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
                          "&:hover": {
                            borderColor: "primary.main",
                            transform: "scale(1.05)",
                          },
                          transition: "all .15s ease",
                        }}
                        onClick={() => handleOpenUser(profile)}
                      >
                        {(profile.name || "?").slice(0, 1)}
                      </Avatar>
                    </Tooltip>
                  ) : null}
                </Box>

                {/* CONTENT — transparent, borderless scroll area */}
                <Row label="Title">
                  <Box
                    sx={{
                      maxHeight: contentHeight,
                      overflowY: "auto",
                      pr: 1,
                      // keep it identical to card background
                      bgcolor: "transparent",
                      border: "none",
                      p: 0,
                      // subtle scrollbar only (no box styling)
                      "&::-webkit-scrollbar": { width: 8 },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderRadius: 8,
                      },
                      "&:hover::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(255,255,255,0.35)",
                      },
                    }}
                  >
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {content || "-"}
                    </Typography>
                  </Box>
                </Row>

                {/* PAGE LINK */}
                <Row label="Page">
                  {pageLink ? (
                    <Tooltip title={pageLink}>
                      <IconButton
                        component="a"
                        href={pageLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        <LinkIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Typography>-</Typography>
                  )}
                </Row>

                {/* STATS */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    mt: 1.25,
                    "& .stat": { display: "flex", alignItems: "center", gap: 0.75 },
                  }}
                >
                  <Box className="stat">
                    <ThumbUpOffAltIcon fontSize="small" />
                    <Typography>{item.likes ?? 0}</Typography>
                  </Box>
                  <Box className="stat">
                    <ShareOutlinedIcon fontSize="small" />
                    <Typography>{item.shares ?? 0}</Typography>
                  </Box>
                  <Box className="stat">
                    <ChatBubbleOutlineIcon fontSize="small" />
                    <Typography>{item.comments ?? 0}</Typography>
                  </Box>
                </Box>

                {/* ID */}
                <Row label="ID">
                  <Tooltip title={item.id}>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {middleTruncate(item.id, 40)}
                    </Typography>
                  </Tooltip>
                  <IconButton
                    size="small"
                    onClick={() => navigator.clipboard?.writeText(item.id)}
                    sx={{ ml: 0.5 }}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </Row>
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
