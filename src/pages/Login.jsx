import React from "react";

const Login = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      {/* Add your login form here */}
      <form>
        <input type="text" placeholder="Username" />
        <br />
        <input type="password" placeholder="Password" />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
