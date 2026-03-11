'use client';

import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<Array<{ id: number; name: string; key: string }>>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [theme, setTheme] = useState('dark');

  const addApiKey = () => {
    if (newKeyName) {
      setApiKeys([...apiKeys, { id: Date.now(), name: newKeyName, key: '••••••••••••' }]);
      setNewKeyName('');
    }
  };

  const removeApiKey = (id: number) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-neutral-400">Configure Mission Control</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {/* Appearance */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </section>

        {/* API Keys */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">API Keys & Integrations</h2>
          
          <div className="space-y-4">
            {/* Add New Key */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="API name (e.g., OpenAI, Stripe)"
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
              />
              <button
                onClick={addApiKey}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* API Keys List */}
            {apiKeys.length > 0 && (
              <div className="border-t border-neutral-800 pt-4 space-y-2">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{apiKey.name}</p>
                      <p className="text-xs text-neutral-500">{apiKey.key}</p>
                    </div>
                    <button
                      onClick={() => removeApiKey(apiKey.id)}
                      className="p-2 hover:bg-neutral-700 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Data Sources */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Data Sources</h2>
          
          <div className="space-y-3">
            <p className="text-sm text-neutral-400 mb-4">Connect your data sources and databases</p>
            
            <div className="grid grid-cols-2 gap-3">
              {['PostgreSQL', 'MongoDB', 'Firebase', 'Redis', 'Supabase', 'Airtable'].map((source) => (
                <button
                  key={source}
                  className="p-3 border border-neutral-700 rounded-lg hover:border-neutral-600 hover:bg-neutral-800/50 transition-colors text-sm"
                >
                  + Connect {source}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Webhooks */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Webhooks</h2>
          
          <div className="space-y-4">
            <p className="text-sm text-neutral-400">Webhook endpoints for your tools</p>
            
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
              <p className="text-xs text-neutral-500 mb-2">Webhook URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-neutral-900 px-3 py-2 rounded border border-neutral-700 text-neutral-300">
                  localhost:3000/api/webhooks/default
                </code>
                <button className="px-3 py-2 text-xs bg-neutral-700 rounded hover:bg-neutral-600">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
