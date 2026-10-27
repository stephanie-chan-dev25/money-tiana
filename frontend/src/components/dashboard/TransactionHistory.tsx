import type { Transaction } from "../../types/transaction.types";
import { money, shortDate } from "../../utils/format";
export default function TransactionHistory({ transactions, onViewAll }: { transactions: Transaction[]; onViewAll: () => void }) {
  const recent = [...transactions].sort((a,b) => b.date.localeCompare(a.date) || b.id-a.id).slice(0, 6);
  return <section className="card history-card"><div className="section-heading"><div><h2>Recent transactions</h2><p>Your latest financial activity</p></div><button className="text-button" onClick={onViewAll}>View all <span>→</span></button></div>
    {recent.length ? <div className="table-wrap"><table><thead><tr><th>TRANSACTION</th><th>DATE</th><th>CATEGORY</th><th className="align-right">AMOUNT</th></tr></thead><tbody>{recent.map(t => <tr key={t.id}><td><div className="transaction-cell"><span className={`transaction-symbol ${t.category_type}`}>{t.category_type === "income" ? "↙" : "↗"}</span><div><strong>{t.description?.trim() || t.category_name}</strong><small>{t.category_type === "income" ? "Income" : "Expense"}</small></div></div></td><td>{shortDate(t.date)}</td><td><span className="category-pill">{t.category_name}</span></td><td className={`align-right amount-cell ${t.category_type}`}>{t.category_type === "income" ? "+" : "−"}{money(t.amount)}</td></tr>)}</tbody></table></div> : <div className="empty-state compact"><strong>No transactions yet</strong><p>Your transactions will appear here.</p></div>}
  </section>;
}
