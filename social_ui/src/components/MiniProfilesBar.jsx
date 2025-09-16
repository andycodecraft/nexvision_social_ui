// src/components/MiniProfilesBar.jsx
import React, { useEffect } from "react";
import { Box, Avatar, Tooltip } from "@mui/material";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function MiniProfilesBar({ items, selectedId, onSelect }) {
  // auto-select first profile if none selected
  useEffect(() => {
    if (!selectedId && items.length > 0) {
      onSelect(items[0].id);
    }
  }, [items, selectedId, onSelect]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        overflowX: "auto",
        py: 1,
        px: 1,
        scrollbarWidth: "thin",
      }}
    >
      {items.map((p) => {
        const active = selectedId === p.id;
        return (
          <Tooltip key={p.id} title={p.name} arrow>
            <Avatar
              src={p.image}
              alt={p.name}
              sx={{
                width: 52,
                height: 52,
                cursor: "pointer",
                border: active
                  ? "3px solid #22d3ee" // highlight active one
                  : "3px solid transparent",
                boxShadow: active
                  ? "0 0 8px rgba(34,211,238,0.6)" // cyan glow
                  : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.08)",
                  borderColor: active ? "#22d3ee" : "#888",
                },
              }}
              onClick={() => onSelect(p.id)}
            >
              {!p.image && getInitials(p.name)}
            </Avatar>
          </Tooltip>
        );
      })}
    </Box>
  );
}
