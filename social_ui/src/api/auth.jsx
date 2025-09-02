const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL)

export async function signin({ email, password }) {
  try {
    const res = await fetch(`${API_URL}/api/v1/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { message: err.message || "Network error" } };
  }
}
