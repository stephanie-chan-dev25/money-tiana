import { useCallback, useEffect, useState, type FormEvent } from "react";
import { dashboardService } from "../services/dashboard.service";
import { goalService, type Goal } from "../services/goal.service";
import type { DashboardSummary } from "../types/dashboard.types";
import { money } from "../utils/format";
import { ErrorMessage, Loading } from "../components/ui/Feedback";
import { getApiError } from "../services/api";

export default function GoalsPage() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

  const loadData = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const [summary, savedGoals] = await Promise.all([
        dashboardService.getSummary(),
        goalService.getAll(),
      ]);
      setDashboard(summary);
      setGoals(savedGoals);
    } catch (err) {
      setError(getApiError(err, "Impossible de charger les objectifs financiers."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  async function addGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(target);
    if (!name.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError("Saisis un nom et un montant cible supérieur à zéro.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await goalService.create({ name: name.trim(), target_amount: amount });
      setGoals(current => [...current, created]);
      setName("");
      setTarget("");
    } catch (err) {
      setError(getApiError(err, "Impossible d'enregistrer cet objectif."));
    } finally {
      setSaving(false);
    }
  }

  async function removeGoal(id: number) {
    setDeletingId(id);
    setError("");
    try {
      await goalService.remove(id);
      setGoals(current => current.filter(goal => goal.id !== id));
    } catch (err) {
      setError(getApiError(err, "Impossible de supprimer cet objectif."));
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <Loading label="Loading goals…" />;
  const saved = Number(dashboard?.totalBalance ?? 0);

  return <div className="page-stack">
    <div className="page-intro"><div><h2>Plan for what matters</h2><p>Set a target and track it against your combined wallet balance.</p></div></div>
    {error && <ErrorMessage>{error}</ErrorMessage>}
    <div className="goal-note"><strong>Goal saving calculation</strong><span>“Already saved” is calculated from the total balance of all your wallets. Your goals are saved in your Money Tiana account.</span></div>
    <section className="card form-card">
      <div className="section-heading"><div><h2>Create a goal</h2><p>For example, an emergency fund or a new laptop.</p></div><span className="metric-icon purple">◎</span></div>
      <form className="goal-form" onSubmit={addGoal}>
        <label>Goal name<input value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Emergency fund" maxLength={100} required /></label>
        <label>Target amount (MGA)<input type="number" min="0.01" step="0.01" value={target} onChange={event => setTarget(event.target.value)} placeholder="500000" required /></label>
        <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Add goal"}</button>
      </form>
    </section>
    {goals.length === 0 ? <section className="card empty-state"><h3>No financial goals yet</h3><p>Create your first goal above. It will be stored in your account.</p></section> :
      <div className="goal-grid">{goals.map(goal => {
        const targetAmount = Number(goal.target_amount);
        const progress = targetAmount > 0 ? Math.max(0, Math.min(100, saved / targetAmount * 100)) : 0;
        return <section className="card goal-card" key={goal.id}>
          <div className="goal-card-top"><span className="metric-icon purple">◎</span><button className="danger-text" type="button" onClick={() => void removeGoal(goal.id)} disabled={deletingId === goal.id}>{deletingId === goal.id ? "Removing…" : "Remove"}</button></div>
          <h3>{goal.name}</h3><div className="goal-saved">{money(saved)} <small>saved</small></div>
          <div className="goal-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="goal-footer"><span>{progress.toFixed(0)}% of target</span><strong>{money(targetAmount)}</strong></div>
          <p className="muted">{saved >= targetAmount ? "Target reached!" : `${money(targetAmount - saved)} remaining`}</p>
        </section>;
      })}</div>}
  </div>;
}
