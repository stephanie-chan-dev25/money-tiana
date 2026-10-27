import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboard.service";
import type { DashboardSummary } from "../types/dashboard.types";
import { money } from "../utils/format";
import { Loading, ErrorMessage } from "../components/ui/Feedback";

export default function GoalsPage() {
  const [dashboard,setDashboard]=useState<DashboardSummary|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
  const [name,setName]=useState("");const [target,setTarget]=useState("");const [goals,setGoals]=useState<{id:number;name:string;target:number}[]>([]);
  useEffect(()=>{dashboardService.getSummary().then(setDashboard).catch(()=>setError("Your current wallet balance could not be loaded.")).finally(()=>setLoading(false));},[]);
  function addGoal(e:React.FormEvent){e.preventDefault();const amount=Number(target);if(!name.trim()||!Number.isFinite(amount)||amount<=0)return;setGoals(g=>[...g,{id:Date.now(),name:name.trim(),target:amount}]);setName("");setTarget("");}
  if(loading)return <Loading label="Loading goals…"/>;
  const saved=Number(dashboard?.totalBalance??0);
  return <div className="page-stack"><div className="page-intro"><div><h2>Plan for what matters</h2><p>Set a target and track it against your combined wallet balance.</p></div></div>{error&&<ErrorMessage>{error}</ErrorMessage>}<div className="goal-note"><strong>Goal saving calculation</strong><span>“Already saved” is calculated from the total balance of all your wallets. Goal details are currently kept in this page only because the backend does not yet expose a goals API.</span></div><section className="card form-card"><div className="section-heading"><div><h2>Create a goal</h2><p>For example, an emergency fund or a new laptop.</p></div><span className="metric-icon purple">◎</span></div><form className="goal-form" onSubmit={addGoal}><label>Goal name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Emergency fund" required/></label><label>Target amount (MGA)<input type="number" min="1" step="1" value={target} onChange={e=>setTarget(e.target.value)} placeholder="500000" required/></label><button className="primary-button">Add goal</button></form></section><div className="goal-grid">{goals.map(g=>{const progress=Math.max(0,Math.min(100,saved/g.target*100));return <section className="card goal-card" key={g.id}><div className="goal-card-top"><span className="metric-icon purple">◎</span><button className="danger-text" onClick={()=>setGoals(gs=>gs.filter(x=>x.id!==g.id))}>Remove</button></div><h3>{g.name}</h3><div className="goal-saved">{money(saved)} <small>saved</small></div><div className="goal-progress"><span style={{width:`${progress}%`}}/></div><div className="goal-footer"><span>{progress.toFixed(0)}% of target</span><strong>{money(g.target)}</strong></div><p className="muted">{saved>=g.target?"Target reached!":`${money(g.target-saved)} remaining`}</p></section>;})}</div></div>;
}
