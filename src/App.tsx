import React, { useState } from 'react';
import { RetentionCalculatorUI } from './components/RetentionCalculatorUI';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calc' | 'danfe' | 'cnd'>('calc');

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header do Sistema */}
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wide">UFCAT | SGOFUFCAT</h1>
          <span className="text-xs bg-blue-800 px-3 py-1 rounded-full border border-blue-700">
            Sistema de Gestão Orçamentária e Financeira
          </span>
        </div>
      </header>

      {/* Navegação por Abas */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex border-b border-slate-300 dark:border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('calc')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === 'calc'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t border-x border-slate-300 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            1. Calculadora de Retenção
          </button>
          <button
            onClick={() => setActiveTab('danfe')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === 'danfe'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t border-x border-slate-300 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            2. Emissão / Leitura DANFE
          </button>
          <button
            onClick={() => setActiveTab('cnd')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === 'cnd'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t border-x border-slate-300 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            3. Certidões & Regularidade (CND)
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="mt-4">
          {activeTab === 'calc' && <RetentionCalculatorUI />}
          {activeTab === 'danfe' && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold mb-2">Importador de XML DANFE</h3>
              <p className="text-slate-500 text-sm">Arraste ou selecione o arquivo XML da NFe para extrair os impostos automaticamente.</p>
            </div>
          )}
          {activeTab === 'cnd' && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold mb-2">Consulta de Certidões Negativas (CND)</h3>
              <p className="text-slate-500 text-sm">Insira o CNPJ do fornecedor para validar regularidade fiscal na Receita Federal, FGTS e CNDT.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
