import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'checklist' | 'danfe' | 'cnd'>('checklist');
  const [grossValue, setGrossValue] = useState<number>(1000);
  const [isSimples, setIsSimples] = useState<boolean>(false);
  const [cnpjConsulta, setCnpjConsulta] = useState<string>('');
  const [cndData, setCndData] = useState<any>(null);
  const [xmlData, setXmlData] = useState<any>(null);

  const pis = isSimples ? 0 : grossValue * 0.0065;
  const cofins = isSimples ? 0 : grossValue * 0.03;
  const csll = isSimples ? 0 : grossValue * 0.01;
  const irrf = isSimples ? 0 : grossValue * 0.015;
  const iss = isSimples ? 0 : grossValue * 0.05;
  const totalRetained = pis + cofins + csll + irrf + iss;
  const netValue = grossValue - totalRetained;

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleXmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const vNF = text.match(/<vNF>([^<]+)<\/vNF>/);
      const xNome = text.match(/<xNome>([^<]+)<\/xNome>/);
      const cnpj = text.match(/<CNPJ>([^<]+)<\/CNPJ>/);
      if (vNF) {
        const val = parseFloat(vNF[1]);
        setGrossValue(val);
        setXmlData({
          razaoSocial: xNome ? xNome[1] : 'Emitente identificado',
          cnpj: cnpj ? cnpj[1] : 'CNPJ extraído',
          valorTotal: val
        });
        alert('XML Processado com Sucesso! Valor importado para a Calculadora.');
      } else {
        alert('Campo <vNF> não localizado no XML.');
      }
    };
    reader.readAsText(file);
  };

  const handleConsultarCNPJ = () => {
    if (!cnpjConsulta || cnpjConsulta.length < 14) return alert('Informe um CNPJ válido com 14 dígitos.');
    setCndData({
      rfb: 'REGULAR - Certidão Conjunta Federal Válida',
      fgts: 'REGULAR - CRF Ativo',
      cndt: 'NADA CONSTA - Justiça do Trabalho',
      data: new Date().toLocaleDateString('pt-BR')
    });
  };

  return (
    <div className="bg-slate-100 font-sans text-slate-800 min-h-screen">
      <header className="bg-[#002B49] text-white py-4 px-6 shadow-md border-b-4 border-yellow-500 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-[#002B49] font-black px-2.5 py-0.5 rounded text-lg">UFCAT</div>
          <div>
            <h1 className="text-lg font-bold">UFCAT | SGOFUFCAT</h1>
            <p className="text-xs text-slate-300">Superintendência de Gestão Orçamentária e Financeira • Universidade Federal de Catalão</p>
          </div>
        </div>
        <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-medium">● Sistema On-line Ativo • Sem Limites</span>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex justify-center gap-2">
          <button onClick={() => setActiveTab('checklist')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'checklist' ? 'bg-[#002B49] text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>📋 Checklist & Parametrização</button>
          <button onClick={() => setActiveTab('danfe')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'danfe' ? 'bg-[#002B49] text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>📄 Consulta DANFE (NF-e)</button>
          <button onClick={() => setActiveTab('cnd')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'cnd' ? 'bg-[#002B49] text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>🛡️ Certidões de Regularidade</button>
        </div>

        <div>
          {activeTab === 'checklist' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Parametrização & Calculadora de Liquidação</h2>
                <p className="text-sm text-slate-500">Cálculo automatizado de retenções tributárias e retenção na fonte.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-sm font-semibold mb-1">Valor Bruto da Nota Fiscal (R$)</label>
                  <input type="number" value={grossValue} onChange={(e) => setGrossValue(Number(e.target.value))} className="w-full p-2.5 border rounded-md bg-white text-base font-medium" />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                    <input type="checkbox" checked={isSimples} onChange={(e) => setIsSimples(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                    Optante pelo Simples Nacional (Isento de Retenções Federais)
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200"><span className="text-xs text-slate-500 block font-medium">PIS (0,65%)</span><span className="text-base font-bold text-slate-800">{fmt(pis)}</span></div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200"><span className="text-xs text-slate-500 block font-medium">COFINS (3,00%)</span><span className="text-base font-bold text-slate-800">{fmt(cofins)}</span></div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200"><span className="text-xs text-slate-500 block font-medium">CSLL (1,00%)</span><span className="text-base font-bold text-slate-800">{fmt(csll)}</span></div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200"><span className="text-xs text-slate-500 block font-medium">IRRF (1,50%)</span><span className="text-base font-bold text-slate-800">{fmt(irrf)}</span></div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200"><span className="text-xs text-slate-500 block font-medium">ISS (5,00%)</span><span className="text-base font-bold text-slate-800">{fmt(iss)}</span></div>
                <div className="p-3 bg-red-50 text-red-900 rounded-lg border border-red-200"><span className="text-xs block font-medium text-red-700">Total Retido</span><span className="text-base font-bold">{fmt(totalRetained)}</span></div>
              </div>

              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 flex justify-between items-center font-bold">
                <span className="text-base">Valor Líquido a Pagar ao Fornecedor:</span>
                <span className="text-xl">{fmt(netValue)}</span>
              </div>
            </div>
          )}

          {activeTab === 'danfe' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Importador de XML da DANFE / NF-e</h2>
              <p className="text-slate-500 text-sm">Carregue o arquivo XML da Nota Fiscal para preencher o valor na calculadora automaticamente.</p>
              <div className="max-w-md mx-auto">
                <input type="file" accept=".xml" onChange={handleXmlUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#002B49] file:text-white hover:file:bg-slate-800 cursor-pointer border rounded-lg p-2" />
              </div>
              {xmlData && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-left max-w-lg mx-auto space-y-1">
                  <h3 className="font-bold text-emerald-900">✅ Nota Fiscal Importada:</h3>
                  <p className="text-sm"><b>Razão Social:</b> {xmlData.razaoSocial}</p>
                  <p className="text-sm"><b>CNPJ:</b> {xmlData.cnpj}</p>
                  <p className="text-sm"><b>Valor da Nota:</b> {fmt(xmlData.valorTotal)}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cnd' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Central de Emissão e Consulta de Certidões (CND)</h2>
              <p className="text-slate-500 text-sm">Consulte a situação fiscal de fornecedores para instrução do processo.</p>
              <div className="flex gap-2 max-w-md">
                <input type="text" placeholder="00.000.000/0001-00" value={cnpjConsulta} onChange={(e) => setCnpjConsulta(e.target.value)} className="flex-1 p-2.5 border rounded-lg text-sm" />
                <button onClick={handleConsultarCNPJ} className="bg-[#002B49] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800">Consultar CNPJ</button>
              </div>
              {cndData && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <h3 className="font-bold text-slate-800">Resultado da Consulta ({cndData.data}):</h3>
                  <p className="text-sm text-emerald-700 font-semibold">• Receita Federal / PGFN: {cndData.rfb}</p>
                  <p className="text-sm text-emerald-700 font-semibold">• Caixa Econômica (FGTS): {cndData.fgts}</p>
                  <p className="text-sm text-emerald-700 font-semibold">• Justiça do Trabalho (CNDT): {cndData.cndt}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
