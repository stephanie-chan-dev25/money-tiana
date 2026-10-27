import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getApiError } from "../../services/api";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  useEffect(() => { document.title = `${isRegister ? "Create Account" : "Sign In"} | Money Tiana`; }, [isRegister]);
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (loading) return <div className="screen-loader"><span className="spinner"/> Loading…</div>;
  if (user) return <Navigate to="/" replace />;
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (isRegister && password !== confirm) { setError("Passwords do not match."); return; }
    setBusy(true);
    try {
      if (isRegister) await register(email.trim(), password);
      else await login(email.trim(), password);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || "/", { replace: true });
    } catch (e) { setError(getApiError(e, "Unable to authenticate.")); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-decoration"><div className="brand auth-brand"><span className="brand-mark">M</span><span>Money <b>Tiana</b></span></div><div className="auth-promo"><div className="promo-kicker">YOUR MONEY, IN FOCUS</div><h1>Make every<br/>ariary count.</h1><p>A clearer view of your money starts here. Track your accounts, understand your spending, and work toward your goals.</p><div className="promo-stat"><span className="promo-stat-icon">↗</span><div><strong>One simple overview</strong><small>Your financial life, organized in one place.</small></div></div></div><div className="auth-decoration-footer">A smarter way to manage your everyday finances.</div></div>
    <div className="auth-panel"><div className="auth-form-wrap"><div className="mobile-brand brand"><span className="brand-mark">M</span><span>Money <b>Tiana</b></span></div><div className="auth-heading"><span className="eyebrow">{isRegister ? "GET STARTED" : "WELCOME BACK"}</span><h2>{isRegister ? "Create your account" : "Sign in to your account"}</h2><p>{isRegister ? "Set up your personal finance space in a few steps." : "Enter your details to access your dashboard."}</p></div>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <form className="form-stack" onSubmit={submit}><label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required/></label><label>Password<input type="password" autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" minLength={8} required/></label>{isRegister && <label>Confirm password<input type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter your password" minLength={8} required/></label>}<button className="primary-button full-width" disabled={busy}>{busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"} <span>→</span></button></form>
      <p className="auth-switch">{isRegister ? "Already have an account?" : "New to Money Tiana?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p><p className="auth-privacy">Your financial data is private and belongs to you.</p></div></div></div>;
}
