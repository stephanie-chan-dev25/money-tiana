import api from "./api";
import type { Transaction, TransactionPayload } from "../types/transaction.types";

export const transactionService = {
  async list(): Promise<Transaction[]> {
    const { data } = await api.get<{ transactions: Transaction[] }>("/transactions");
    return data.transactions;
  },
  async create(payload: TransactionPayload): Promise<Transaction> {
    const { data } = await api.post<{ transaction: Transaction }>("/transactions", payload);
    return data.transaction;
  },
  async update(id: number, payload: TransactionPayload): Promise<Transaction> {
    const { data } = await api.patch<{ transaction: Transaction }>(`/transactions/${id}`, payload);
    return data.transaction;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
