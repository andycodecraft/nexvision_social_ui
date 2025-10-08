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
import PeopleListDialog from "./PeopleListDialog";
import CommentsListDialog from "./CommentsListDialog";

// --- Helpers ---------------------------------------------------------------

// Platform mapping with standard MUI icons
const platformMap = {
  Facebook: { icon: FacebookIcon, color: "#1877F2" },
  YouTube: { icon: YouTubeIcon, color: "#FF0000" },
  LinkedIn: { icon: LinkedInIcon, color: "#0A66C2" },
  TikTok: { icon: MusicNoteIcon, color: "#25F4EE" },
  Twitter: { icon: TwitterIcon, color: "#22d3ee" },
  Instagram: { icon: InstagramIcon, color: "#E4405F" },
};

const getPlatform = (source) => {
  if (!source) return null;
  const key = Object.keys(platformMap).find(
    (k) => k.toLowerCase() === String(source).toLowerCase()
  );
  return key ? platformMap[key] : null;
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

// --- Component -------------------------------------------------------------

export default function PostsTable({
  data,
  minH = 360,
  maxH = 380,
  contentHeight = 96,
  galleryHeight = 160, // new: max visible height for gallery
}) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Likes dialog state
  const [likesOpen, setLikesOpen] = useState(false);
  const [likesPeople, setLikesPeople] = useState([]); // { name, url, position, image_url }[]

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsPeople, setCommentsPeople] = useState([]);

  const list = useMemo(() => data || [], [data]);

  const handleOpenUser = (u) => {
    if (!u) return;
    const normalized = typeof u === "string" ? { name: u } : u;
    setUser(normalized);
    setOpen(true);
  };

  const openLikesDialog = (likePeople = []) => {
    setLikesPeople(Array.isArray(likePeople) ? likePeople : []);
    setLikesOpen(true);
  };

  const openCommentsDialog = (commentPeople = []) => {            // <-- NEW
    setCommentsPeople(Array.isArray(commentPeople) ? commentPeople : []);
    setCommentsOpen(true);
  };

  const extractImages = (item) => {
    const arr = Array.isArray(item?.images) ? item.images : [];
    return arr
      .map((img) => ({
        url: img?.url || img?.src || "",
        width: img?.width,
        height: img?.height,
      }))
      .filter((i) => !!i.url);
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
            typeof item.user === "object" && item.user !== null
              ? item.user
              : null;

          const content =
            item.content ||
            item.cleanTitle ||
            item.text ||
            item.caption ||
            item.title ||
            "";

          const pageLink = item.url || null;

          // Likes data
          const likePeople = item.like_people || item.likePeople || [];
          const likesCount = item.likes ?? 0;
          const canShowLikes =
            Array.isArray(likePeople) && likePeople.length > 0;

            const commentPeople =
            item.comment_detail || item.commentDetail || item.comments_detail || [];
          const commentsCount = item.comments ?? (Array.isArray(commentPeople) ? commentPeople.length : 0);
          const canShowComments = Array.isArray(commentPeople) && commentPeople.length > 0;

          // Images
          const images = extractImages(item);
          const hasImages = images.length > 0;

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

                {/* Content */}
                <Row label="Title">
                  <Box
                    sx={{
                      maxHeight: contentHeight,
                      overflowY: "auto",
                      pr: 1,
                      bgcolor: "transparent",
                      border: "none",
                      p: 0,
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

                {/* Page link */}
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

                {/* Image gallery */}
                {hasImages && (
                  <Row label="Images">
                    <Box
                      sx={{
                        maxHeight: galleryHeight,
                        overflowY: "auto",
                        pr: 1,
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(2, minmax(0, 1fr))",
                          sm: "repeat(3, minmax(0, 1fr))",
                        },
                        gap: 1,
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
                      {images.map((img, i) => (
                        <Tooltip
                          key={i}
                          title={
                            img.width && img.height
                              ? `${img.width} × ${img.height}`
                              : img.url
                          }
                        >
                          <Box
                            component="a"
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: "block",
                              position: "relative",
                              width: "100%",
                              pt: "66%", // 3:2 placeholder; keeps grid tidy
                              borderRadius: 1,
                              overflow: "hidden",
                              bgcolor: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              "&:hover": { borderColor: "primary.main" },
                            }}
                          >
                            <Box
                              component="img"
                              src={img.url}
                              alt={`post-image-${i}`}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              sx={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        </Tooltip>
                      ))}
                    </Box>
                  </Row>
                )}

                {/* Stats */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    mt: 1.25,
                    "& .stat": {
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                    },
                  }}
                >
                  {/* Likes — clickable if we have like_people */}
                  <Box
                    className="stat"
                    role={canShowLikes ? "button" : undefined}
                    tabIndex={canShowLikes ? 0 : undefined}
                    onClick={
                      canShowLikes
                        ? () => openLikesDialog(likePeople)
                        : undefined
                    }
                    onKeyDown={
                      canShowLikes
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openLikesDialog(likePeople);
                            }
                          }
                        : undefined
                    }
                    sx={{
                      px: canShowLikes ? 0.5 : 0,
                      py: canShowLikes ? 0.25 : 0,
                      borderRadius: 1,
                      cursor: canShowLikes ? "pointer" : "default",
                      "&:hover": canShowLikes
                        ? { bgcolor: "action.hover" }
                        : undefined,
                    }}
                  >
                    <ThumbUpOffAltIcon fontSize="small" />
                    <Typography>{likesCount}</Typography>
                  </Box>

                  <Box className="stat">
                    <ShareOutlinedIcon fontSize="small" />
                    <Typography>{item.shares ?? 0}</Typography>
                  </Box>

                  {/* Comments (clickable)  <-- NEW */}
                  <Box
                    className="stat"
                    role={canShowComments ? "button" : undefined}
                    tabIndex={canShowComments ? 0 : undefined}
                    onClick={
                      canShowComments
                        ? () => openCommentsDialog(commentPeople)
                        : undefined
                    }
                    onKeyDown={
                      canShowComments
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openCommentsDialog(commentPeople);
                            }
                          }
                        : undefined
                    }
                    sx={{
                      px: canShowComments ? 0.5 : 0,
                      py: canShowComments ? 0.25 : 0,
                      borderRadius: 1,
                      cursor: canShowComments ? "pointer" : "default",
                      "&:hover": canShowComments
                        ? { bgcolor: "action.hover" }
                        : undefined,
                    }}
                  >
                    <ChatBubbleOutlineIcon fontSize="small" />
                    <Typography>{commentsCount}</Typography>
                  </Box>
                </Box>

                {/* ID section removed per request */}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Likes dialog — reusable component */}
      <PeopleListDialog
        open={likesOpen}
        onClose={() => setLikesOpen(false)}
        title={`Likes (${likesPeople?.length || 0})`}
        people={likesPeople}
        emptyText="No likes to show."
      />

      {/* Comments dialog  <-- NEW */}
      <CommentsListDialog
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        title={`Comments (${commentsPeople?.length || 0})`}
        comments={commentsPeople}
        emptyText="No comments to show."
      />

      {/* User detail modal */}
      <UserProfileDialog
        open={open}
        onClose={() => setOpen(false)}
        user={user}
      />
    </>
  );
}
