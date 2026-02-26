import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, Trophy, ScrollText, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/quiz", label: "Quiz", icon: ScrollText },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111118",
        color: "white",
        display: "grid",
        gridTemplateColumns: "260px 1fr",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #2a2a3a",
          background: "#16161f",
          padding: "22px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "white",
            fontWeight: 800,
            fontSize: 18,
            padding: "10px 10px 14px",
            borderBottom: "1px solid #2a2a3a",
          }}
        >
          QuizMaster
        </Link>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: isActive ? "white" : "#94a3b8",
                background: isActive ? "#232336" : "#16161f",
                border: isActive ? "1px solid #3730a3" : "1px solid #2a2a3a",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 12px",
                fontWeight: 700,
                fontSize: 14,
              })}
            >
              <Icon style={{ width: 16, height: 16 }} />
              {item.label}
            </NavLink>
            );
          })}
        </nav>

        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid #2a2a3a",
            paddingTop: 14,
          }}
        >
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>
            Signed in as
          </div>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>
            {user?.name || "Student"}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: "100%",
              borderRadius: 8,
              background: "#2a1a1a",
              color: "#fca5a5",
              border: "1px solid #7f1d1d",
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <LogOut style={{ width: 16, height: 16 }} />
            Logout
          </button>
        </div>
      </aside>

      <main style={{ padding: "30px 26px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;
