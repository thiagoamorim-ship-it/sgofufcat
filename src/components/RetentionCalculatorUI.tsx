import React, { useState } from 'react';

export function RetentionCalculatorUI() {
  const [valor, setValor] = useState<number>(1000);
  const [simples, setSimples] = useState<boolean>(false);

  const pis = simples ? 0 : valor * 0.0065;
  const cofins = simples ? 0 : valor * 0.03;
  const csll = simples ? 0 : valor * 0.01;
  const irrf = simples ? 0 : valor * 0.015;
  const iss = simples ? 0 : valor * 0.05;
  const total = pis + cofins + csll + irrf + iss;
  const liquido = valor - total;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Calculadora de Retenção de Tributos</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Valor Bruto do Serviço (R$)</label>
        <input 
          type="number" 
          value={valor} 
          onChange={(e) => setValor(Number(e.target.value))}
          className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
        />
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="simples"
          checked={simples} 
          onChange={(e) => setSimples(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        <label htmlFor="simples" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Optante pelo Simples Nacional
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <span className="text-xs text-slate-500">PIS (0,65%)</span>
          <p className="font-bold">R$ {pis.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <span className="text-xs text-slate-500">COFINS (3,00%)</span>
          <p className="font-bold">R$ {cofins.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <span className="text-xs text-slate-500">CSLL (1,00%)</span>
          <p className="font-bold">R$ {csll.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <span className="text-xs text-slate-500">IRRF (1,50%)</span>
          <p className="font-bold">R$ {irrf.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <span className="text-xs text-slate-500">ISS (5,00%)</span>
          <p className="font-bold">R$ {iss.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          <span className="text-xs">Total Retido</span>
          <p className="font-bold">R$ {total.toFixed(2)}</p>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 rounded-lg flex justify-between items-center font-bold">
        <span>Valor Líquido:</span>
        <span className="text-xl">R$ {liquido.toFixed(2)}</span>
      </div>
    </div>
  );
}
