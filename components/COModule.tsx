
import React from 'react';
import { Material, CostRecord } from '../types';
import { TrendingDown, TrendingUp, DollarSign, PieChart, Calculator } from 'lucide-react';

interface Props {
  costs: CostRecord[];
  materials: Material[];
}

const COModule: React.FC<Props> = ({ costs, materials }) => {
  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">存貨成本分析 (CO-PC)</h3>
          <p className="text-sm text-slate-500">串接 MM 模組取得即時庫存評價數據</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">總成本影響 (CO Impact)</p>
            <p className="text-xl font-black text-slate-900">$218,527.50</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {costs.map(cost => {
          const material = materials.find(m => m.id === cost.materialId);
          const isOverBudget = cost.variance > 0;
          return (
            <div key={cost.materialId} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full hover:border-blue-300 transition-all cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{material?.name}</h4>
                  <p className="text-xs font-mono text-slate-400">{cost.materialId}</p>
                </div>
                <div className={`p-2 rounded-lg ${isOverBudget ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {isOverBudget ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                  <div>
                    <p className="text-xs text-slate-400">總價值 (Total Value)</p>
                    <p className="text-lg font-bold text-slate-800">${cost.totalInventoryValue.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">實際單價</p>
                    <p className="text-sm font-semibold text-slate-700">${cost.actualPrice}/單位</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-400 text-xs mb-1">規劃成本 (Planned)</p>
                    <p className="font-bold text-slate-700">${cost.plannedCost.toLocaleString()}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isOverBudget ? 'bg-red-50' : 'bg-green-50'}`}>
                    <p className={`${isOverBudget ? 'text-red-400' : 'text-green-400'} text-xs mb-1`}>差異 (Variance)</p>
                    <p className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                      {isOverBudget ? '+' : ''}{cost.variance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  <span>採購價格效率</span>
                  <span>{((cost.standardPrice / cost.actualPrice) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{width: `${Math.min(100, (cost.standardPrice / cost.actualPrice) * 100)}%`}}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CO Analysis Summary */}
      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <PieChart className="w-6 h-6 text-blue-600" />
          成本控制洞察報告 (CO Insights)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <InsightItem label="存貨週轉率" value="4.2x" sub="目標: 5.0x" />
          <InsightItem label="成本差異比例" value="1.8%" sub="維持穩定" color="green" />
          <InsightItem label="庫存準確率" value="99.4%" sub="MM 模組稽核" />
          <InsightItem label="計價變動損益" value="-$4,210" sub="移動平均法影響" color="orange" />
        </div>
      </div>
    </div>
  );
};

const InsightItem = ({ label, value, sub, color }: any) => {
  const textColor = color === 'green' ? 'text-green-600' : color === 'orange' ? 'text-orange-600' : 'text-blue-600';
  return (
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black ${textColor}`}>{value}</p>
      <p className="text-xs text-slate-500 font-medium mt-1">{sub}</p>
    </div>
  );
};

export default COModule;
