import type { DashboardSummary } from "../../types/dashboard.types";
import { money } from "../../utils/format";
export default function TotalBalanceCard({ data }: { data: DashboardSummary }) {
  return <section className="card balance-card">
    <div className="card-top"><span className="card-label">TOTAL BALANCE</span><span className="metric-icon blue">▣</span></div>
    <div className="balance-amount">{money(data.totalBalance)}</div>
    <div className="balance-note"><span className="status-dot" />Across all your wallets</div>
    <div className="wallet-breakdown"><div className="section-mini-title">YOUR WALLETS</div>
      {data.wallets.length ? data.wallets.map(wallet => <div className="wallet-row" key={wallet.id}><span className="wallet-name"><span className="wallet-dot" />{wallet.name}</span><strong>{money(wallet.balance)}</strong></div>) : <p className="muted">No wallets yet. Create one to get started.</p>}
    </div>
  </section>;
}
