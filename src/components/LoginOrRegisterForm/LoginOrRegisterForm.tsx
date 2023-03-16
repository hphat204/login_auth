import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
export default function LoginForm() {
  const [register, setRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!user.email.includes("@")) return setErrorMsg("email missing @");
    if (user.password.length < 8) return setErrorMsg("atleast 8 characters required for password");
    if (!user.email || !user.password) return;
    try {
      const result = await fetch(
        `https://auth-login-backend.onrender.com/${register ? "register" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      const data = await result.json();
      if (result && result.ok) {
        setUser({
          email: "",
          password: "",
        });
        setRegister(false);
        if (!register) {
          navigate(`/profile/${data.userId}`);
        }
      } else {
        setErrorMsg(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1 style={{ textAlign: "center" }}>{!register ? "login" : "register"}</h1>
      <label htmlFor="email" className="inputLabel">
        Email:
      </label>
      <input
        type="text"
        name="email"
        id="email"
        className="inputBox"
        value={user.email}
        onChange={handleChange}
        placeholder="example@kyanon.digital"
        required
      />
      <label htmlFor="password" className="inputLabel">
        Password:
      </label>
      <input
        type={passwordType}
        name="password"
        id="password"
        value={user.password}
        onChange={handleChange}
        className="inputBox"
        placeholder="******"
        required
      />
      <div className="showPasswordContainer">
        <input
          type="checkbox"
          id="showPassword"
          onChange={() => setPasswordType(passwordType === "password" ? "text" : "password")}
        />
        <label htmlFor="showPassword" className="inputLabel">
          show password
        </label>
      </div>
      <span style={{ fontSize: "13px", color: "red", marginTop: "5px", textAlign: "center" }}>
        {errorMsg}
      </span>
      <button className="btn" type="submit">
        {!register ? "login" : "register"}
      </button>
      <p className="registerLink" onClick={() => setRegister((prev) => !prev)}>
        {!register ? " don't have an account ? register now" : "have an account login now"}
      </p>
    </form>
  );
}
