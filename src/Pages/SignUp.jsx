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
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Username"
          ref={usernameInputRef}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Username</label>
        <div>
          <input
            type="email"
            placeholder="Email"
            ref={emailInputRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            ref={passwordInputRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            ref={passwordInputRef}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label>Confirm Password</label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
