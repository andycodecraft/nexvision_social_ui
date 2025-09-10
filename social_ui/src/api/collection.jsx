const API_URL = import.meta.env.VITE_API_URL;

export async function getProfiles({ platform, query }) {
  try {
    const res = await fetch(`${API_URL}/api/v1/get-profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, query }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { message: err.message || "Network error" } };
  }
}

export async function saveCollection(payload) {
  try {
    const res = await fetch(`${API_URL}/api/v1/save-collection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { message: err.message || "Network error" } };
  }
}

export async function listCollections({ status, q, platform } = {}) {
  try {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    if (platform) params.set("platform", platform);

    const res = await fetch(`${API_URL}/api/v1/collections${params.toString() ? `?${params}` : ""}`);
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { message: err.message || "Network error" } };
  }
}

// DELETE /api/v1/collections/:id
export async function removeCollection(id) {
  try {
    const res = await fetch(`${API_URL}/api/v1/collections/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { message: err.message || "Network error" } };
  }
}