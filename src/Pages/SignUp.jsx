import { useState, useEffect, useRef } from "react";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const usernameInputRef = useRef(null);

  const handleSignUp = (e) => {
    e.preventDefault();

    const newUser = {
      username,
      email,
      password,
    };

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    existingUsers.push(newUser);

    localStorage.setItem("users", JSON.stringify(existingUsers));

    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
      <form class="max-w-sm mx-auto" onSubmit={handleSignUp}>
        <div class="mb-5">
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            ref={usernameInputRef}
            value={username}
            class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label class="block mb-2.5 text-sm font-medium text-heading">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            ref={emailInputRef}
            value={email}
            class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label class="block mb-2.5 text-sm font-medium text-heading">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            ref={passwordInputRef}
            class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label class="block mb-2.5 text-sm font-medium text-heading">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            ref={passwordInputRef}
            class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <label for="remember" class="flex items-center mb-5">
          <input
            id="remember"
            type="checkbox"
            value=""
            class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
            required
          />
          <p class="ms-2 text-sm font-medium text-heading select-none my-2">
            I agree with the{" "}
            <a href="#" class="text-fg-brand hover:underline">
              terms and conditions
            </a>
            .
          </p>
        </label>
        <button
          type="submit"
          class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
