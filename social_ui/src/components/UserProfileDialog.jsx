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

import GroupIcon from "@mui/icons-material/Group";                 // Followers
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1"; // Friends
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"; // Mentions
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined"; // Shares

function SectionHeader({ children }) {
  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <Typography variant="h6" fontWeight={700}>{children}</Typography>
      <Divider sx={{ mt: 0.5, mb: 1 }} />
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
    followers = 0,
    friends = 0,
    mentions = 0,
    shares = 0, // <-- new
  } = user;

  return (
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
        </Box>

        {/* Stats row */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 4,
            alignItems: "center",
            flexWrap: "wrap",
            "& .stat": { display: "flex", alignItems: "center", gap: 0.75 },
            "& .num": { fontWeight: 700, fontSize: "1rem" },
          }}
        >
          <Box className="stat">
            <GroupIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">Followers</Typography>
            <Typography className="num">{Number(followers) || 0}</Typography>
          </Box>

          <Box className="stat">
            <PersonAddAlt1Icon fontSize="small" />
            <Typography variant="body2" color="text.secondary">Friends</Typography>
            <Typography className="num">{Number(friends) || 0}</Typography>
          </Box>

          <Box className="stat">
            <AlternateEmailIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">Mentions</Typography>
            <Typography className="num">{Number(mentions) || 0}</Typography>
          </Box>

          <Box className="stat">
            <ShareOutlinedIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">Shares</Typography>
            <Typography className="num">{Number(shares) || 0}</Typography>
          </Box>
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
            <Link href={pageUrl} target="_blank" rel="noopener noreferrer">
              {pageUrl}
            </Link>
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

        {connection.length > 0 && (
          <>
            <SectionHeader>Connections</SectionHeader>
            <Box sx={{ display: "grid", gap: 2 }}>
              {connection.map((ct, i) => (
                <Box key={i}>
                  <Typography fontWeight={600}>{ct.type}</Typography>
                  <Typography variant="body2">{ct.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ct.headline}
                  </Typography>
                  {i < connection.length - 1 && <Divider sx={{ mt: 1 }} />}
                </Box>
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

        {endorsement.length > 0 && (
          <>
            <SectionHeader>Endorsements</SectionHeader>
            <Box sx={{ display: "grid", gap: 2 }}>
              {endorsement.map((ed, i) => (
                <Box key={i}>
                  <Typography fontWeight={600}>{ed.name}</Typography>
                  <Typography variant="body2">{ed.subtitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ed.skill}
                  </Typography>
                  {i < endorsement.length - 1 && <Divider sx={{ mt: 1 }} />}
                </Box>
              ))}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
