import React, { useState } from "react";
import { Building2, FileCheck, FileText, ShieldCheck, Upload, Download, Search } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("checklist");
  const [chaveNfe, setChaveNfe] = useState("");
  const [cnpj, setCnpj] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Topbar Institucional SGOFUFCAT */}
      <header className="bg-[#002B49] text-white py-4 px-6 shadow-md border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg border border-white/20">
              <Building2 className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
                UFCAT <span className="text-yellow-400">|</span> SGOFUFCAT
              </h1>
              <p className="text-xs text-blue-200">
                Superintendência de Gestão Orçamentária e Financeira • Universidade Federal de Catalão
              </p>
            </div>
          </div>
          <div>
            <span className="text-xs bg-emerald-600/90 border border-emerald-400/40 px-3 py-1 rounded-full text-emerald-100 font-mono">
              ● Sistema On-line Ativo
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Navegação em Abas */}
        <div className="flex flex-wrap border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm gap-2">
          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "checklist" ? "bg-[#002B49] text-white shadow" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileCheck className="h-4 w-4" /> Checklist & Parametrização
          </button>
          <button
            onClick={() => setActiveTab("danfe")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "danfe" ? "bg-[#002B49] text-white shadow" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText className="h-4 w-4" /> Consulta DANFE (NF-e)
          </button>
          <button
            onClick={() => setActiveTab("certidoes")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "certidoes" ? "bg-[#002B49] text-white shadow" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> Certidões de Regularidade
          </button>
        </div>

        {/* Aba 1: Checklist */}
        {activeTab === "checklist" && (
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileCheck className="text-blue-600" /> Parametrização do Checklist
            </h2>
            <p className="text-sm text-slate-500">
              Faça a gestão dos ecrãs de instrução do checklist de liquidação e pagamento.
            </p>
            <div className="border-2 border-dashed border-slate-300 p-8 rounded-xl text-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all">
              <Upload className="mx-auto h-10 w-10 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700">Clique para carregar imagens de instrução do checklist</p>
              <p className="text-xs text-slate-400 mt-1">Formatos suportados: PNG, JPG ou WEBP</p>
            </div>
          </div>
        )}

        {/* Aba 2: DANFE */}
        {activeTab === "danfe" && (
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="text-blue-600" /> Consulta e Visualização de DANFE
            </h2>
            <p className="text-sm text-slate-500">
              Introduza a chave de acesso de 44 dígitos da Nota Fiscal Eletrónica para gerar o DANFE.
            </p>
            <div className="flex gap-2 max-w-xl">
              <input
                type="text"
                placeholder="Insira os 44 dígitos da chave de acesso NF-e..."
                value={chaveNfe}
                onChange={(e) => setChaveNfe(e.target.value)}
                maxLength={44}
                className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-[#002B49] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-900 transition-all">
                <Search className="h-4 w-4" /> Buscar
              </button>
            </div>
          </div>
        )}

        {/* Aba 3: Certidões */}
        {activeTab === "certidoes" && (
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" /> Emissão de Certidões de Regularidade
            </h2>
            <p className="text-sm text-slate-500">
              Consulte e descarregue certidões fiscais e laborais inserindo o CNPJ da empresa.
            </p>
            <div className="flex gap-2 max-w-md mb-6">
              <input
                type="text"
                placeholder="00.000.000/0001-00"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-[#002B49] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-all">
                Consultar CNPJ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Certidão Conjunta PGFN / Receita Federal", "CRF - FGTS (Caixa Econômica)", "CNDT - Certidão de Débitos Trabalhistas", "Consulta CADIN - Setor Público"].map((cert, idx) => (
                <div key={idx} className="p-4 border rounded-xl flex justify-between items-center bg-slate-50">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-800">{cert}</h3>
                    <p className="text-xs text-slate-500">Emissão automática por CNPJ</p>
                  </div>
                  <button className="border border-slate-300 p-2 rounded-lg hover:bg-white transition-all text-slate-600">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
