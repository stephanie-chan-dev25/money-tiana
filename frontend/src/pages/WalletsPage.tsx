import { useEffect, useState, type FormEvent } from "react";
import type { Wallet } from "../types/wallet.types";
import { walletService } from "../services/wallet.service";
import { getApiError } from "../services/api";
import { money } from "../utils/format";
import { Loading, ErrorMessage, EmptyState } from "../components/ui/Feedback";

export default function WalletsPage() {
  const [items, setItems] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  async function load() { try { setItems(await walletService.list()); setError(""); } catch(e) { setError(getApiError(e)); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); setError(""); try { if (editing !== null) await walletService.update(editing, { name: name.trim() }); else await walletService.create({ name: name.trim() }); setName(""); setEditing(null); await load(); } catch(e) { setError(getApiError(e)); } finally { setBusy(false); } }
  async function remove(id: number) { if (!window.confirm("Delete this wallet? This may be blocked if it has transactions.")) return; try { await walletService.remove(id); await load(); } catch(e) { setError(getApiError(e)); } }
  if (loading) return <Loading label="Loading wallets…" />;
  return <div className="page-stack"><div className="page-intro"><div><h2>Manage your wallets</h2><p>Keep your bank accounts, cash, and savings in one place.</p></div></div>{error && <ErrorMessage>{error}</ErrorMessage>}
    <div className="two-column-content"><section className="card form-card"><div className="section-heading"><div><h2>{editing !== null ? "Edit wallet" : "Add a wallet"}</h2><p>Choose a name that helps you recognize it.</p></div></div><form className="form-stack" onSubmit={submit}><label>Wallet name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Main bank account" required maxLength={100}/></label><div className="form-actions"><button className="primary-button" disabled={busy}>{busy ? "Saving…" : editing !== null ? "Save changes" : "Create wallet"}</button>{editing !== null && <button type="button" className="secondary-button" onClick={()=>{setEditing(null);setName("");}}>Cancel</button>}</div></form></section>
    <section className="card list-card"><div className="section-heading"><div><h2>Your wallets</h2><p>{items.length} wallet{items.length === 1 ? "" : "s"}</p></div><span className="metric-icon blue">▣</span></div>{items.length ? <div className="entity-list">{items.map(w=><div className="entity-row" key={w.id}><span className="entity-icon blue">▣</span><div className="entity-main"><strong>{w.name}</strong><small>Available balance</small></div><div className="entity-end"><strong>{money(w.balance)}</strong><div className="row-actions"><button onClick={()=>{setEditing(w.id);setName(w.name);}} aria-label={`Edit ${w.name}`}>Edit</button><button className="danger-text" onClick={()=>void remove(w.id)} aria-label={`Delete ${w.name}`}>Delete</button></div></div></div>)}</div> : <EmptyState title="No wallets yet" description="Create your first wallet using the form."/>}</section></div>
  </div>;
}
