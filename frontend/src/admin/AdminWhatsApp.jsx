import { useEffect, useState } from 'react';
import api from '../api/axios';

const DEFAULTS = [
  { _id:'t1', key:'welcome',          label:'Welcome Message',              isEnabled:true, message:'Welcome to Shivam Resort & Restaurant, {{name}}! 🙏 We are delighted to serve you.' },
  { _id:'t2', key:'invoice',          label:'Invoice Notification',         isEnabled:true, message:'Dear {{name}}, your invoice #{{invoiceNumber}} for ₹{{total}} is ready. Thank you for dining with us!' },
  { _id:'t3', key:'feedback',         label:'Feedback Request (10 min)',    isEnabled:true, message:'Dear {{name}}, share your feedback here: {{link}}' },
  { _id:'t4', key:'retention',        label:'7-Day Retention',              isEnabled:true, message:'We miss you, {{name}}! 😊 Visit Shivam Resort & Restaurant again.' },
  { _id:'t5', key:'birthday',         label:'Birthday Wish',                isEnabled:true, message:'Happy Birthday {{name}}! 🎂 Enjoy {{discount}}% OFF at Shivam Resort & Restaurant today!' },
  { _id:'t6', key:'birthday_reminder',label:'Birthday Reminder (7 days)',   isEnabled:true, message:'Your birthday is around the corner, {{name}}! 🎁 We have a surprise waiting.' },
];

const VARS = { welcome:['{{name}}'], invoice:['{{name}}','{{invoiceNumber}}','{{total}}'], feedback:['{{name}}','{{link}}'], retention:['{{name}}'], birthday:['{{name}}','{{discount}}'], birthday_reminder:['{{name}}'] };

