import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-2 py-6">
      <div className="w-full max-w-md rounded-[30px] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:border-[#2f261f]/70 dark:bg-[#111827]/90">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-orange-600">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Login
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Use your account to continue shopping.
        </p>

        {error && (
          <p className="mt-5 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-orange-500 dark:focus:bg-slate-800"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-orange-500 dark:focus:bg-slate-800"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-700 disabled:bg-slate-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600 dark:text-slate-400">
          No account?{" "}
          <Link to="/register" className="font-medium text-orange-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
