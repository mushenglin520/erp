
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Material, CostRecord, Transaction } from '../types';
import { TrendingUp, AlertCircle, DollarSign, Archive } from 'lucide-react';

interface Props {
  materials: Material[];
  costs: CostRecord[];
  transactions: Transaction[];
}

const Dashboard: React.FC<Props> = ({ materials, costs, transactions }) => {
  const totalValue = costs.reduce((acc, c) => acc + c.totalInventoryValue, 0);
  const highVarianceItems = costs.filter(c => Math.abs(c.variance) > 500).length;
  const lowStockItems = materials.filter(m => m.stockLevel <= m.reorderPoint).length;

  // Chart Data: Planned vs Actual Cost
  const costAnalysisData = costs.map(c => {
    const material = materials.find(m => m.id === c.materialId);
    return {
      name: material?.name || '未知物料',
      規劃成本: c.plannedCost,
      實際成本: c.actualCost,
    };
  });

  // Chart Data: Category Breakdown
  const categoryData = materials.reduce((acc: any[], m) => {
    const existing = acc.find(item => item.name === m.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: m.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<DollarSign className="w-5 h-5 text-blue-600" />} 
          label="總存貨價值" 
          value={`$${totalValue.toLocaleString()}`}
          trend="比上月增長 2.4%"
          color="blue"
        />
        <StatCard 
          icon={<AlertCircle className="w-5 h-5 text-red-600" />} 
          label="高差異警示項目" 
          value={highVarianceItems.toString()}
          trend="需在 CO 模組進行調整"
          color="red"
        />
        <StatCard 
          icon={<Archive className="w-5 h-5 text-amber-600" />} 
          label="庫存偏低項目" 
          value={lowStockItems.toString()}
          trend="建議啟動 MRP 補貨規劃"
          color="amber"
        />
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} 
          label="24小時內交易數" 
          value={transactions.length.toString()}
          trend="MM-CO 同步運行中"
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Variance Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">規劃 vs 實際成本分析 (CO 模組)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="規劃成本" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="實際成本" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">物料類別分佈 (MM 模組)</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color }: any) => {
  const bgColors = {
    blue: 'bg-blue-50',
    red: 'bg-red-50',
    amber: 'bg-amber-50',
    emerald: 'bg-emerald-50',
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-2 w-fit rounded-lg ${bgColors[color as keyof typeof bgColors]} mb-4`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
      <p className="text-xs text-slate-400 mt-2 font-medium">{trend}</p>
    </div>
  );
};

export default Dashboard;
