import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "▦", end: true },
  { to: "/wallets", label: "Wallets", icon: "▣" },
  { to: "/transactions", label: "Transactions", icon: "↕" },
  { to: "/categories", label: "Categories", icon: "◈" },
  { to: "/goals", label: "Goals", icon: "◎" },
];

export default function Sidebar() {
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark">M</span><span>Money <b>Tiana</b></span></div>
    <div className="nav-label">WORKSPACE</div>
    <nav className="side-nav">
      {links.map(link => <NavLink key={link.to} to={link.to} end={"end" in link ? link.end : false} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
        <span className="nav-icon">{link.icon}</span><span>{link.label}</span>
      </NavLink>)}
    </nav>
    <div className="sidebar-bottom"><div className="help-mark">?</div><div><strong>Need help?</strong><span>Manage your money with confidence.</span></div></div>
  </aside>;
}
