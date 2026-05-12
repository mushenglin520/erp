# NexGen ERP — CO-MM 集成系統

## 專案概覽

本專案是一個 ERP 整合儀表板，展示**管理會計模組（CO）**與**物料管理模組（MM）**的深度整合。系統提供庫存成本計算、計劃控制，並透過 Gemini AI 進行成本分析。

---

## 技術架構

| 項目 | 技術 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 建置工具 | Vite |
| 樣式 | Tailwind CSS |
| 圖示庫 | Lucide React |
| AI 服務 | Google Gemini API |

---

## 目錄結構

```
erp/
├── App.tsx                  # 根元件、路由、狀態管理
├── index.tsx                # 應用程式入口
├── index.html               # HTML 模板
├── types.ts                 # TypeScript 型別定義
├── vite.config.ts           # Vite 設定
├── tsconfig.json            # TypeScript 設定
├── package.json             # 相依套件
├── components/
│   ├── Dashboard.tsx        # 總覽儀表板
│   ├── MMModule.tsx         # 物料管理模組
│   └── COModule.tsx         # 成本控制模組
└── services/
    └── geminiService.ts     # Gemini AI 服務
```

---

## 核心模組

### 1. 總覽儀表板（Dashboard）

提供 CO 與 MM 數據的即時彙整視圖，包含：

- 庫存水位摘要
- 成本差異指標
- 近期交易記錄

### 2. 物料管理模組（MM Module）

管理物料主檔與庫存交易：

- **物料類別**：原材料、耗材、半成品、包裝材料
- **計價方式**：標準成本（Standard）/ 移動平均（Moving Average）
- **交易類型**：收貨（Goods Receipt）/ 出貨（Goods Issue）

### 3. 成本控制模組（CO Module）

追蹤並分析成本：

- 標準成本 vs. 實際成本比較
- 計劃成本 vs. 實際成本差異（Variance）
- 庫存總價值計算
- 成本中心（Cost Center）分配

---

## 資料模型

### Material（物料）

```typescript
interface Material {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  reorderPoint: number;
  unit: string;
  valuationType: 'Standard' | 'Moving Average';
}
```

### CostRecord（成本記錄）

```typescript
interface CostRecord {
  materialId: string;
  standardPrice: number;
  actualPrice: number;
  totalInventoryValue: number;
  plannedCost: number;
  actualCost: number;
  variance: number;
}
```

### Transaction（交易）

```typescript
interface Transaction {
  id: string;
  materialId: string;
  type: 'Goods Receipt' | 'Goods Issue';
  quantity: number;
  amount: number;
  timestamp: string;
  costCenter: string;
}
```

---

## AI 成本分析顧問

系統整合 **Google Gemini API**，可針對當前庫存、成本記錄與交易數據生成智能分析報告。

觸發方式：點擊側欄底部的「AI 成本分析顧問」按鈕。

---

## 本地執行

**前置需求：** Node.js

```bash
# 1. 安裝相依套件
npm install

# 2. 設定環境變數
#    在 .env.local 中填入你的 Gemini API 金鑰
GEMINI_API_KEY=your_api_key_here

# 3. 啟動開發伺服器
npm run dev
```

---

## 功能截圖說明

| 頁面 | 路由（Tab） | 說明 |
|------|------------|------|
| 控制台首頁 | `Dashboard` | 整合數據總覽 |
| MM 物料管理 | `MM` | 物料主檔與交易管理 |
| CO 管理會計 | `CO` | 成本差異與成本中心報表 |
