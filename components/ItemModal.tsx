import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import { CATEGORIES } from '../constants';
import { suggestItemDetails } from '../services/geminiService';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  initialData?: InventoryItem | null;
}

export const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    sku: '',
    category: CATEGORIES[0],
    quantity: 0,
    unitPrice: 0,
    threshold: 5,
    description: ''
  });
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        name: '',
        sku: `SKU-${Math.floor(Math.random() * 10000)}`,
        category: CATEGORIES[0],
        quantity: 0,
        unitPrice: 0,
        threshold: 5,
        description: ''
      });
    }
  }, [initialData, isOpen]);

  const handleMagicFill = async () => {
    if (!formData.name || formData.name.length < 3) return;
    
    setIsThinking(true);
    try {
      const suggestion = await suggestItemDetails(formData.name);
      if (suggestion) {
        setFormData(prev => ({
          ...prev,
          category: CATEGORIES.includes(suggestion.category) ? suggestion.category : CATEGORIES[0],
          unitPrice: suggestion.estimatedPrice,
          description: suggestion.description,
          threshold: suggestion.suggestedThreshold
        }));
      }
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;
    
    const item: InventoryItem = {
      id: initialData?.id || crypto.randomUUID(),
      name: formData.name,
      sku: formData.sku,
      category: formData.category || 'Uncategorized',
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      threshold: Number(formData.threshold),
      description: formData.description || '',
      lastUpdated: new Date().toISOString()
    };
    onSave(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Input with Magic AI */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Item Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. Wireless Mouse"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <button
                type="button"
                onClick={handleMagicFill}
                disabled={!formData.name || isThinking}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
              >
                {isThinking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isThinking ? 'Thinking...' : 'Magic Fill'}
              </button>
            </div>
            <p className="text-xs text-slate-500">Tip: Enter a name and click Magic Fill to auto-complete details using AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">SKU</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Quantity</label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Unit Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.unitPrice}
                onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Low Stock Alert At</label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.threshold}
                onChange={e => setFormData({...formData, threshold: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {initialData ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};