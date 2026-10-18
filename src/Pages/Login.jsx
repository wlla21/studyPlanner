import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div>
      <form>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={emailInputRef}
          />
          <label>Email</label>
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordInputRef}
          />
          <label>Password</label>
        </div>
        <div>
          <a>
            <label>Forgot Password?</label>
          </a>
          <a>
            <label>Don't have an account? Sign Up</label>
          </a>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
