import { useEffect, useState } from 'react';
import api from '../../api/axios';

const TYPES = ['Deluxe Room','Premium Suite','Family Room','Banquet Hall'];
const EMPTY = { name:'', type:'Deluxe Room', description:'', price:'', capacity:2, size:'', amenities:'', isAvailable:true, roomNumber:'' };

const MOCK = [
  { _id:'1', name:'Royal Deluxe Room', type:'Deluxe Room', price:2500, capacity:2, size:'320 sq ft', amenities:['AC','WiFi','TV','Hot Water'], isAvailable:true, roomNumber:'101', images:[] },
  { _id:'2', name:'Presidential Suite', type:'Premium Suite', price:5500, capacity:4, size:'650 sq ft', amenities:['AC','WiFi','TV','Mini Bar','Jacuzzi','Balcony'], isAvailable:true, roomNumber:'201', images:[] },
  { _id:'3', name:'Family Comfort Room', type:'Family Room', price:3800, capacity:6, size:'480 sq ft', amenities:['AC','WiFi','TV','Extra Beds','Lounge'], isAvailable:true, roomNumber:'102', images:[] },
  { _id:'4', name:'Grand Banquet Hall', type:'Banquet Hall', price:25000, capacity:200, size:'3500 sq ft', amenities:['AC','Stage','AV System','Catering'], isAvailable:true, roomNumber:'GF-BH', images:[] },
];

