import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import CategoryFilter from "./components/CategoryFilter";
import AdminPanel from "./components/AdminPanel";
import productsData from "./data/products.json";
import categories from "./data/categories.json";
import users from "./data/users.json";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem("udc_orders");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("udc_orders", JSON.stringify(orders));
  }, [orders]);

  const categoryMap = useMemo(() => Object.fromEntries(categories.map(c => [c.id_categoria, c.nombre])), []);

  const products = useMemo(() => {
    if (!selectedCategory) return productsData;
    return productsData.filter(p => p.id_categoria === selectedCategory);
  }, [selectedCategory]);

  function handleCreateOrder(newOrder){
    setOrders(prev => [newOrder, ...prev]);
  }

  return (
    <div>
      <Header />
      <main style={{padding: '20px', maxWidth: 1100, margin: '0 auto'}}>
        <section style={{display:'flex', gap:20}}>
          <div style={{flex:1}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2 style={{margin:0}}>Productos</h2>
              <CategoryFilter categories={categories} selected={selectedCategory} onChange={setSelectedCategory} />
            </div>

            <div style={{marginTop:12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12}}>
              {products.map(p => (
                <ProductCard key={p.id_producto} product={p} category={categoryMap[p.id_categoria]} />
              ))}
            </div>
          </div>

          <aside style={{width:360}}>
            <AdminPanel users={users} products={productsData} onCreateOrder={handleCreateOrder} />
            <div style={{marginTop:16}}>
              <h3>Órdenes creadas (local)</h3>
              {orders.length === 0 ? <div style={{color:'#6b7280'}}>No hay órdenes aún.</div> : (
                <ul style={{paddingLeft:16}}>
                  {orders.map(o => (
                    <li key={o.id_pedido} style={{marginBottom:8}}>
                      <strong>{o.id_pedido}</strong> — {new Date(o.fecha).toLocaleString()} — ${o.total.toFixed(2)} — {o.estado}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
