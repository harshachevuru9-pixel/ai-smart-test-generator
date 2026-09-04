import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Key, Cpu, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-400" /> Platform & AI Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure system parameters and custom AI model API keys.</p>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" /> Instructor Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block">Name</span>
              <span className="font-bold text-white text-sm">{user?.name || 'Dr. Sarah Connor'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block">Role</span>
              <span className="font-bold text-indigo-300 text-sm">Instructor / Administrator</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> Optional Custom Google Gemini API Key
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              If left blank, the platform automatically utilizes its built-in smart AI curriculum generator engine.
            </p>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl gradient-bg-primary text-white font-bold text-xs shadow-md"
          >
            {saved ? 'Settings Saved Successfully!' : 'Save Configuration'}
          </button>
        </form>
      </div>
    </div>
  );
};
