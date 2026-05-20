import React from "react";

export default function CategoryFilter({categories, selected, onChange}){
  return (
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      <select value={selected || ""} onChange={e => onChange(e.target.value || null)} style={{padding:8, borderRadius:6}}>
        <option value="">Todas las categorías</option>
        {categories.map(c => (
          <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
        ))}
      </select>
    </div>
  )
}
