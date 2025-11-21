import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Plus, Settings, Menu, X } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { InventoryTable } from './components/InventoryTable';
import { ItemModal } from './components/ItemModal';
import { InventoryItem, ViewMode } from './types';
import { INITIAL_INVENTORY } from './constants';
import { generateInventoryInsights } from './services/geminiService';

const App: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('nexus_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [view, setView] = useState<ViewMode>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>("");

  // Persist Data
  useEffect(() => {
    localStorage.setItem('nexus_inventory', JSON.stringify(items));
  }, [items]);

  // Initial AI Insight Generation
  useEffect(() => {
    const fetchInsights = async () => {
      if (items.length > 0) {
        const insight = await generateInventoryInsights(items);
        setAiInsights(insight);
      }
    };
    // Small delay to allow UI to render first
    const timer = setTimeout(fetchInsights, 1000);
    return () => clearTimeout(timer);
  }, [items]); 

  const handleAddItem = (newItem: InventoryItem) => {
    if (editingItem) {
      setItems(items.map(i => i.id === newItem.id ? newItem : i));
    } else {
      setItems([...items, newItem]);
    }
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Derived State
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const lowStockCount = items.filter(item => item.quantity <= item.threshold).length;

  const NavItem = ({ id, label, icon: Icon }: { id: ViewMode, label: string, icon: any }) => (
    <button
      onClick={() => {
        setView(id);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        view === id 
          ? 'bg-indigo-50 text-indigo-600 font-semibold' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-20">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Nexus</h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="inventory" label="Inventory" icon={Package} />
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-4 text-white">
            <p className="text-xs font-medium text-indigo-100 mb-1">Pro Tip</p>
            <p className="text-sm font-medium">Use Magic Fill to add items faster with AI.</p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      
      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <span className="font-bold text-xl text-slate-800">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="inventory" label="Inventory" icon={Package} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 z-30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-800">Nexus</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-slate-100 rounded-lg">
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {view === 'dashboard' ? 'Overview' : 'Inventory Management'}
            </h2>
            <p className="text-slate-500 mt-1">
              {view === 'dashboard' ? 'Real-time insights and statistics.' : 'Manage your products and stock levels.'}
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </div>

        {/* View Content */}
        {view === 'dashboard' && (
          <Dashboard 
            items={items} 
            totalValue={totalValue} 
            lowStockCount={lowStockCount} 
            aiInsights={aiInsights}
          />
        )}
        {view === 'inventory' && (
          <InventoryTable 
            items={items} 
            onEdit={openEditModal} 
            onDelete={handleDeleteItem} 
          />
        )}
      </main>

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddItem}
        initialData={editingItem}
      />
    </div>
  );
};

export default App;