export default function AdminWhatsApp() {
  const [templates, setTemplates] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/whatsapp/templates'), api.get('/whatsapp/campaigns')])
      .then(([t, c]) => { setTemplates(t.data.data); setCampaign(c.data.data); setOffline(false); })
      .catch(() => { setTemplates(DEFAULTS); setCampaign({ _id:'c1', name:'Default Birthday Campaign', discountPercent:10, isEnabled:true }); setOffline(true); })
      .finally(() => setLoading(false));
  }, []);

  const saveTemplate = async tpl => {
    setSaving(true);
    try {
      if (!offline) await api.put(`/whatsapp/templates/${tpl._id}`, editForm);
      setTemplates(p => p.map(t => t._id === tpl._id ? {...t, ...editForm} : t));
      setSuccess('Template saved.'); setEditing(null);
    } catch { setError('Save failed.'); }
    finally { setSaving(false); }
  };

  const saveCampaign = async () => {
    setSaving(true);
    try {
      if (!offline) await api.put(`/whatsapp/campaigns/${campaign._id}`, campaign);
      setSuccess('Campaign settings saved.');
    } catch { setError('Save failed.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-light">WhatsApp Automation</h1>
        <p className="font-sans text-xs text-charcoal-400 mt-0.5">Manage message templates and automation settings</p>
      </div>

      {offline && <div className="bg-amber-50 border border-amber-200 p-3 font-sans text-xs text-amber-700">⚠️ Demo Mode — changes won't be saved.</div>}
      {success && <div className="bg-green-50 border border-green-200 p-3 font-sans text-xs text-green-700 flex items-center justify-between">{success}<button onClick={()=>setSuccess('')}>✕</button></div>}
      {error && <div className="bg-red-50 border border-red-200 p-3 font-sans text-xs text-red-700 flex items-center justify-between">{error}<button onClick={()=>setError('')}>✕</button></div>}

      {/* API Setup info */}
      <div className="bg-charcoal-900 border border-gold-400/15 p-5 flex items-start gap-4">
        <span className="text-2xl flex-shrink-0">💬</span>
        <div>
          <p className="font-sans text-sm font-medium text-gold-300 mb-1">WhatsApp Business API Setup</p>
          <p className="font-sans text-xs text-cream-100/50 font-light leading-relaxed">
            Add <code className="bg-charcoal-800 px-1 py-0.5 text-gold-300">WA_API_URL</code> and <code className="bg-charcoal-800 px-1 py-0.5 text-gold-300">WA_API_KEY</code> in your backend <code className="bg-charcoal-800 px-1 py-0.5 text-gold-300">.env</code> to enable real WhatsApp sending.
            Compatible with <strong className="text-cream-100/70">Interakt</strong>, <strong className="text-cream-100/70">WATI</strong>, <strong className="text-cream-100/70">Twilio</strong> and any WhatsApp Business API provider.
          </p>
          <p className="font-sans text-[10px] text-cream-100/25 mt-1">Without API keys, messages are logged to console and wa.me links are generated as fallback.</p>
        </div>
      </div>

      {/* Birthday campaign */}
      {campaign && (
        <div className="bg-white border border-cream-200 p-5">
          <p className="font-serif text-base text-charcoal-900 mb-5">🎂 Birthday Campaign Settings</p>
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="label-luxury">Campaign Name</label>
              <input className="input-luxury" value={campaign.name} onChange={e => setCampaign(p => ({...p, name: e.target.value}))} />
            </div>
            <div>
              <label className="label-luxury">Discount Percentage</label>
              <input type="number" className="input-luxury" min="1" max="50" value={campaign.discountPercent} onChange={e => setCampaign(p => ({...p, discountPercent: Number(e.target.value)}))} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-charcoal-600">
                <input type="checkbox" checked={campaign.isEnabled} onChange={e => setCampaign(p => ({...p, isEnabled: e.target.checked}))} className="accent-gold-400 w-4 h-4" />
                Campaign Enabled
              </label>
            </div>
          </div>
          <button onClick={saveCampaign} disabled={saving} className="btn-primary mt-5 text-[10px] disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Campaign Settings'}
          </button>
        </div>
      )}

      {/* Templates */}
      {loading ? <div className="flex justify-center py-12"><div className="spinner"/></div> : (
        <div className="space-y-4">
          <p className="font-serif text-base text-charcoal-900">Message Templates</p>
          {templates.map(tpl => (
            <div key={tpl._id} className="bg-white border border-cream-200 p-5 hover:border-gold-300 transition-colors">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <p className="font-sans text-sm font-medium text-charcoal-800">{tpl.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="font-sans text-[9px] text-gold-600 bg-gold-50 border border-gold-200 px-1.5 py-0.5">{tpl.key}</code>
                    {VARS[tpl.key]?.map(v => <span key={v} className="font-mono text-[9px] bg-cream-100 text-charcoal-500 px-1.5 py-0.5">{v}</span>)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-sans text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 ${tpl.isEnabled ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {tpl.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  {editing === tpl._id
                    ? <button onClick={() => setEditing(null)} className="font-sans text-[10px] text-charcoal-400 hover:text-charcoal-700">Cancel</button>
                    : <button onClick={() => { setEditing(tpl._id); setEditForm({ message: tpl.message, isEnabled: tpl.isEnabled }); }}
                        className="font-sans text-[10px] tracking-wide uppercase px-3 py-1.5 bg-gold-50 text-gold-700 border border-gold-200 hover:bg-gold-100 transition-colors">
                        Edit
                      </button>
                  }
                </div>
              </div>

              {editing === tpl._id ? (
                <div className="space-y-3">
                  <textarea rows={4} className="input-luxury resize-none text-sm" value={editForm.message}
                    onChange={e => setEditForm(p => ({...p, message: e.target.value}))} />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-charcoal-600">
                      <input type="checkbox" checked={editForm.isEnabled} onChange={e => setEditForm(p => ({...p, isEnabled: e.target.checked}))} className="accent-gold-400 w-4 h-4" />
                      Enabled
                    </label>
                    <button onClick={() => saveTemplate(tpl)} disabled={saving} className="btn-primary text-[10px] px-4 py-2 disabled:opacity-60">
                      {saving ? 'Saving...' : 'Save Template'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-sans text-sm text-charcoal-500 bg-cream-50 border border-cream-200 p-3 leading-relaxed">{tpl.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
