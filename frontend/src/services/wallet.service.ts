import api from "./api";
import type { Wallet, WalletPayload } from "../types/wallet.types";

export const walletService = {
  async list(): Promise<Wallet[]> {
    const { data } = await api.get<{ wallets: Wallet[] }>("/wallets");
    return data.wallets;
  },
  async create(payload: WalletPayload): Promise<Wallet> {
    const { data } = await api.post<{ wallet: Wallet }>("/wallets", payload);
    return data.wallet;
  },
  async update(id: number, payload: WalletPayload): Promise<Wallet> {
    const { data } = await api.patch<{ wallet: Wallet }>(`/wallets/${id}`, payload);
    return data.wallet;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/wallets/${id}`);
  },
};
