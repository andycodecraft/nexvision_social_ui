// pages/StartPage.tsx
import { Box, Grid, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect } from "react";

const items = [
  { key: "account",   title: "Account",   desc: "Create Account Based Project",   to: "/projects/new?type=account" },
  { key: "keyword",   title: "Keyword",   desc: "Create Keyword Based Project",   to: "/projects/new?type=keyword" },
  { key: "location",  title: "Location",  desc: "Create Geofencing Based Project",to: "/projects/new?type=location" },
  { key: "custom",    title: "Custom",    desc: "Create a Custom Project",        to: "/projects/new?type=custom" },
  { key: "facebook",  title: "Facebook",  desc: "Create Facebook Based Project",  to: "/projects/new?type=facebook" },
  { key: "instagram", title: "Instagram", desc: "Create Instagram Based Project", to: "/projects/new?type=instagram" },
];

export default function Dashboard() {
  // optional: scroll to top on query change
  const { search } = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { window.scrollTo(0, 0); }, [search]);

  return (
    <Box>
      <Typography variant="h3" fontWeight={800} sx={{ ml: 15, mt: 5, mb: 8 }}>
        What do you want to{" "}
        <Box
          component="span"
          sx={{ px: 1.5, py: 0.5, borderRadius: 1, textDecoration: "underline", color: "primary.main" }}
        >
          monitor
        </Box>
        ?
      </Typography>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{
          mt: 2,
          "--cardSize": {
            xs: "min(92vw - 48px, 44vh)",
            sm: "min(44vw, 42vh)",
            md: "min(28vw, 38vh)",
            lg: "min(22vw, 36vh)",
            xl: "min(18vw, 34vh)",
          }
        }}
      >
        {items.map((x) => (
          <Grid item key={x.key} xs="auto">
            <Card
              sx={{
                width: "var(--cardSize)",
                height: "var(--cardSize)",
                display: "flex",
                flexDirection: "column",
                bgcolor: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(6px)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={x.to}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flexBasis: "55%",
                    flexShrink: 0,
                    background: "linear-gradient(135deg, #22d3ee, #6366f1)",
                    borderTopLeftRadius: (t) => t.shape.borderRadius,
                    borderTopRightRadius: (t) => t.shape.borderRadius,
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  <Typography variant="h6" fontWeight={800}>
                    {x.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {x.desc}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
