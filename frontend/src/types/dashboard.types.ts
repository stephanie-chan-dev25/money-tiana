export interface CategoryTotal {
  category_id: number;
  category_name: string;
  total: string;
}
export interface DashboardSummary {
  totalBalance: string;
  wallets: { id: number; name: string; balance: string }[];
  monthlyIncome: string;
  incomeByCategory: CategoryTotal[];
  monthlyExpenses: string;
  expensesByCategory: CategoryTotal[];
  monthlySavings: string;
}
