import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
export default function ProfileForm() {
  const { userId } = useParams();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  console.log(userId);
  const [profile, setProfile] = useState({
    fullName: "",
    dayOfBirth: "",
    email: "",
    phone: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    setSuccessMsg("");
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const getUserProfile = async () => {
      const res = await fetch(`https://auth-login-backend.onrender.com/profile/${userId}`, {
        method: "GET",
      });
      if (!res.ok) return;
      const profile = await res.json();
      if (profile) {
        setProfile({
          fullName: profile.fullName,
          dayOfBirth: profile.dayOfBirth,
          email: profile.email,
          phone: profile.phone,
        });
      }
    };
    getUserProfile();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    setErrorMsg("");
    setSuccessMsg("");
    e.preventDefault();
    if (!profile.email.includes("@")) return setErrorMsg("email missing @");
    if (profile.phone.length !== 10) return setErrorMsg(" 10 number required");
    try {
      const result = await fetch(`https://auth-login-backend.onrender.com/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
      if (result && result.ok) {
        setSuccessMsg("updated profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1 style={{ textAlign: "center" }}>profile</h1>
      <label htmlFor="fullName" className="inputLabel">
        Full name:
      </label>
      <input
        type="text"
        name="fullName"
        id="fullName"
        className="inputBox"
        value={profile.fullName || ""}
        onChange={handleChange}
        required
      />
      <label htmlFor="dayOfBirth" className="inputLabel">
        day of birth:
      </label>
      <input
        type="text"
        name="dayOfBirth"
        id="dayOfBirth"
        value={profile.dayOfBirth || ""}
        onChange={handleChange}
        className="inputBox"
        required
      />
      <label htmlFor="email" className="inputLabel">
        Email:
      </label>
      <input
        type="email"
        name="email"
        id="email"
        value={profile.email || ""}
        onChange={handleChange}
        className="inputBox"
        required
      />
      <label htmlFor="phone" className="inputLabel">
        Phone:
      </label>
      <input
        type="text"
        name="phone"
        id="phone"
        value={profile.phone || ""}
        onChange={handleChange}
        className="inputBox"
        required
      />
      <span
        style={{
          fontSize: "13px",
          color: `${successMsg ? "green" : "red"}`,
          marginTop: "5px",
          textAlign: "center",
        }}
      >
        {errorMsg || successMsg}
      </span>
      <div style={{ display: "flex" }}>
        <button className="btn" type="submit">
          update
        </button>
        <button className="btn" onClick={() => navigate("/login", { replace: true })}>
          logout
        </button>
      </div>
    </form>
  );
}
