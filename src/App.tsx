import React, { useState } from 'react';
import { calculateRetentions } from './lib/retentionCalculator';

export default function App() {
  const [valor, setValor] = useState<number>(1000);
  const [simples, setSimples] = useState<boolean>(false);

  const res = calculateRetentions({ grossValue: valor, serviceType: 'geral', isSimplesNacional: simples });

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>SGOFUFCAT - Sistema Integrado</h1>
      <div style={{ background: '#f4f4f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Valor Bruto (R$):
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={simples}
            onChange={(e) => setSimples(e.target.checked)}
          />
          Optante pelo Simples Nacional
        </label>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
        <h3>Retenções Calculadas</h3>
        <p>PIS (0.65%): R$ {res.pis.toFixed(2)}</p>
        <p>COFINS (3.00%): R$ {res.cofins.toFixed(2)}</p>
        <p>CSLL (1.00%): R$ {res.csll.toFixed(2)}</p>
        <p>IRRF (1.50%): R$ {res.irrf.toFixed(2)}</p>
        <p>ISS (5.00%): R$ {res.iss.toFixed(2)}</p>
        <hr />
        <p><strong>Total Retido: R$ {res.totalRetained.toFixed(2)}</strong></p>
        <p><strong>Valor Líquido: R$ {res.netValue.toFixed(2)}</strong></p>
      </div>
    </div>
  );
}
