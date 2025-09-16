const API_URL = import.meta.env.VITE_API_URL;

export async function listPosts(collection_id) {
  try {
    const res = await fetch(`${API_URL}/api/v1/posts/${collection_id}`, {
      method: "GET",
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { message: err.message || "Network error" } };
  }
}
