import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  return <div className="app-shell"><Sidebar /><main className="main-area"><Header /><div className="page-content"><Outlet /></div></main></div>;
}
