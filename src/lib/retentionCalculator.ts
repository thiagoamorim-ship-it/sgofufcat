export interface TaxRetentionInput {
  grossValue: number;
  serviceType: string;
  isSimplesNacional: boolean;
  municipalityIssRate?: number;
}

export interface TaxRetentionResult {
  pis: number;
  cofins: number;
  csll: number;
  irrf: number;
  iss: number;
  totalRetained: number;
  netValue: number;
}

export function calculateRetentions(input: TaxRetentionInput): TaxRetentionResult {
  const { grossValue, isSimplesNacional, municipalityIssRate = 0.05 } = input;

  if (isSimplesNacional) {
    return {
      pis: 0, cofins: 0, csll: 0, irrf: 0, iss: 0, totalRetained: 0, netValue: grossValue,
    };
  }

  const pis = grossValue * 0.0065;
  const cofins = grossValue * 0.03;
  const csll = grossValue * 0.01;
  const irrf = grossValue * 0.015;
  const iss = grossValue * municipalityIssRate;

  const totalRetained = pis + cofins + csll + irrf + iss;
  const netValue = grossValue - totalRetained;

  return { pis, cofins, csll, irrf, iss, totalRetained, netValue };
}
