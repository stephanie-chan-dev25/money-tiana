import type { DashboardSummary } from "../../types/dashboard.types";
import { money } from "../../utils/format";
export default function MonthlySavingsCard({ data }: { data: DashboardSummary }) {
  const savings = Number(data.monthlySavings);
  return <section className="card metric-card"><div className="card-top"><span className="card-label">MONTHLY SAVINGS</span><span className="metric-icon purple">◎</span></div><div className={`metric-amount ${savings >= 0 ? "positive" : "negative"}`}>{money(data.monthlySavings)}</div><p className="metric-subtitle">Income minus expenses</p><div className="savings-track"><span style={{ width: `${Math.max(0, Math.min(100, Number(data.monthlyIncome) > 0 ? savings / Number(data.monthlyIncome) * 100 : 0))}%` }} /></div><div className="savings-caption">Your monthly saving balance</div></section>;
}
