import { useEffect, useState, useRef } from 'react';
import api from '../../api/axios';

const TYPES = ['Deluxe Room','Premium Suite','Family Room','Banquet Hall'];
const COMMON_AMENITIES = ['AC', 'WiFi', 'TV', 'Hot Water', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Extra Beds', 'Lounge', 'Stage', 'AV System', 'Catering'];
const EMPTY = { name:'', type:'Deluxe Room', description:'', price:'', capacity:2, size:'', amenities:[], otherAmenities:'', isAvailable:true, roomNumber:'', images:[] };

const TYPE_STYLE = {
  'Deluxe Room':  'bg-blue-50 text-blue-700 border border-blue-200',
  'Premium Suite':'bg-gold-50 text-gold-700 border border-gold-200',
  'Family Room':  'bg-green-50 text-green-700 border border-green-200',
  'Banquet Hall': 'bg-purple-50 text-purple-700 border border-purple-200',
};

// Utility to build image URL
const getImageUrl = (img) => {
  if (!img) return '';
  if (img.startsWith('http') || img.startsWith('data:image/')) return img;
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const base = apiURL.endsWith('/api') ? apiURL.slice(0, -4) : apiURL;
  return `${base}${img}`;
};

// Convert file to base64
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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
  const [previewIdx, setPreviewIdx] = useState({}); // per-room active slide index
  const [uploadingImgs, setUploadingImgs] = useState(false);
  const fileInputRef = useRef(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rooms/manage');
      setRooms(res.data.data);
      setOffline(false);
    } catch {
      setRooms([]);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (room) => {
    const common = room.amenities?.filter(a => COMMON_AMENITIES.includes(a)) || [];
    const others = room.amenities?.filter(a => !COMMON_AMENITIES.includes(a)) || [];
    setForm({
      ...room,
      amenities: common,
      otherAmenities: others.join(', '),
      price: room.price.toString(),
      images: room.images || [],
    });
    setEditing(room._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle multiple image file selection → convert to base64
  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingImgs(true);
    try {
      const base64Array = await Promise.all(files.map(f => toBase64(f)));
      setForm(p => ({ ...p, images: [...(p.images || []), ...base64Array] }));
    } catch (err) {
      console.error('Image processing error:', err);
      setError('Failed to process images. Try smaller files.');
    } finally {
      setUploadingImgs(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (idx) => {
    setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  const amenitiesArray = [
  ...(Array.isArray(form.amenities)
      ? form.amenities
      : typeof form.amenities === 'string'
      ? form.amenities.split(',').map(a => a.trim()).filter(Boolean)
      : []),

  ...(form.otherAmenities
      ? form.otherAmenities.split(',').map(a => a.trim()).filter(Boolean)
      : [])
];

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        capacity: Number(form.capacity),
        
        amenities:amenitiesArray, 
          
        images: form.images || [],
      };
      if (offline) {
        if (editing) setRooms(p => p.map(r => r._id === editing ? { ...r, ...payload } : r));
        else setRooms(p => [{ _id: Date.now().toString(), ...payload }, ...p]);
        setSuccess(`Room ${editing ? 'updated' : 'created'} (demo mode).`);
      } else {
        if (editing) await api.put(`/rooms/manage/${editing}`, payload);
        else await api.post('/rooms/manage', payload);
        setSuccess(`Room ${editing ? 'updated' : 'created'} successfully.`);
        fetchRooms();
      }
      setShowForm(false); setEditing(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    setDeletingId(id);
    try {
      if (!offline) await api.delete(`/rooms/manage/${id}`);
      setRooms(p => p.filter(r => r._id !== id));
      setSuccess('Room deleted.');
    } catch { setError('Delete failed.'); }
    finally { setDeletingId(null); }
  };

  const slideNext = (roomId, len) =>
    setPreviewIdx(p => ({ ...p, [roomId]: ((p[roomId] || 0) + 1) % len }));
  const slidePrev = (roomId, len) =>
    setPreviewIdx(p => ({ ...p, [roomId]: ((p[roomId] || 0) - 1 + len) % len }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-light">Manage Rooms</h1>
          <p className="font-sans text-xs text-charcoal-400 mt-0.5">{rooms.length} rooms configured</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-[10px] px-5 py-2.5">+ Add Room</button>
      </div>

      {offline && <div className="bg-amber-50 border border-amber-200 p-3 font-sans text-xs text-amber-700">⚠️ Demo Mode — connect backend to save rooms.</div>}
      {success && <div className="bg-green-50 border border-green-200 p-3 font-sans text-xs text-green-700 flex items-center justify-between">{success}<button onClick={() => setSuccess('')}>✕</button></div>}
      {error && <div className="bg-red-50 border border-red-200 p-3 font-sans text-xs text-red-700 flex items-center justify-between">{error}<button onClick={() => setError('')}>✕</button></div>}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white border border-cream-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg text-charcoal-900">{editing ? 'Edit Room' : 'Add New Room'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-charcoal-300 hover:text-charcoal-700 text-xl">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Number */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label-luxury">Room Name *</label>
                <input className="input-luxury" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Royal Deluxe Room" required />
              </div>
              <div>
                <label className="label-luxury">Room Number</label>
                <input className="input-luxury" value={form.roomNumber}
                  onChange={e => setForm(p => ({ ...p, roomNumber: e.target.value }))}
                  placeholder="e.g. 101" />
              </div>
            </div>

            {/* Type + Price + Capacity */}
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="label-luxury">Type *</label>
                <select className="input-luxury" value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label-luxury">Price / Night (₹) *</label>
                <input type="number" className="input-luxury" value={form.price}
                  onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required />
              </div>
              <div>
                <label className="label-luxury">Capacity (guests)</label>
                <input type="number" className="input-luxury" min="1" value={form.capacity}
                  onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} />
              </div>
            </div>

            {/* Amenities Checklist */}
            <div>
              <label className="label-luxury mb-2 block">Common Amenities</label>
              <div className="grid grid-cols-3 gap-2">
                {COMMON_AMENITIES.map(amenity => (
                  <label key={amenity} className="flex items-center gap-2 font-sans text-xs text-charcoal-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(amenity)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm(p => ({
                          ...p,
                          amenities: checked
                            ? [...p.amenities, amenity]
                            : p.amenities.filter(a => a !== amenity)
                        }));
                      }}
                      className="accent-gold-400"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
              <label className="label-luxury mt-4 block">Other Amenities (comma separated)</label>
              <input className="input-luxury" value={form.otherAmenities}
                onChange={e => setForm(p => ({ ...p, otherAmenities: e.target.value }))}
                placeholder="e.g. Sauna, Gym" />
            </div>

            {/* Description */}
            <div>
              <label className="label-luxury">Description</label>
              <textarea rows={2} className="input-luxury resize-none" value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Brief description of the room..." />
            </div>

            {/* ── IMAGE UPLOAD ── */}
            <div>
              <label className="label-luxury">Room Images</label>
              <div
                className="border-2 border-dashed border-cream-300 hover:border-gold-400 rounded p-5 text-center cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageFiles}
                />
                {uploadingImgs ? (
                  <p className="font-sans text-xs text-charcoal-400">Processing images...</p>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-charcoal-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p className="font-sans text-xs text-charcoal-400">Click to upload images <span className="text-gold-500">(multiple allowed)</span></p>
                    <p className="font-sans text-[10px] text-charcoal-300 mt-1">JPG, PNG, WEBP · Stored as base64</p>
                  </>
                )}
              </div>

              {/* Image previews */}
              {form.images?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 border border-cream-200 overflow-hidden group">
                      <img src={img} alt={`Room ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center leading-none"
                      >
                        ✕
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gold-400 text-charcoal-900 text-[8px] text-center font-sans font-medium py-0.5">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available */}
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-charcoal-600">
              <input type="checkbox" checked={form.isAvailable}
                onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))}
                className="accent-gold-400 w-4 h-4" />
              Available for Booking
            </label>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving || uploadingImgs} className="btn-primary disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update Room' : 'Create Room'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-outline dark">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms grid */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="spinner" /></div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16 bg-white border border-cream-200">
          <p className="font-serif text-lg text-charcoal-300 italic">No rooms added yet. Click "+ Add Room" to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {rooms.map(room => {
            const imgs = room.images?.filter(Boolean) || [];
            const activeSlide = previewIdx[room._id] || 0;

            return (
              <div key={room._id} className="bg-white border border-cream-200 hover:border-gold-300 hover:shadow-luxury transition-all duration-300 overflow-hidden">

                {/* Image area */}
                <div className="relative h-44 bg-charcoal-900 overflow-hidden">
                  {imgs.length > 0 ? (
                    <>
                      {/* Actual image */}
                      <img
                        src={getImageUrl(imgs[activeSlide])}
                        alt={room.name}
                        className="w-full h-full object-cover transition-opacity duration-500"
                      />
                      {/* Slide controls */}
                      {imgs.length > 1 && (
                        <>
                          <button
                            onClick={() => slidePrev(room._id, imgs.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() => slideNext(room._id, imgs.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm"
                          >
                            ›
                          </button>
                          {/* Dot indicators */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {imgs.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setPreviewIdx(p => ({ ...p, [room._id]: i }))}
                                className={`transition-all duration-300 ${i === activeSlide ? 'w-5 h-1.5 bg-gold-400' : 'w-1.5 h-1.5 rounded-full bg-white/50'}`}
                              />
                            ))}
                          </div>
                          {/* Image count */}
                          <div className="absolute top-2 right-2 bg-black/50 text-white font-sans text-[9px] px-2 py-0.5">
                            {activeSlide + 1}/{imgs.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    /* Placeholder when no images */
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(201,162,39,0.12),transparent_60%)]" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-40">
                        <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <p className="font-sans text-[10px] text-gold-400 tracking-wide">No images — click Edit to add</p>
                      </div>
                    </>
                  )}

                  {/* Type + Availability badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    {imgs.length === 0 && (
                      <span className={`font-sans text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 ${TYPE_STYLE[room.type] || ''}`}>
                        {room.type}
                      </span>
                    )}
                    <span className={`font-sans text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 ${room.isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {room.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  {/* Type badge when images present */}
                  {imgs.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 px-3 pt-6 pb-2"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                      <span className={`font-sans text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 ${TYPE_STYLE[room.type] || ''}`}>
                        {room.type}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="font-serif text-base text-charcoal-900">{room.name}</h3>
                    <span className="font-serif text-lg text-gold-500 flex-shrink-0 ml-2">₹{room.price?.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="font-sans text-[10px] text-charcoal-400 mb-2">
                    Room {room.roomNumber} · {room.capacity} guests{room.size ? ` · ${room.size}` : ''}
                    {imgs.length > 0 && <span className="ml-2 text-gold-500">📸 {imgs.length} photo{imgs.length > 1 ? 's' : ''}</span>}
                  </p>
                  {room.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.amenities.slice(0, 4).map(a => (
                        <span key={a} className="font-sans text-[9px] bg-cream-100 text-charcoal-500 px-1.5 py-0.5">{a}</span>
                      ))}
                      {room.amenities.length > 4 && <span className="font-sans text-[9px] text-charcoal-400">+{room.amenities.length - 4}</span>}
                    </div>
                  )}
                  <div className="flex gap-2 pt-3 border-t border-cream-100">
                    <button onClick={() => openEdit(room)}
                      className="flex-1 font-sans text-[10px] tracking-wide uppercase py-1.5 bg-gold-50 text-gold-700 border border-gold-200 hover:bg-gold-100 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(room._id)} disabled={deletingId === room._id}
                      className="flex-1 font-sans text-[10px] tracking-wide uppercase py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors">
                      {deletingId === room._id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}