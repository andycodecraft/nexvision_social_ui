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
  Link,
} from "@mui/material";

function Line({ label, value }) {
  if (!value) return null;
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}

export default function UserProfileDialog({ open, onClose, user }) {
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
  } = user;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar src={profileImage} alt={name} sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="h6">{name || "Unknown User"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {source || ""} {username ? `• @${username}` : ""}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Line label="Headline" value={headline} />
          <Line label="About" value={about} />
          {pageUrl && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Profile</Typography>
              <Link href={pageUrl} target="_blank" rel="noopener noreferrer">
                {pageUrl}
              </Link>
            </Box>
          )}

          {skill.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Skills
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {skill.map((s, i) => (
                  <Chip key={i} size="small" label={s.title || s} />
                ))}
              </Box>
            </Box>
          )}

          {experience.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Experience
              </Typography>
              <Box sx={{ display: "grid", gap: 1 }}>
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
            </Box>
          )}

          {education.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Education
              </Typography>
              <Box sx={{ display: "grid", gap: 1 }}>
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
            </Box>
          )}

          {/* Optional extra sections (collapsed lists shortened to keep modal tidy) */}
          {interest.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Interests
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {interest.slice(0, 12).map((it, i) => (
                  <Chip key={i} size="small" label={it.name} />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
 