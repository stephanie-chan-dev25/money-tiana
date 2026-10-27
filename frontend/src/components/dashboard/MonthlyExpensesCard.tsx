import type { DashboardSummary } from "../../types/dashboard.types";
import { money } from "../../utils/format";
export default function MonthlyExpensesCard({ data }: { data: DashboardSummary }) {
  return <section className="card metric-card"><div className="card-top"><span className="card-label">MONTHLY EXPENSES</span><span className="metric-icon red">↗</span></div><div className="metric-amount negative">{money(data.monthlyExpenses)}</div><p className="metric-subtitle">Expenses this month</p><div className="mini-breakdown">{data.expensesByCategory.slice(0, 3).map(item => <div className="mini-row" key={item.category_id}><span>{item.category_name}</span><b>{money(item.total)}</b></div>)}</div></section>;
}
