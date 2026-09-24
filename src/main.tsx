import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function RetentionCalculatorUI() {
  const [valor, setValor] = useState<number>(1000)
  const [simples, setSimples] = useState<boolean>(false)

  const pis = simples ? 0 : valor * 0.0065
  const cofins = simples ? 0 : valor * 0.03
  const csll = simples ? 0 : valor * 0.01
  const irrf = simples ? 0 : valor * 0.015
  const iss = simples ? 0 : valor * 0.05
  const total = pis + cofins + csll + irrf + iss
  const liquido = valor - total

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Calculadora de Retenção de Tributos</h2>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Valor Bruto do Serviço (R$):</label>
        <input 
          type="number" 
          value={valor} 
          onChange={(e) => setValor(Number(e.target.value))}
          style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
        />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px' }}>
        <input type="checkbox" checked={simples} onChange={(e) => setSimples(e.target.checked)} />
        <span style={{ fontSize: '14px' }}>Optante pelo Simples Nacional</span>
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', paddingT: '12px', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}><small>PIS (0,65%)</small><br/><strong>R$ {pis.toFixed(2)}</strong></div>
        <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}><small>COFINS (3,00%)</small><br/><strong>R$ {cofins.toFixed(2)}</strong></div>
        <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}><small>CSLL (1,00%)</small><br/><strong>R$ {csll.toFixed(2)}</strong></div>
        <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}><small>IRRF (1,50%)</small><br/><strong>R$ {irrf.toFixed(2)}</strong></div>
        <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}><small>ISS (5,00%)</small><br/><strong>R$ {iss.toFixed(2)}</strong></div>
        <div style={{ background: '#fef2f2', color: '#991b1b', padding: '8px', borderRadius: '6px' }}><small>Total Retido</small><br/><strong>R$ {total.toFixed(2)}</strong></div>
      </div>
      <div style={{ marginTop: '16px', background: '#eff6ff', padding: '12px', borderRadius: '6px', color: '#1e40af', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
        <span>Valor Líquido:</span>
        <span>R$ {liquido.toFixed(2)}</span>
      </div>
    </div>
  )
}

function MainApp() {
  const [tab, setTab] = useState<'calc' | 'danfe' | 'cnd'>('calc')

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f1f5f9' }}>
      <header style={{ background: '#0f2a4a', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '18px' }}>UFCAT | SGOFUFCAT - Sistema Unificado</h1>
        <span style={{ background: '#059669', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>Online</span>
      </header>
      <nav style={{ background: '#163a63', padding: '0 24px', display: 'flex', gap: '8px' }}>
        <button onClick={() => setTab('calc')} style={{ padding: '12px 16px', background: tab === 'calc' ? '#fff' : 'transparent', color: tab === 'calc' ? '#0f2a4a' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>1. Calculadora de Retenção</button>
        <button onClick={() => setTab('danfe')} style={{ padding: '12px 16px', background: tab === 'danfe' ? '#fff' : 'transparent', color: tab === 'danfe' ? '#0f2a4a' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>2. Emissão DANFE / NFe</button>
        <button onClick={() => setTab('cnd')} style={{ padding: '12px 16px', background: tab === 'cnd' ? '#fff' : 'transparent', color: tab === 'cnd' ? '#0f2a4a' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>3. Certidão CND</button>
      </nav>
      <main style={{ padding: '24px' }}>
        {tab === 'calc' && <RetentionCalculatorUI />}
        {tab === 'danfe' && <div style={{ background: '#fff', padding: '32px', textAlign: 'center', borderRadius: '8px' }}><h3>Importador de XML DANFE</h3><p>Módulo de Leitura e Validação NFe ativado.</p></div>}
        {tab === 'cnd' && <div style={{ background: '#fff', padding: '32px', textAlign: 'center', borderRadius: '8px' }}><h3>Consulta de Certidões Negativas (CND)</h3><p>Módulo de Regularidade Fiscal ativado.</p></div>}
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
)
