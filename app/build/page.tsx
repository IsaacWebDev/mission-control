'use client';

import { useState } from 'react';
import { Save, X, Code2 } from 'lucide-react';

export default function BuildPage() {
  const [toolName, setToolName] = useState('');
  const [description, setDescription] = useState('');
  const [toolType, setToolType] = useState('webhook');
  const [config, setConfig] = useState('');

  const toolTypes = [
    { value: 'webhook', label: 'Webhook Handler' },
    { value: 'scheduled', label: 'Scheduled Task' },
    { value: 'api', label: 'API Integration' },
    { value: 'custom', label: 'Custom Script' },
  ];

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Build New Tool</h1>
        <p className="text-neutral-400">Create a custom automation tool</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Form */}
        <div className="col-span-2">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
            <form className="space-y-6">
              {/* Tool Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Tool Name</label>
                <input
                  type="text"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="e.g., Email Monitor"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this tool do?"
                  rows={3}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                />
              </div>

              {/* Tool Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Tool Type</label>
                <select
                  value={toolType}
                  onChange={(e) => setToolType(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                >
                  {toolTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Configuration */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Configuration (JSON)
                </label>
                <textarea
                  value={config}
                  onChange={(e) => setConfig(e.target.value)}
                  placeholder={'{\n  "endpoint": "https://...",\n  "method": "POST"\n}'}
                  rows={6}
                  className="w-full px-4 py-2 font-mono text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Tool
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg font-medium hover:border-neutral-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview / Info */}
        <div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 sticky top-24">
            <h3 className="font-semibold mb-4">Preview</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-neutral-400">Name</p>
                <p className="font-medium">{toolName || 'Your Tool'}</p>
              </div>

              <div>
                <p className="text-neutral-400">Type</p>
                <p className="font-medium capitalize">
                  {toolTypes.find((t) => t.value === toolType)?.label}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <p className="text-xs text-neutral-400 mb-2">Status</p>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded font-medium">
                  Draft
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-800">
              <p className="text-xs text-neutral-500 mb-3">Quick Tips</p>
              <ul className="text-xs space-y-2 text-neutral-400">
                <li>→ Name your tool clearly</li>
                <li>→ Choose the right type for your use case</li>
                <li>→ Test before deploying</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
