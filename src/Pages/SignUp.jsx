import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!agree) {
      newErrors.agree = "You must agree to the terms and conditions.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let existingUsers;

    try {
      existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    } catch {
      existingUsers = [];
    }

    const emailExists = existingUsers.some(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (emailExists) {
      setErrors({ email: "This email is already registered." });
      return;
    }

    const newUser = {
      username: username.trim(),
      email: email.trim(),
      password,
    };

    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

    alert("Sign up successful!");

    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAgree(false);
    setErrors({});

    navigate("/login");
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSignUp} noValidate>
        <h1>Create your account</h1>
        <p className="auth-card-intro">
          Make a little space for your plans and progress.
        </p>
        <div className="mb-5">
          <label htmlFor="username" className="block mb-2 text-sm font-medium">
            Username
          </label>

          <input
            id="username"
            type="text"
            placeholder="Username"
            className="border rounded-lg block w-full p-2.5"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prev) => ({ ...prev, username: "" }));
            }}
          />

          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Email"
            className="border rounded-lg block w-full p-2.5"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Password"
            className="border rounded-lg block w-full p-2.5"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                password: "",
                confirmPassword: "",
              }));
            }}
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="border rounded-lg block w-full p-2.5"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
          />

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => {
                setAgree(e.target.checked);
                setErrors((prev) => ({ ...prev, agree: "" }));
              }}
              className="mt-1"
            />

            <span>I agree with the terms and conditions.</span>
          </label>

          {errors.agree && (
            <p className="text-red-500 text-sm mt-1">{errors.agree}</p>
          )}
        </div>

        <p className="text-sm mb-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
};

export default SignUp;
