import React, { useEffect } from "react";
import { Box, Avatar, Tooltip } from "@mui/material";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/**
 * Props:
 *  - items: [{ id, name, image }]
 *  - selectedIds: string[]            // controlled
 *  - onChange: (ids: string[]) => void
 */
export default function MiniProfilesBar({ items = [], selectedIds = [], onChange }) {
  // Default to all selected
  useEffect(() => {
    if (items.length && (!selectedIds || selectedIds.length === 0)) {
      onChange?.(items.map((x) => x.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const toggle = (id) => {
    const exists = selectedIds.includes(id);
    const next = exists ? selectedIds.filter((x) => x !== id) : [...selectedIds, id];
    onChange?.(next);
  };

  const allSelected = selectedIds.length === items.length;
  const noneSelected = selectedIds.length === 0;

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
        const active = selectedIds.includes(p.id);
        return (
          <Tooltip key={p.id} title={p.name} arrow>
            <Avatar
              src={p.image}
              alt={p.name}
              sx={{
                width: 52,
                height: 52,
                cursor: "pointer",
                border: active ? "3px solid #22d3ee" : "3px solid transparent",
                boxShadow: active ? "0 0 8px rgba(34,211,238,0.6)" : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.08)",
                  borderColor: active ? "#22d3ee" : "#888",
                },
                // subtle dimming when not selected and at least one picked
                opacity: !active && !allSelected ? 0.6 : 1,
              }}
              onClick={() => toggle(p.id)}
            >
              {!p.image && getInitials(p.name)}
            </Avatar>
          </Tooltip>
        );
      })}
      {/* Optional small hint when none selected */}
      {noneSelected && (
        <Box sx={{ ml: 1, fontSize: 12, opacity: 0.75 }}>
          Select at least one profile to show posts.
        </Box>
      )}
    </Box>
  );
}
