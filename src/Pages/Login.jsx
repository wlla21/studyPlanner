import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = existingUsers.find(
      (user) => user.email === email && user.password === password,
    );

    if (user) {
      navigate("/");
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <div>
      <form class="max-w-sm mx-auto" onSubmit={handleLogin}>
        <div class="mb-5">
          <label
            for="email"
            class="block mb-2.5 text-sm font-medium text-heading"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="name@flowbite.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={emailInputRef}
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="password"
            class="block mb-2.5 text-sm font-medium text-heading"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            placeholder="password"
            class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordInputRef}
            required
          />
        </div>
        <div className="flex justify-between">
          <a>
            <label className="text-slate-500 text-sm">Forgot Password?</label>
          </a>

          <p className="text-slate-500 text-sm">
            Don't have an account? <span>Sign Up</span>
          </p>
        </div>
        <button
          type="submit"
          class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none my-2"
        >
          LogIn
        </button>
      </form>
    </div>
  );
};

export default Login;
