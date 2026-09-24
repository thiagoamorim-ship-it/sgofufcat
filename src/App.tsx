import React, { useState } from 'react';
import { RetentionCalculatorUI } from './components/RetentionCalculatorUI';
import { DanfeUploaderUI } from './components/DanfeUploaderUI';
import { CndManagerUI } from './components/CndManagerUI';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calc' | 'danfe' | 'cnd'>('calc');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Topbar UFCAT */}
      <header className="bg-[#0f2a4a] text-white p-4 shadow-md border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded text-xs font-bold tracking-wider">UFCAT</div>
            <h1 className="text-lg font-bold">SGOFUFCAT - Superintendência de Gestão Orçamentária e Financeira</h1>
          </div>
          <span className="text-xs bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
            Sistema Ativo
          </span>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#163a63] text-white border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex gap-1 px-4">
          <button
            onClick={() => setActiveTab('calc')}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'calc'
                ? 'bg-white/10 text-white border-blue-400 font-semibold'
                : 'text-blue-100 hover:bg-white/5 border-transparent'
            }`}
          >
            1. Calculadora & Parametrização
          </button>
          <button
            onClick={() => setActiveTab('danfe')}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'danfe'
                ? 'bg-white/10 text-white border-blue-400 font-semibold'
                : 'text-blue-100 hover:bg-white/5 border-transparent'
            }`}
          >
            2. Emissão DANFE / NFe
          </button>
          <button
            onClick={() => setActiveTab('cnd')}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'cnd'
                ? 'bg-white/10 text-white border-blue-400 font-semibold'
                : 'text-blue-100 hover:bg-white/5 border-transparent'
            }`}
          >
            3. Certidão de Regularidade (CND)
          </button>
        </div>
      </nav>

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'calc' && <RetentionCalculatorUI />}
        {activeTab === 'danfe' && <DanfeUploaderUI />}
        {activeTab === 'cnd' && <CndManagerUI />}
      </main>
    </div>
  );
}
