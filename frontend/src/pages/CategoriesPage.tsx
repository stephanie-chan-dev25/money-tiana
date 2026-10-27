import { useEffect, useState, type FormEvent } from "react";
import type { Category, CategoryType } from "../types/category.types";
import { categoryService } from "../services/category.service";
import { getApiError } from "../services/api";
import { Loading, ErrorMessage, EmptyState } from "../components/ui/Feedback";

export default function CategoriesPage() {
  const [items,setItems]=useState<Category[]>([]);
  const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const [name,setName]=useState(""); const [type,setType]=useState<CategoryType>("expense");
  const [editing,setEditing]=useState<number|null>(null); const [busy,setBusy]=useState(false);
  async function load(){try{setItems(await categoryService.list());setError("");}catch(e){setError(getApiError(e));}finally{setLoading(false);}}
  useEffect(()=>{void load();},[]);
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");try{const payload={name:name.trim(),type};if(editing!==null)await categoryService.update(editing,payload);else await categoryService.create(payload);setName("");setType("expense");setEditing(null);await load();}catch(e){setError(getApiError(e));}finally{setBusy(false);}}
  async function remove(id:number){if(!window.confirm("Delete this category?"))return;try{await categoryService.remove(id);await load();}catch(e){setError(getApiError(e));}}
  if(loading)return <Loading label="Loading categories…"/>;
  const income=items.filter(c=>c.type==="income"), expense=items.filter(c=>c.type==="expense");
  return <div className="page-stack"><div className="page-intro"><div><h2>Organize your money</h2><p>Categories help you understand where your income comes from and where you spend.</p></div></div>{error&&<ErrorMessage>{error}</ErrorMessage>}
  <div className="two-column-content"><section className="card form-card"><div className="section-heading"><div><h2>{editing!==null?"Edit category":"Create a category"}</h2><p>Choose whether it represents income or an expense.</p></div></div><form className="form-stack" onSubmit={submit}><label>Category name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Groceries" required maxLength={100}/></label><label>Category type<select value={type} onChange={e=>setType(e.target.value as CategoryType)}><option value="expense">Expense</option><option value="income">Income</option></select></label><div className="form-actions"><button className="primary-button" disabled={busy}>{busy?"Saving…":editing!==null?"Save changes":"Create category"}</button>{editing!==null&&<button type="button" className="secondary-button" onClick={()=>{setEditing(null);setName("");setType("expense");}}>Cancel</button>}</div></form></section>
  <section className="card list-card"><div className="section-heading"><div><h2>Your categories</h2><p>{items.length} total categories</p></div><span className="metric-icon purple">◈</span></div>{items.length?<div className="category-groups">{([{title:"Income",data:income,type:"income" as const},{title:"Expenses",data:expense,type:"expense" as const}]).map(group=><div key={group.type}><div className="group-title">{group.title}<span>{group.data.length}</span></div>{group.data.map(c=><div className="entity-row category-entity" key={c.id}><span className={`category-symbol ${group.type}`}>{group.type==="income"?"↙":"↗"}</span><div className="entity-main"><strong>{c.name}</strong><small>{group.title}</small></div><div className="row-actions"><button onClick={()=>{setEditing(c.id);setName(c.name);setType(c.type);}}>Edit</button><button className="danger-text" onClick={()=>void remove(c.id)}>Delete</button></div></div>)}</div>)}</div>:<EmptyState title="No categories yet" description="Add a category to classify your transactions."/>}</section></div></div>;
}
