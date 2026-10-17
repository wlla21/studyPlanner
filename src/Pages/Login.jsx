import React from "react";

const Login = () => {
  return (
    <div>
      <form>
        <div>
          <input type="email" placeholder="Email" />
          <label>Email</label>
        </div>
        <div>
          <input type="password" placeholder="Password" />
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
