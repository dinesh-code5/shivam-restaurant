import { useEffect, useState } from 'react';
import api from '../api/axios';

const CATEGORIES = ['Starters','Soups','Main Course','Breads','Rice & Biryani','Desserts','Beverages','Specials'];
const TYPES = ['Veg','Jain'];
const EMPTY = { name:'', description:'', price:'', category:'', type:'Veg', isAvailable:true, isFeatured:false };

const MOCK = [
  {_id:'1',name:'Paneer Tikka',category:'Starters',type:'Veg',price:280,isAvailable:true,isFeatured:true},
  {_id:'3',name:'Dal Makhani',category:'Main Course',type:'Veg',price:280,isAvailable:true,isFeatured:true},
  {_id:'5',name:'Mango Lassi',category:'Beverages',type:'Veg',price:120,isAvailable:true,isFeatured:true},
  {_id:'6',name:'Gulab Jamun',category:'Desserts',type:'Veg',price:120,isAvailable:true,isFeatured:false},
];

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get('/menu', { params:{ all:true } });
      setItems((res.data.data || []).filter(i => i.type !== 'Non-Veg')); setOffline(false);
    } catch { setItems(MOCK); setOffline(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setFormErrors({}); setShowForm(true); };
  const openEdit = item => {
    setForm({ name:item.name, description:item.description||'', price:item.price, category:item.category,
      type:item.type === 'Vegan' ? 'Jain' : item.type, isAvailable:item.isAvailable, isFeatured:item.isFeatured });
    setEditing(item._id); setFormErrors({}); setShowForm(true);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price required';
    if (!form.category) e.category = 'Required';
    return e;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      const payload = { ...form, type: form.type === 'Jain' ? 'Vegan' : form.type, price: Number(form.price) };
      if (offline) {
        if (editing) setItems(p => p.map(i => i._id === editing ? {...i, ...payload} : i));
        else setItems(p => [{ _id: Date.now().toString(), ...payload }, ...p]);
        setSuccess(`Item ${editing ? 'updated' : 'created'} (demo mode).`);
      } else {
        if (editing) await api.put(`/menu/${editing}`, payload);
        else await api.post('/menu', payload);
        setSuccess(`Item ${editing ? 'updated' : 'created'} successfully.`);
        fetch();
      }
      setShowForm(false); setEditing(null);
    } catch (err) { setError(err.response?.data?.message || 'Operation failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this menu item?')) return;
    setDeletingId(id);
    try {
      if (!offline) await api.delete(`/menu/${id}`);
      setItems(p => p.filter(i => i._id !== id)); setSuccess('Item deleted.');
    } catch { setError('Delete failed.'); }
    finally { setDeletingId(null); }
  };

  const filtered = (filterCat === 'All' ? items : items.filter(i => i.category === filterCat)).filter(i => i.type !== 'Non-Veg');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-light">Manage Menu</h1>
          <p className="font-sans text-xs text-charcoal-400 mt-0.5">{items.length} items total</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-[10px] px-5 py-2.5">+ Add Item</button>
      </div>

      {offline && <div className="bg-amber-50 border border-amber-200 p-3 font-sans text-xs text-amber-700 flex gap-2">⚠️ Demo Mode — changes won't save to database.</div>}
      {success && <div className="bg-green-50 border border-green-200 p-3 font-sans text-xs text-green-700 flex items-center justify-between">{success}<button onClick={() => setSuccess('')} className="text-green-500">✕</button></div>}
      {error && <div className="bg-red-50 border border-red-200 p-3 font-sans text-xs text-red-700 flex items-center justify-between">{error}<button onClick={() => setError('')} className="text-red-500">✕</button></div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-cream-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg text-charcoal-900">{editing ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            <button onClick={() => setShowForm(false)} className="text-charcoal-300 hover:text-charcoal-700 text-xl">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label-luxury">Item Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="input-luxury" placeholder="e.g. Paneer Tikka" />
                {formErrors.name && <p className="font-sans text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="label-luxury">Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} className="input-luxury" placeholder="e.g. 280" min="0" />
                {formErrors.price && <p className="font-sans text-xs text-red-500 mt-1">{formErrors.price}</p>}
              </div>
            </div>
            <div>
              <label className="label-luxury">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={2} className="input-luxury resize-none" placeholder="Short description..." />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label-luxury">Category *</label>
                <select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} className="input-luxury">
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {formErrors.category && <p className="font-sans text-xs text-red-500 mt-1">{formErrors.category}</p>}
              </div>
              <div>
                <label className="label-luxury">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))} className="input-luxury">
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-charcoal-600">
                <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(p => ({...p, isAvailable: e.target.checked}))} className="accent-gold-400 w-4 h-4" />
                Available
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-charcoal-600">
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({...p, isFeatured: e.target.checked}))} className="accent-gold-400 w-4 h-4" />
                Featured on Homepage
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update Item' : 'Create Item'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline dark">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-1.5">
        {['All', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`font-sans text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 transition-all ${
              filterCat === cat ? 'bg-gold-gradient text-charcoal-900 font-medium' : 'bg-cream-100 text-charcoal-500 hover:bg-cream-200'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? <div className="flex justify-center py-16"><div className="spinner" /></div> : (
        <div className="overflow-x-auto bg-white border border-cream-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-charcoal-900 text-gold-400">
                {['Item Name','Category','Type','Price','Status','Actions'].map(h => (
                  <th key={h} className={`py-3 px-4 font-sans text-[9px] tracking-[0.2em] uppercase font-medium text-left ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 font-sans text-sm text-charcoal-300 italic">No items found.</td></tr>
              ) : filtered.map(item => (
                <tr key={item._id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3 font-sans text-sm font-medium text-charcoal-800">
                    {item.name}
                    {item.isFeatured && <span className="ml-1.5 text-gold-400 text-xs">★</span>}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-charcoal-400">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-[9px] tracking-wide uppercase px-2 py-0.5 border ${
                      item.type === 'Veg' ? 'border-green-300 text-green-700 bg-green-50' :
                      item.type === 'Vegan' ? 'border-emerald-300 text-emerald-700 bg-emerald-50' :
                      'border-red-300 text-red-700 bg-red-50'}`}>
                      {item.type === 'Vegan' ? 'Jain' : item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-serif text-base text-charcoal-900">₹{item.price}</td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-[9px] tracking-wide uppercase px-2 py-0.5 ${
                      item.isAvailable ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="font-sans text-[10px] tracking-wide uppercase px-3 py-1 bg-gold-50 text-gold-700 border border-gold-200 hover:bg-gold-100 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(item._id)} disabled={deletingId === item._id}
                        className="font-sans text-[10px] tracking-wide uppercase px-3 py-1 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50">
                        {deletingId === item._id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
