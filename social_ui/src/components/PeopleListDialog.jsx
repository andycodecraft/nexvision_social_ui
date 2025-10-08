import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Avatar,
  Box,
  Divider,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DEFAULT_PAGE_SIZE = 50;

export default function PeopleListDialog({
  open,
  onClose,
  title,
  people = [],
  emptyText = "No items to show.",
  maxWidth = "sm",
  pageSize = DEFAULT_PAGE_SIZE,
}) {
  const count = Array.isArray(people) ? people.length : 0;
  const [visible, setVisible] = React.useState(pageSize);

  // Reset visible when dialog opens or list changes
  React.useEffect(() => {
    if (open) setVisible(pageSize);
  }, [open, pageSize, count]);

  const loadMore = () => setVisible((v) => Math.min(v + pageSize, count));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h6" component="span" sx={{ flex: 1 }}>
          {title ?? `List (${count})`}
        </Typography>
        <IconButton aria-label="Close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          "& a": { overflowWrap: "anywhere", wordBreak: "break-word" },
        }}
      >
        {count > 0 ? (
          <>
            <Box sx={{ display: "grid", gap: 1.5 }}>
              {people.slice(0, visible).map((p, i) => (
                <Box key={i}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.25,
                      minWidth: 0,
                    }}
                  >
                    <Avatar src={p.image_url} alt={p.name} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        fontWeight={600}
                        component="div"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={p?.name}
                      >
                        {p?.url ? (
                          <Link
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                          >
                            {p?.name || "Unknown"}
                          </Link>
                        ) : (
                          p?.name || "Unknown"
                        )}
                      </Typography>

                      {p?.position && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="div"
                          sx={{
                            mt: 0.25,
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                          title={p.position}
                        >
                          {p.position}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {i < Math.min(visible, count) - 1 && (
                    <Divider sx={{ mt: 1.25 }} />
                  )}
                </Box>
              ))}
            </Box>

            {visible < count && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button variant="outlined" onClick={loadMore}>
                  Load more ({Math.min(pageSize, count - visible)} remaining)
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography color="text.secondary" component="div">
            {emptyText}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
