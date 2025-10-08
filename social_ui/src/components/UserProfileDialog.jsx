import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Link as MuiLink,
  Tooltip,
  IconButton,
} from "@mui/material";

import GroupIcon from "@mui/icons-material/Group";                 // Followers
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1"; // Friends
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"; // Mentions
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined"; // Shares
import LinkIcon from "@mui/icons-material/Link";                   // Connections
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined"; // Endorsements
import CloseIcon from "@mui/icons-material/Close";

const PAGE_SIZE = 50;

function SectionHeader({ children }) {
  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <Typography variant="h6" fontWeight={700}>{children}</Typography>
      <Divider sx={{ mt: 0.5, mb: 1 }} />
    </Box>
  );
}

function ClickableStat({ icon, label, value, onClick, disabled }) {
  const clickable = !!onClick && !disabled;
  return (
    <Tooltip title={clickable ? `Show ${label.toLowerCase()} details` : ""} disableHoverListener={!clickable}>
      <Box
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={clickable ? onClick : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          cursor: clickable ? "pointer" : "default",
          "&:hover": clickable ? { bgcolor: "action.hover" } : undefined,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {icon}
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
          {value}
        </Typography>
      </Box>
    </Tooltip>
  );
}

function DetailsDialog({ open, onClose, title, children, maxWidth = "sm" }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" sx={{ flex: 1 }}>{title}</Typography>
        <IconButton aria-label="Close" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function UserProfileDialog({ open, onClose, user }) {
  const [connectionsOpen, setConnectionsOpen] = React.useState(false);
  const [endorsementsOpen, setEndorsementsOpen] = React.useState(false);

  // visible counts for pagination
  const [visible, setVisible] = React.useState({ connections: PAGE_SIZE, endorsements: PAGE_SIZE });

  React.useEffect(() => {
    // reset all when parent dialog closes
    if (!open) {
      setConnectionsOpen(false);
      setEndorsementsOpen(false);
      setVisible({ connections: PAGE_SIZE, endorsements: PAGE_SIZE });
    }
  }, [open]);

  React.useEffect(() => {
    // reset count when opening each dialog
    if (connectionsOpen) {
      setVisible((v) => ({ ...v, connections: PAGE_SIZE }));
    }
  }, [connectionsOpen]);

  React.useEffect(() => {
    if (endorsementsOpen) {
      setVisible((v) => ({ ...v, endorsements: PAGE_SIZE }));
    }
  }, [endorsementsOpen]);

  if (!user) return null;

  const {
    name,
    username,
    headline,
    about,
    pageUrl,
    profileImage,
    source,
    experience = [],
    education = [],
    interest = [],
    connection = [],
    license = [],
    endorsement = [],
    skill = [],
    followers = 0,
    friends = 0,
    mentions = 0,
    shares = 0,
  } = user;

  const connectionsArray = Array.isArray(connection) ? connection : [];
  const endorsementsArray = Array.isArray(endorsement) ? endorsement : [];

  const connectionsCount = connectionsArray.length || Number(connection) || 0;
  const endorsementsCount = endorsementsArray.length || Number(endorsement) || 0;

  const loadMore = (key, total) => {
    setVisible((v) => ({
      ...v,
      [key]: Math.min((v[key] || PAGE_SIZE) + PAGE_SIZE, total),
    }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={profileImage} alt={name} sx={{ width: 56, height: 56 }} />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {name || "Unknown User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {source || ""} {username ? `• ${username}` : ""}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }} />
            <IconButton aria-label="Close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Stats row */}
          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <ClickableStat
              icon={<GroupIcon fontSize="small" />}
              label="Followers"
              value={Number(followers) || 0}
              disabled
            />

            <ClickableStat
              icon={<PersonAddAlt1Icon fontSize="small" />}
              label="Friends"
              value={Number(friends) || 0}
              disabled
            />

            <ClickableStat
              icon={<AlternateEmailIcon fontSize="small" />}
              label="Mentions"
              value={Number(mentions) || 0}
              disabled
            />

            <ClickableStat
              icon={<ShareOutlinedIcon fontSize="small" />}
              label="Shares"
              value={Number(shares) || 0}
              disabled
            />

            {/* New clickable stats */}
            <ClickableStat
              icon={<LinkIcon fontSize="small" />}
              label="Connections"
              value={connectionsCount}
              onClick={connectionsCount > 0 ? () => setConnectionsOpen(true) : undefined}
              disabled={connectionsCount === 0}
            />

            <ClickableStat
              icon={<ThumbUpAltOutlinedIcon fontSize="small" />}
              label="Endorsements"
              value={endorsementsCount}
              onClick={endorsementsCount > 0 ? () => setEndorsementsOpen(true) : undefined}
              disabled={endorsementsCount === 0}
            />
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {headline && (
            <>
              <SectionHeader>Headline</SectionHeader>
              <Typography>{headline}</Typography>
            </>
          )}

          {about && (
            <>
              <SectionHeader>About</SectionHeader>
              <Typography>{about}</Typography>
            </>
          )}

          {pageUrl && (
            <>
              <SectionHeader>Profile</SectionHeader>
              <MuiLink href={pageUrl} target="_blank" rel="noopener noreferrer">
                {pageUrl}
              </MuiLink>
            </>
          )}

          {skill.length > 0 && (
            <>
              <SectionHeader>Skills</SectionHeader>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {skill.map((s, i) => (
                  <Chip key={i} size="small" label={s.title || s} />
                ))}
              </Box>
            </>
          )}

          {experience.length > 0 && (
            <>
              <SectionHeader>Experience</SectionHeader>
              <Box sx={{ display: "grid", gap: 2 }}>
                {experience.map((e, i) => (
                  <Box key={i}>
                    <Typography fontWeight={600}>{e.company}</Typography>
                    <Typography variant="body2">{e.skill || e.position}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {e.period}
                    </Typography>
                    {e.description && (
                      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                        {e.description}
                      </Typography>
                    )}
                    {i < experience.length - 1 && <Divider sx={{ mt: 1 }} />}
                  </Box>
                ))}
              </Box>
            </>
          )}

          {education.length > 0 && (
            <>
              <SectionHeader>Education</SectionHeader>
              <Box sx={{ display: "grid", gap: 2 }}>
                {education.map((ed, i) => (
                  <Box key={i}>
                    <Typography fontWeight={600}>{ed.school}</Typography>
                    <Typography variant="body2">{ed.subtitle}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {ed.period}
                    </Typography>
                    {i < education.length - 1 && <Divider sx={{ mt: 1 }} />}
                  </Box>
                ))}
              </Box>
            </>
          )}

          {interest.length > 0 && (
            <>
              <SectionHeader>Interests</SectionHeader>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {interest.slice(0, 12).map((it, i) => (
                  <Chip key={i} size="small" label={it.name} />
                ))}
              </Box>
            </>
          )}

          {license.length > 0 && (
            <>
              <SectionHeader>Licenses</SectionHeader>
              <Box sx={{ display: "grid", gap: 2 }}>
                {license.map((lc, i) => (
                  <Box key={i}>
                    <Typography fontWeight={600}>{lc.title}</Typography>
                    <Typography variant="body2">{lc.subtitle}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lc.period}
                    </Typography>
                    {i < license.length - 1 && <Divider sx={{ mt: 1 }} />}
                  </Box>
                ))}
              </Box>
            </>
          )}
          {/* Connections and Endorsements remain removed from main dialog */}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Connections dialog with pagination */}
      <DetailsDialog
        open={connectionsOpen}
        onClose={() => setConnectionsOpen(false)}
        title={`Connections (${connectionsCount})`}
        maxWidth="sm"
      >
        {connectionsCount === 0 ? (
          <Typography color="text.secondary">No connections to show.</Typography>
        ) : Array.isArray(connectionsArray) && connectionsArray.length > 0 ? (
          <>
            <Box sx={{ display: "grid", gap: 2 }}>
              {connectionsArray.slice(0, visible.connections).map((ct, i) => (
                <Box key={i}>
                  <Typography fontWeight={600}>{ct.type}</Typography>
                  <Typography variant="body2">{ct.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ct.headline}
                  </Typography>
                  {i < Math.min(visible.connections, connectionsArray.length) - 1 && <Divider sx={{ mt: 1 }} />}
                </Box>
              ))}
            </Box>

            {visible.connections < connectionsArray.length && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() => loadMore("connections", connectionsArray.length)}
                >
                  Load more ({Math.min(PAGE_SIZE, connectionsArray.length - visible.connections)} remaining)
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography color="text.secondary">
            Connections details are unavailable.
          </Typography>
        )}
      </DetailsDialog>

      {/* Endorsements dialog with pagination */}
      <DetailsDialog
        open={endorsementsOpen}
        onClose={() => setEndorsementsOpen(false)}
        title={`Endorsements (${endorsementsCount})`}
        maxWidth="sm"
      >
        {endorsementsCount === 0 ? (
          <Typography color="text.secondary">No endorsements to show.</Typography>
        ) : Array.isArray(endorsementsArray) && endorsementsArray.length > 0 ? (
          <>
            <Box sx={{ display: "grid", gap: 2 }}>
              {endorsementsArray.slice(0, visible.endorsements).map((ed, i) => (
                <Box key={i}>
                  <Typography fontWeight={600}>{ed.name}</Typography>
                  <Typography variant="body2">{ed.subtitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ed.skill}
                  </Typography>
                  {i < Math.min(visible.endorsements, endorsementsArray.length) - 1 && <Divider sx={{ mt: 1 }} />}
                </Box>
              ))}
            </Box>

            {visible.endorsements < endorsementsArray.length && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() => loadMore("endorsements", endorsementsArray.length)}
                >
                  Load more ({Math.min(PAGE_SIZE, endorsementsArray.length - visible.endorsements)} remaining)
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography color="text.secondary">
            Endorsements details are unavailable.
          </Typography>
        )}
      </DetailsDialog>
    </>
  );
}
