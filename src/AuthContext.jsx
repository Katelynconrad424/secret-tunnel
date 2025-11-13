import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  //
  async function signup(username) {
    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Signup failed — please try again.");
      }

      const result = await response.json();
      setToken(result.token);
      setLocation("TABLET"); // move to Tablet after signup
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message);
    }
  }

  //
  async function authenticate() {
    if (!token) {
      throw new Error("No token — please sign up first!");
    }

    try {
      const response = await fetch(`${API}/authenticate`, {
        headers: {
          Authorization: `Bearer ${token}`, // attach token
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed — invalid token.");
      }

      const result = await response.json();
      console.log("Authenticated user:", result);
      setLocation("TUNNEL"); // move to Tunnel if successful
    } catch (err) {
      console.error("Authentication error:", err);
      alert(err.message);
    }
  }

  //
  const value = { location, signup, authenticate, token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
