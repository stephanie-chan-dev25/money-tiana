import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const titles: Record<string, string> = {
  "/": "Dashboard", "/wallets": "Wallets", "/transactions": "Transactions",
  "/categories": "Categories", "/goals": "Financial Goals",
};
export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const title = titles[location.pathname] ?? "Money Tiana";
  useEffect(() => { document.title = `${title} | Money Tiana`; }, [title]);
  async function handleLogout() {
    try { await logout(); } finally { navigate("/login", { replace: true }); }
  }
  return <header className="topbar">
    <div><div className="eyebrow">PERSONAL FINANCE</div><h1>{title}</h1></div>
    <div className="topbar-user"><div className="avatar">{user?.email?.slice(0, 1).toUpperCase() ?? "U"}</div><div className="user-email">{user?.email}</div><button className="icon-button" onClick={() => void handleLogout()} title="Sign out" aria-label="Sign out">↪</button></div>
  </header>;
}
