import React, { useMemo, useState } from "react";

function uid(prefix='id'){ return prefix + Math.random().toString(36).slice(2,9); }

export default function AdminPanel({users, products, onCreateOrder}){
  const [selectedUser, setSelectedUser] = useState(users?.[0]?.id_usuario || "");
  const [lines, setLines] = useState([]);

  const productMap = useMemo(() => Object.fromEntries((products||[]).map(p=>[p.id_producto,p])), [products]);

  function addLine(){ setLines(l => [...l, {id: uid('line'), id_producto: products[0].id_producto, cantidad:1}]); }

  function updateLine(id, patch){ setLines(l => l.map(x => x.id===id ? {...x, ...patch} : x)); }

  function removeLine(id){ setLines(l => l.filter(x=>x.id!==id)); }

  function createOrder(){
    if(!selectedUser) return alert('Seleccione un usuario');
    if(lines.length===0) return alert('Agregue al menos un producto');

    const items = lines.map(line => {
      const prod = productMap[line.id_producto];
      return { id_producto: line.id_producto, cantidad: line.cantidad, subtotal: (prod.precio * line.cantidad) };
    });
    const total = items.reduce((s,i)=>s+i.subtotal, 0);
    const newOrder = {
      id_pedido: uid('o'),
      fecha: new Date().toISOString(),
      estado: 'pendiente',
      total,
      id_usuario: selectedUser,
      items
    };
    onCreateOrder && onCreateOrder(newOrder);
    setLines([]);
    alert('Orden creada localmente: ' + newOrder.id_pedido);
  }

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Panel Admin (crea pedido)</h3>
      <div style={{marginBottom:8}}>
        <label>Usuario</label>
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} style={{width:'100%', padding:8, marginTop:6}}>
          {users.map(u => <option key={u.id_usuario} value={u.id_usuario}>{u.nombre} ({u.rol})</option>)}
        </select>
      </div>

      <div>
        <label>Productos</label>
        <div style={{marginTop:8}}>
          {lines.map(line => (
            <div key={line.id} style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
              <select value={line.id_producto} onChange={e=>updateLine(line.id, {id_producto:e.target.value})} style={{flex:1, padding:6}}>
                {products.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre} — ${p.precio.toFixed(2)}</option>)}
              </select>
              <input type="number" min="1" value={line.cantidad} onChange={e=>updateLine(line.id, {cantidad: Number(e.target.value) || 1})} style={{width:60,padding:6, borderRadius:10, border:'1px solid rgba(23, 162, 95, 0.25)'}} />
              <button className="btn btn-secondary" onClick={()=>removeLine(line.id)}>Eliminar</button>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addLine} style={{marginTop:6}}>Agregar producto</button>
        </div>
      </div>

      <div style={{marginTop:12, display:'flex', gap:8}}>
        <button className="btn" onClick={createOrder} style={{flex:1}}>Crear orden</button>
      </div>
    </div>
  );
}
