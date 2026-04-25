import { useState } from 'react';
import { Key, X, Check, ExternalLink } from 'lucide-react';

export function ApiKeyBanner({ onSave }) {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(true);

  if (!show) return null;

  const handleSave = () => {
    if (key.startsWith('gsk_')) {
      onSave(key.trim());
      setSaved(true);
      setTimeout(() => setShow(false), 1500);
    } else {
      alert('Invalid key. Groq API keys start with "gsk_"');
    }
  };

  return (
    <div className="glass rounded-xl p-4 mb-6 border border-yellow-500/20 bg-yellow-500/5">
      <div className="flex items-start gap-3">
        <Key className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-200 mb-1">Enter your Groq API Key <span className="text-emerald-400 text-xs font-normal">(Free!)</span></p>
          <p className="text-xs text-slate-500 mb-3">
            Get a free key at{' '}
            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer"
              className="text-blue-400 hover:underline inline-flex items-center gap-0.5">
              console.groq.com <ExternalLink className="w-3 h-3" />
            </a>
            {' '}— sign up, go to API Keys, create one. Stored in memory only.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="gsk_..."
              className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 mono"
            />
            <button onClick={handleSave}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-yellow-600 hover:bg-yellow-500 text-white'}`}>
              {saved ? <Check className="w-4 h-4" /> : 'Save'}
            </button>
          </div>
        </div>
        <button onClick={() => setShow(false)} className="text-slate-600 hover:text-slate-400">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
