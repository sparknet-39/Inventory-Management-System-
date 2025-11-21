import React from 'react';
import { InventoryItem, CategoryStat } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { StatCard } from './StatCard';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { CHART_COLORS } from '../constants';

interface DashboardProps {
  items: InventoryItem[];
  totalValue: number;
  lowStockCount: number;
  aiInsights: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ items, totalValue, lowStockCount, aiInsights }) => {
  
  // Prepare Chart Data
  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + item.quantity;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [items]);

  const valueByCategory = React.useMemo(() => {
    const vals: Record<string, number> = {};
    items.forEach(item => {
      vals[item.category] = (vals[item.category] || 0) + (item.quantity * item.unitPrice);
    });
    return Object.keys(vals).map(key => ({
      name: key,
      value: vals[key]
    }));
  }, [items]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Inventory Value" 
          value={`$${totalValue.toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-indigo-500"
          trend="+12.5% from last month"
          trendUp={true}
        />
        <StatCard 
          title="Total Items" 
          value={items.length} 
          icon={Package} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={lowStockCount} 
          icon={AlertTriangle} 
          color="bg-rose-500"
          trend={lowStockCount > 0 ? "Action required" : "Healthy levels"}
          trendUp={lowStockCount === 0}
        />
        <StatCard 
          title="Active Categories" 
          value={categoryData.length} 
          icon={TrendingUp} 
          color="bg-emerald-500"
        />
      </div>

      {/* AI Insights Section */}
      {aiInsights && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-violet-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-violet-900">AI Assistant Insights</h3>
          </div>
          <div className="prose prose-sm max-w-none text-violet-800">
            <ul className="list-disc pl-5 space-y-1">
              {aiInsights.split('\n').map((line, i) => (
                 line.trim().length > 0 ? <li key={i}>{line.replace(/^[•-]\s*/, '')}</li> : null
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Quantity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Stock Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Value Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Value by Category</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={valueByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {valueByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 formatter={(value: number) => `$${value.toLocaleString()}`}
                 contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {valueByCategory.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                <span className="text-xs text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};