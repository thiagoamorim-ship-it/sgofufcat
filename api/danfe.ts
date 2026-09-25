import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método não permitido.',
    });
  }

  try {
    const chave = String(req.body?.chave ?? '').replace(/\D/g, '');

    if (chave.length !== 44) {
      return res.status(400).json({
        error: 'A chave de acesso deve possuir 44 dígitos.',
      });
    }

    const response = await fetch(
      'https://consultadanfe.com/api/v1/consulta',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chave,
          format: 'json',
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.message ||
          data?.error ||
          'Não foi possível consultar o DANFE.',
      });
    }

    if (!data?.pdf_base64) {
      return res.status(502).json({
        error: 'A API não retornou o DANFE em PDF.',
      });
    }

    return res.status(200).json({
      status: 'ok',
      chave,
      pdf_base64: data.pdf_base64,
    });
  } catch (error) {
    console.error('Erro ao consultar DANFE:', error);

    return res.status(500).json({
      error: 'Erro interno ao gerar o DANFE.',
    });
  }
}
