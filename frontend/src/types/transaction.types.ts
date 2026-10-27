export interface Transaction {
  id: number;
  amount: string;
  date: string;
  description: string | null;
  category_id: number;
  wallet_id: number;
  category_name: string;
  category_type: "income" | "expense";
}
export interface TransactionPayload {
  amount: number;
  date: string;
  description?: string | null;
  category_id: number;
  wallet_id: number;
}
