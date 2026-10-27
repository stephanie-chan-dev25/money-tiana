import type { DashboardSummary } from "../../types/dashboard.types";
import { money } from "../../utils/format";
export default function MonthlyIncomeCard({ data }: { data: DashboardSummary }) {
  return <section className="card metric-card"><div className="card-top"><span className="card-label">MONTHLY INCOME</span><span className="metric-icon green">↙</span></div><div className="metric-amount positive">{money(data.monthlyIncome)}</div><p className="metric-subtitle">Income received this month</p><div className="mini-breakdown">{data.incomeByCategory.slice(0, 3).map(item => <div className="mini-row" key={item.category_id}><span>{item.category_name}</span><b>{money(item.total)}</b></div>)}</div></section>;
}
