
import React, { useState } from 'react';
import { Material, Transaction } from '../types';
import { Search, Plus, Filter, AlertTriangle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Props {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  transactions: Transaction[];
}

const MMModule: React.FC<Props> = ({ materials, setMaterials, transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTransactionTypeLabel = (type: string) => {
    return type === 'Goods Receipt' ? '收貨入庫' : '領料出庫';
  };

  const getValuationLabel = (type: string) => {
    return type === 'Standard' ? '標準價格計價' : '移動平均計價';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜尋物料編號或名稱..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            進階篩選
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
            <Plus className="w-4 h-4" />
            新增物料主檔
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">物料編號</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">物料描述</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">類別</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">庫存數量</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">庫存狀態</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">計價方式</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMaterials.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-blue-600 font-semibold">{m.id}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-400">單位: {m.unit}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{m.category}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-bold ${m.stockLevel <= m.reorderPoint ? 'text-red-600' : 'text-slate-900'}`}>
                    {m.stockLevel}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {m.stockLevel <= m.reorderPoint ? (
                    <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" />
                      建議補貨
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold gap-1 w-fit">
                      庫存充足
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 italic">{getValuationLabel(m.valuationType)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">近期庫存變動紀錄 (MM 模組)</h3>
          <div className="space-y-4">
            {transactions.map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${t.type === 'Goods Receipt' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {t.type === 'Goods Receipt' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{getTransactionTypeLabel(t.type)} - {t.materialId}</p>
                    <p className="text-xs text-slate-500">{t.timestamp} • 成本中心: {t.costCenter}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${t.type === 'Goods Receipt' ? 'text-green-600' : 'text-orange-600'}`}>
                    {t.type === 'Goods Receipt' ? '+' : '-'}{t.quantity}
                  </p>
                  <p className="text-xs text-slate-400">${t.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">物料需求規劃 (MRP)</h3>
            <p className="text-sm text-slate-400 mb-6">基於再訂購點自動觸發規劃與控制流程。</p>
            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-xl">
                <div className="flex justify-between text-sm mb-2">
                  <span>採購前置時間</span>
                  <span className="text-blue-400">平均 5 天</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-2/3"></div>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl">
                <div className="flex justify-between text-sm mb-2">
                  <span>安全庫存水平</span>
                  <span className="text-emerald-400">15% 緩衝</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
          <button className="mt-8 w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors">
            執行 MRP 模擬演算
          </button>
        </div>
      </div>
    </div>
  );
};

export default MMModule;
