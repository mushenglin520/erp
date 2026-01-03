
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Calculator, 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertTriangle,
  ChevronRight,
  RefreshCcw,
  Zap,
  TrendingUp,
  Database
} from 'lucide-react';
import { Material, CostRecord, Transaction, ModuleView } from './types';
import Dashboard from './components/Dashboard';
import MMModule from './components/MMModule';
import COModule from './components/COModule';
import { analyzeStockCosts } from './services/geminiService';

// Initial Mock Data
const INITIAL_MATERIALS: Material[] = [
  { id: 'MAT001', name: '原鋼板', category: '原材料', stockLevel: 450, reorderPoint: 100, unit: '公斤', valuationType: 'Standard' },
  { id: 'MAT002', name: '液壓油', category: '耗材', stockLevel: 25, reorderPoint: 50, unit: '公升', valuationType: 'Moving Average' },
  { id: 'MAT003', name: '發動機組件', category: '半成品', stockLevel: 120, reorderPoint: 30, unit: '件', valuationType: 'Standard' },
  { id: 'MAT004', name: '封箱膠帶', category: '包裝材料', stockLevel: 800, reorderPoint: 200, unit: '捲', valuationType: 'Moving Average' },
];

const INITIAL_COSTS: CostRecord[] = [
  { materialId: 'MAT001', standardPrice: 15.5, actualPrice: 16.2, totalInventoryValue: 6975, plannedCost: 7000, actualCost: 7290, variance: 290 },
  { materialId: 'MAT002', standardPrice: 45.0, actualPrice: 48.5, totalInventoryValue: 1125, plannedCost: 2250, actualCost: 1212.5, variance: -1037.5 },
  { materialId: 'MAT003', standardPrice: 1200, actualPrice: 1150, totalInventoryValue: 144000, plannedCost: 144000, actualCost: 138000, variance: -6000 },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'T001', materialId: 'MAT001', type: 'Goods Receipt', quantity: 100, amount: 1620, timestamp: '2024-10-25 09:00', costCenter: 'CC_PROD_01' },
  { id: 'T002', materialId: 'MAT002', type: 'Goods Issue', quantity: 5, amount: 242.5, timestamp: '2024-10-25 14:20', costCenter: 'CC_MAINT_02' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ModuleView>('Dashboard');
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [costs, setCosts] = useState<CostRecord[]>(INITIAL_COSTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeStockCosts(materials, costs, transactions);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const getTitle = () => {
    switch(activeTab) {
      case 'Dashboard': return '總覽儀表板';
      case 'MM': return '物料管理 (MM)';
      case 'CO': return '成本控制 (CO)';
      default: return activeTab;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">NexGen ERP</h1>
            <p className="text-xs text-slate-400">CO-MM 集成系統</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="控制台首頁" 
            active={activeTab === 'Dashboard'} 
            onClick={() => setActiveTab('Dashboard')} 
          />
          <NavItem 
            icon={<Package className="w-5 h-5" />} 
            label="MM 物料管理" 
            active={activeTab === 'MM'} 
            onClick={() => setActiveTab('MM')} 
          />
          <NavItem 
            icon={<Calculator className="w-5 h-5" />} 
            label="CO 管理會計" 
            active={activeTab === 'CO'} 
            onClick={() => setActiveTab('CO')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          >
            {isAnalyzing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            AI 成本分析顧問
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{getTitle()}</h2>
            <p className="text-sm text-slate-500">即時 MM-CO 同步數據流</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-xs font-semibold px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              系統連線正常
            </div>
          </div>
        </header>

        <div className="p-8">
          {aiAnalysis && (
            <div className="mb-8 p-6 bg-white border-l-4 border-blue-600 rounded-r-xl shadow-md transition-all animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-2 mb-3 text-blue-600">
                <Zap className="w-5 h-5" />
                <h3 className="font-bold text-lg">AI 智能集成分析報告</h3>
              </div>
              <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm bg-slate-50 p-4 rounded-lg">
                {aiAnalysis}
              </div>
              <button onClick={() => setAiAnalysis(null)} className="mt-4 text-xs text-slate-400 hover:text-slate-600 underline">關閉分析</button>
            </div>
          )}

          {activeTab === 'Dashboard' && <Dashboard materials={materials} costs={costs} transactions={transactions} />}
          {activeTab === 'MM' && <MMModule materials={materials} setMaterials={setMaterials} transactions={transactions} />}
          {activeTab === 'CO' && <COModule costs={costs} materials={materials} />}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
      active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    {icon}
    <span>{label}</span>
    {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
  </button>
);

export default App;
