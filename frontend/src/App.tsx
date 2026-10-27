import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import WalletsPage from "./pages/WalletsPage";
import CategoriesPage from "./pages/CategoriesPage";
import TransactionsPage from "./pages/TransactionsPage";
import GoalsPage from "./pages/GoalsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App(){
  return <BrowserRouter><AuthProvider><Routes>
    <Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/>
    <Route element={<ProtectedRoute/>}><Route element={<AppLayout/>}>
      <Route index element={<DashboardPage/>}/><Route path="wallets" element={<WalletsPage/>}/><Route path="transactions" element={<TransactionsPage/>}/><Route path="categories" element={<CategoriesPage/>}/><Route path="goals" element={<GoalsPage/>}/>
    </Route></Route>
    <Route path="/home" element={<Navigate to="/" replace/>}/><Route path="*" element={<NotFoundPage/>}/>
  </Routes></AuthProvider></BrowserRouter>;
}
