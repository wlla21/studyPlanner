import React from "react";

const SignUp = () => {
  return (
    <div>
      <form>
        <div>
          <input type="text" placeholder="Username" />
          <label>Username</label>
        </div>
        <div>
          <input type="email" placeholder="Email" />
          <label>Email</label>
        </div>
        <div>
          <input type="password" placeholder="Password" />
          <label>Password</label>
        </div>
        <div>
          <input type="password" placeholder="Confirm Password" />
          <label>Confirm Password</label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