const TYPE_STYLE = {
  'Deluxe Room':  'bg-blue-50 text-blue-700 border border-blue-200',
  'Premium Suite':'bg-gold-50 text-gold-700 border border-gold-200',
  'Family Room':  'bg-green-50 text-green-700 border border-green-200',
  'Banquet Hall': 'bg-purple-50 text-purple-700 border border-purple-200',
};

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [image, setImage] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try { const res = await api.get('/rooms/manage'); setRooms(res.data.data); setOffline(false); }
    catch { setRooms(MOCK); setOffline(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowForm(true); setImage(null); };
  const openEdit = room => {
    setForm({ ...room, amenities: room.amenities?.join(', ') || '', price: room.price.toString() });
    setEditing(room._id); setShowForm(true); setImage(null); window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const formData = new FormData();
      // Ensure all required fields are explicitly appended
      formData.append('name', form.name);
      formData.append('type', form.type);
      formData.append('price', form.price);
      formData.append('capacity', form.capacity);
      formData.append('size', form.size);
      formData.append('roomNumber', form.roomNumber);
      formData.append('description', form.description);
      formData.append('isAvailable', form.isAvailable);

      const finalAmenities = [...form.amenities, ...form.otherAmenities.split(',').map(a => a.trim()).filter(Boolean)];
      formData.append('amenities', finalAmenities.join(','));
      
      if (image) formData.append('image', image);
      
      if (offline) {
        setSuccess(`Room ${editing ? 'updated' : 'created'} (demo mode).`);
      } else {
        if (editing) await api.put(`/rooms/manage/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        else await api.post('/rooms/manage', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccess(`Room ${editing ? 'updated' : 'created'}.`);
        fetchRooms();
      }
      setShowForm(false); setEditing(null); setImage(null);
    } catch (err) { setError(err.response?.data?.message || 'Operation failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this room?')) return;
    setDeletingId(id);
    try {
      if (!offline) await api.delete(`/rooms/manage/${id}`);
      setRooms(p => p.filter(r => r._id !== id)); setSuccess('Room deleted.');
    } catch { setError('Delete failed.'); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-light">Manage Rooms</h1>
          <p className="font-sans text-xs text-charcoal-400 mt-0.5">{rooms.length} rooms configured</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-[10px] px-5 py-2.5">+ Add Room</button>
      </div>

      {offline && <div className="bg-amber-50 border border-amber-200 p-3 font-sans text-xs text-amber-700">⚠️ Demo Mode</div>}
      {success && <div className="bg-green-50 border border-green-200 p-3 font-sans text-xs text-green-700 flex items-center justify-between">{success}<button onClick={()=>setSuccess('')}>✕</button></div>}
      {error && <div className="bg-red-50 border border-red-200 p-3 font-sans text-xs text-red-700 flex items-center justify-between">{error}<button onClick={()=>setError('')}>✕</button></div>}

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-cream-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg text-charcoal-900">{editing ? 'Edit Room' : 'Add New Room'}</h2>
            <button onClick={() => setShowForm(false)} className="text-charcoal-300 hover:text-charcoal-700 text-xl">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="label-luxury">Room Name *</label><input className="input-luxury" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="e.g. Royal Deluxe Room" required /></div>
              <div><label className="label-luxury">Room Number</label><input className="input-luxury" value={form.roomNumber} onChange={e => setForm(p => ({...p, roomNumber: e.target.value}))} placeholder="e.g. 101" /></div>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="label-luxury">Type *</label>
                <select className="input-luxury" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="label-luxury">Price / Night (₹) *</label><input type="number" className="input-luxury" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} required /></div>
              <div><label className="label-luxury">Capacity</label><input type="number" className="input-luxury" min="1" value={form.capacity} onChange={e => setForm(p => ({...p, capacity: e.target.value}))} /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="label-luxury">Size</label><input className="input-luxury" value={form.size} onChange={e => setForm(p => ({...p, size: e.target.value}))} placeholder="e.g. 320 sq ft" /></div>
              <div><label className="label-luxury">Amenities (comma separated)</label><input className="input-luxury" value={form.amenities} onChange={e => setForm(p => ({...p, amenities: e.target.value}))} placeholder="AC, WiFi, TV, Hot Water" /></div>
            </div>
            <div><label className="label-luxury">Description</label><textarea rows={2} className="input-luxury resize-none" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} /></div>
            <div>
              <label className="label-luxury">Room Image</label>
              <input type="file" className="input-luxury" accept="image/*" onChange={e => setImage(e.target.files[0])} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-charcoal-600">
              <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(p => ({...p, isAvailable: e.target.checked}))} className="accent-gold-400 w-4 h-4" />
              Available for Booking
            </label>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update Room' : 'Create Room'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline dark">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms grid */}
      {loading ? <div className="flex justify-center py-16"><div className="spinner"/></div> : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {rooms.map(room => (
            <div key={room._id} className="bg-white border border-cream-200 hover:border-gold-300 hover:shadow-luxury transition-all duration-300 overflow-hidden">
              {/* Image */}
              <div className="h-40 bg-charcoal-900 relative overflow-hidden flex items-center justify-center">
                {room.images && room.images.length > 0 ? (
                  <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(201,162,39,0.12),transparent_60%)]" />
                    <svg width="40" height="40" viewBox="0 0 100 100" style={{fill:'rgba(201,162,39,0.2)'}} className="relative z-10">
                      <path d="M50 10 C 55 25, 65 30, 75 28 C 65 35, 60 45, 50 55 C 40 45, 35 35, 25 28 C 35 30, 45 25, 50 10 Z" />
                    </svg>
                  </>
                )}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <span className={`font-sans text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 ${TYPE_STYLE[room.type]||''}`}>{room.type}</span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`font-sans text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 ${room.isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {room.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-base text-charcoal-900">{room.name}</h3>
                  <span className="font-serif text-lg text-gold-500 flex-shrink-0 ml-2">₹{room.price?.toLocaleString('en-IN')}</span>
                </div>
                <p className="font-sans text-[10px] text-charcoal-400 mb-2">Room {room.roomNumber} · {room.capacity} guests{room.size ? ` · ${room.size}` : ''}</p>
                {room.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {room.amenities.slice(0,4).map(a => <span key={a} className="font-sans text-[9px] bg-cream-100 text-charcoal-500 px-1.5 py-0.5">{a}</span>)}
                    {room.amenities.length > 4 && <span className="font-sans text-[9px] text-charcoal-400">+{room.amenities.length-4}</span>}
                  </div>
                )}
                <div className="flex gap-2 pt-3 border-t border-cream-100">
                  <button onClick={() => openEdit(room)} className="flex-1 font-sans text-[10px] tracking-wide uppercase py-1.5 bg-gold-50 text-gold-700 border border-gold-200 hover:bg-gold-100 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(room._id)} disabled={deletingId === room._id}
                    className="flex-1 font-sans text-[10px] tracking-wide uppercase py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors">
                    {deletingId === room._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
