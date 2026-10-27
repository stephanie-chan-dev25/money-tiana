import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DashboardSummary } from "../types/dashboard.types";
import type { Transaction } from "../types/transaction.types";
import { dashboardService } from "../services/dashboard.service";
import { transactionService } from "../services/transaction.service";
import { getApiError } from "../services/api";
import { Loading, ErrorMessage } from "../components/ui/Feedback";
import TotalBalanceCard from "../components/dashboard/TotalBalanceCard";
import MonthlyIncomeCard from "../components/dashboard/MonthlyIncomeCard";
import MonthlyExpensesCard from "../components/dashboard/MonthlyExpensesCard";
import MonthlySavingsCard from "../components/dashboard/MonthlySavingsCard";
import TransactionHistory from "../components/dashboard/TransactionHistory";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    Promise.all([dashboardService.getSummary(), transactionService.list()])
      .then(([summary, items]) => { if (active) { setDashboard(summary); setTransactions(items); } })
      .catch(e => { if (active) setError(getApiError(e)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  if (loading) return <Loading label="Loading your financial overview…" />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!dashboard) return <ErrorMessage>Dashboard data is unavailable.</ErrorMessage>;
  return <div className="page-stack"><div className="welcome-row"><div><h2>Good to see you!</h2><p>Here’s what’s happening with your money.</p></div><button className="primary-button" onClick={() => navigate("/transactions", { state: { create: true } })}><span>＋</span> Add transaction</button></div>
    <div className="dashboard-grid"><TotalBalanceCard data={dashboard}/><div className="metrics-grid"><MonthlyIncomeCard data={dashboard}/><MonthlyExpensesCard data={dashboard}/><MonthlySavingsCard data={dashboard}/></div></div>
    <TransactionHistory transactions={transactions} onViewAll={() => navigate("/transactions")}/>
  </div>;
}
