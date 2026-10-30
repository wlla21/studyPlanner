import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CURRENT_USER_KEY } from "../auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const user = existingUsers.find(
        (user) => user.email === email.trim() && user.password === password,
      );

      if (!user) {
        setErrors({ form: "Invalid email or password." });
        return;
      }

      localStorage.setItem(CURRENT_USER_KEY, user.email);
      setErrors({});
      navigate("/", { replace: true });
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? `Could not sign in: ${error.message}`
            : "Could not sign in. Please try again.",
      });
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleLogin} noValidate>
        <h1>Welcome back</h1>
        <p className="auth-card-intro">
          Sign in to pick up where you left off.
        </p>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Your email
          </label>

          <input
            type="email"
            id="email"
            placeholder="name@example.com"
            className="border rounded-lg block w-full p-2.5"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({
                ...prev,
                email: "",
                form: "",
              }));
            }}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Your password
          </label>

          <input
            type="password"
            id="password"
            placeholder="Password"
            className="border rounded-lg block w-full p-2.5"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                password: "",
                form: "",
              }));
            }}
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {errors.form && (
          <p className="text-red-500 text-sm mb-3">{errors.form}</p>
        )}

        <div className="flex justify-between text-sm mb-4">
          <Link to="/forgot-password" className="text-slate-500">
            Forgot Password?
          </Link>

          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-gray-800 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </main>
  );
};

export default Login;
