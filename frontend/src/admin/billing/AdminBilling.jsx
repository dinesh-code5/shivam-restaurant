import { useEffect, useState } from 'react';
import api from '../../api/axios';

const MOCK_INVOICES = [
  { _id: '1', invoiceNumber: 'INV-0001', customerName: 'Rahul Sharma', customerPhone: '9876543210', tableNumber: 3, total: 1450.50, subtotal: 1381.43, gstAmount: 69.07, gstRate: 5, paymentMethod: 'cash', createdAt: new Date(Date.now() - 2 * 3600000) },
  { _id: '2', invoiceNumber: 'INV-0002', customerName: 'Priya Mehta', customerPhone: '9812345678', tableNumber: 7, total: 890.00, subtotal: 847.62, gstAmount: 42.38, gstRate: 5, paymentMethod: 'upi', createdAt: new Date(Date.now() - 5 * 3600000) },
  { _id: '3', invoiceNumber: 'INV-0003', customerName: 'Arvind Gupta', customerPhone: '9901234567', tableNumber: 1, total: 2340.75, subtotal: 2229.29, gstAmount: 111.46, gstRate: 5, paymentMethod: 'card', createdAt: new Date(Date.now() - 24 * 3600000) },
];

const AdminBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [search, setSearch] = useState('');

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/invoices', { params: search ? { search } : {} });
      setInvoices(res.data.data);
      setOffline(false);
    } catch {
      setInvoices(MOCK_INVOICES);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInvoices();
  };

  const approvePayment = async (id) => {
    if (!window.confirm('Approve payment?')) return;
    try {
        await api.put(`/invoices/${id}/approve-payment`);
        fetchInvoices();
    } catch (err) { alert('Approval failed.'); }
  };

  const rejectPayment = async (id) => {
    if (!window.confirm('Reject payment?')) return;
    try {
        await api.put(`/invoices/${id}/reject-payment`);
        fetchInvoices();
    } catch (err) { alert('Rejection failed.'); }
  };

  const openPDF = (id) => {
    if (offline) { alert('Connect backend to generate PDF invoices.'); return; }
    window.open(`${import.meta.env.VITE_API_URL}/invoices/${id}/pdf`, '_blank');
  };

  const totalRevenue = invoices.filter(inv => inv.paymentStatus === 'paid').reduce((s, inv) => s + inv.total, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal-900">Billing & Invoices</h1>
        <p className="text-charcoal-600 text-l">{invoices.length} invoices</p>
      </div>

      {offline && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex gap-2">⚠️ Demo Mode — showing sample invoices.</div>}

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card-luxury p-4 text-center">
          <p className="text-2xl font-display font-bold text-charcoal-900">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-charcoal-400 mt-1">Total Revenue (Paid)</p>
        </div>
        <div className="card-luxury p-4 text-center">
          <p className="text-2xl font-display font-bold text-charcoal-900">{invoices.filter(i => i.paymentStatus === 'pending').length}</p>
          <p className="text-xs text-charcoal-400 mt-1">Pending Verification</p>
        </div>
        <div className="card-luxury p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-2xl font-display font-bold text-charcoal-900">{invoices.length}</p>
          <p className="text-xs text-charcoal-400 mt-1">Total Invoices</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input className="input-field flex-1" placeholder="Search by name, phone or invoice number..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit" className="btn-gold px-5">Search</button>
        {search && <button type="button" onClick={() => { setSearch(''); fetchInvoices(); }} className="btn-outline-dark px-4">Clear</button>}
      </form>

      {/* Invoice table */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="spinner"></div></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gold-200 bg-cream-50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gold-gradient text-charcoal-900 text-xs font-semibold uppercase tracking-wide">
                <th className="text-left px-4 py-3">Customer / Table</th>
                <th className="text-left px-4 py-3">Receipt</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {invoices.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-charcoal-400">No invoices found.</td></tr>
              ) : invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-cream-100">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-charcoal-900">{inv.customerName}</p>
                    <p className="text-xs text-charcoal-500">Table: {inv.tableNumber || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3">
                    {inv.receiptImage ? (
                      <a href={`${import.meta.env.VITE_API_URL}${inv.receiptImage}`} target="_blank" rel="noreferrer" className="text-gold-700 underline text-xs">View Receipt</a>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold uppercase text-[10px] px-2 py-1 rounded ${inv.paymentStatus === 'pending' ? 'bg-amber-500 text-white' : inv.paymentStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-charcoal-900">
                    ₹{inv.total?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {inv.paymentStatus === 'pending' && (
                          <>
                            <button onClick={() => approvePayment(inv._id)} title="Approve Payment" className="p-1.5 rounded bg-green-600 text-white hover:bg-green-700 transition-colors">✅</button>
                            <button onClick={() => rejectPayment(inv._id)} title="Reject Payment" className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors">❌</button>
                          </>
                      )}
                      <button onClick={() => openPDF(inv._id)} title="Print/View PDF" className="p-1.5 rounded bg-charcoal-900 text-gold-300 hover:bg-charcoal-800 transition-colors">🖨️</button>
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
};

export default AdminBilling;
