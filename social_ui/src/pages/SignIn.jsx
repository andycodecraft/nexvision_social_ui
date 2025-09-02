import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../api/auth";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError("");
    setLoading(true);
    if (!email || !password) {
      setError("⚠️ Email and password are required.");
      return;
    }
  
    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("⚠️ Please enter a valid email address.");
      return;
    }
  
    // ✅ Password length check
    if (password.length < 6) {
      setError("⚠️ Password must be at least 6 characters long.");
      return;
    }
  
    setLoading(true);
    const { ok, data } = await signin({ email, password });

    if (!ok || !data.status) {
      setError(data.message || data.response || "❌ Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    localStorage.setItem("token", data.response.token);
    localStorage.setItem("user", JSON.stringify({
      id: data.response.userId,
      name: data.response.name,
      is_admin: data.response.is_admin,
      level: data.response.level,
      email,
    }));
    navigate("/startpage");
  };

  const handleFocus = () => {
    setError(""); // clear error when focusing an input
  };

  return (
    <div className="background-signin">
      <div className="flex h-screen items-center justify-start text-white">
        <div className="ml-[5%] mb-[15%] p-8 bg-gray-800 rounded-lg shadow-lg w-[400px]">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

          {error && (
            <div className="mb-4 rounded bg-red-600 px-3 py-2 text-sm">{error}</div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="p-2 rounded text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFocus}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-2 rounded text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handleFocus}
              required
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
