import React from "react";

export default function ProductCard({product, category}){
  return (
    <article className="card">
      <h3 style={{marginTop:0}}>{product.nombre}</h3>
      <div style={{fontSize:13, color:'#374151', marginBottom:8}}>{product.descripcion}</div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{fontWeight:700}}>${product.precio.toFixed(2)}</div>
          <div style={{fontSize:12, color:'#6b7280'}}>{category}</div>
        </div>
        <div>
          <span className="badge">{product.disponibilidad ? 'Disponible' : 'Agotado'}</span>
        </div>
      </div>
    </article>
  )
}
