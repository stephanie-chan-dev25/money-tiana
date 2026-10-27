import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "▦", end: true },
  { to: "/wallets", label: "Wallets", icon: "▣" },
  { to: "/transactions", label: "Transactions", icon: "↕" },
  { to: "/categories", label: "Categories", icon: "◈" },
  { to: "/goals", label: "Goals", icon: "◎" },
];

export default function Sidebar() {
  const [helpOpen, setHelpOpen] = useState(false);
  useEffect(() => {
    if (!helpOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setHelpOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [helpOpen]);
  return <><aside className="sidebar">
    <div className="brand"><span className="brand-mark">M</span><span>Money <b>Tiana</b></span></div>
    <div className="nav-label">WORKSPACE</div>
    <nav className="side-nav">
      {links.map(link => <NavLink key={link.to} to={link.to} end={"end" in link ? link.end : false} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
        <span className="nav-icon">{link.icon}</span><span>{link.label}</span>
      </NavLink>)}
    </nav>
    <button type="button" className="sidebar-bottom help-trigger" onClick={() => setHelpOpen(true)} aria-haspopup="dialog" aria-expanded={helpOpen}>
      <span className="help-mark">?</span><span className="help-copy"><strong>Need help?</strong><span>Manage your money with confidence.</span></span>
    </button>
  </aside>
  {helpOpen && <div className="help-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setHelpOpen(false); }}>
    <section className="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-dialog-title">
      <div className="help-dialog-heading"><span className="help-mark">?</span><button type="button" className="icon-button" onClick={() => setHelpOpen(false)} aria-label="Close help">×</button></div>
      <h2 id="help-dialog-title">How can we help?</h2>
      <p>Use Money Tiana to keep your personal finances organized.</p>
      <div className="help-topic"><strong>Dashboard</strong><span>Review your total wallet balance, monthly income, expenses, savings, and recent transactions.</span></div>
      <div className="help-topic"><strong>Wallets</strong><span>Create a wallet for each account or money source you want to track.</span></div>
      <div className="help-topic"><strong>Categories & transactions</strong><span>Assign each transaction to a category and wallet so your dashboard can summarize it correctly.</span></div>
      <div className="help-topic"><strong>Financial goals</strong><span>Set a target amount and compare it with the combined balance of your wallets.</span></div>
      <button type="button" className="primary-button full-width" onClick={() => setHelpOpen(false)}>Got it</button>
    </section>
  </div>}</>;

}
