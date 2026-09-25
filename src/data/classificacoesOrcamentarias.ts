export type ClassificacaoOrcamentaria = {
  codigo: string;
  nome: string;
  tipo: string;
  descricao: string;
  natureza: string;
  subitem: string;
  fonte: string;
};

export const classificacoesOrcamentarias: ClassificacaoOrcamentaria[] = [
  {
    codigo: "33903001",
    nome: "COMBUSTÍVEIS E LUBRIFICANTES AUTOMOTIVOS",
    tipo: "Material de consumo",
    descricao: "Registra o valor das despesas com combustíveis para motores a combustão interna de veículos rodoviários, tratores em geral, embarcações diversas e grupos geradores estacionados ou transportáveis e todos os óleos lubrificantes destinados aos sistemas hidráulicos, hidramáticos, de caixa de transmissão de força e graxas grafitadas para altas e baixas temperaturas, tais como: ADITIVOS, ÁLCOOL HIDRATADO, FLUIDO PARA AMORTECEDOR, FLUIDO PARA TRANSMISSÃO HIDRÁULICA, GASOLINA, GRAXAS, ÓLEO DIESEL, ÓLEO PARA CARTER, ÓLEO PARA FREIO HIDRÁULICO E AFINS.",
    natureza: "339030",
    subitem: "01",
    fonte: "NO SEI nº 1/2024/DAI-EBSERH",
  },
  {
    codigo: "33903002",
    nome: "COMBUSTÍVEIS E LUBRIFICANTES DE AVIAÇÃO",
    tipo: "Material de consumo",
    descricao: "Registra o valor das despesas com combustíveis e lubrificantes destinados a qualquer tipo de aeronave, tais como: ADITIVOS, GASOLINA, GRAXAS, ÓLEOS E FLUIDOS EM GERAL, QUEROSENE E AFINS.",
    natureza: "339030",
    subitem: "02",
    fonte: "NO SEI nº 1/2024/DAI-EBSERH",
  },
  {
    codigo: "33903003",
    nome: "COMBUSTÍVEIS E LUBRIFICANTES PARA OUTRAS FINALIDADES",
    tipo: "Material de consumo",
    descricao: "Registra o valor das despesas com combustíveis e lubrificantes para outras finalidades que não se classificam em itens anteriores. CARBURETO, CARVÃO MINERAL, CARVÃO VEGETAL, LENHA, QUEROSENE COMUM, COMBUSTÍVEIS E LUBRIFICANTES DE USO FERROVIÁRIO E AFINS.",
    natureza: "339030",
    subitem: "03",
    fonte: "NO SEI nº 1/2024/DAI-EBSERH",
  },
  {
    codigo: "33903004",
    nome: "GÁS ENGARRAFADO",
    tipo: "Material de consumo",
    descricao: "Registra o valor das despesas com gases de uso industrial, de tratamento de água, de iluminação, destinados a recarga de extintores de incêndio, de uso médico, bem como os gases nobres para uso em laboratório científico, tais como: ACETILENO, CARBÔNICO FREON, HÉLIO, HIDROGÊNIO, LIQUEFEITO DE PETRÓLEO, NITROGÊNIO, OXIGÊNIO E AFINS.",
    natureza: "339030",
    subitem: "04",
    fonte: "NO SEI nº 1/2024/DAI-EBSERH",
  },
  {
    codigo: "33903005",
    nome: "EXPLOSIVOS E MUNIÇÕES",
    tipo: "Material de consumo",
    descricao: "Registra o valor das despesas com as cargas de projeção utilizadas em peças de artilharia, mísseis guiados e não guiados cápsulas ou estojos para recarga e explosivos de uso militar e paramilitar; balas e similares, estopim, explosivos, tais como: ARTEFATOS EXPLOSIVOS, ARTIGOS PIROTÉCNICOS, CÁPSULAS DE DETONAÇÃO, DINAMITE, ESPOLETA, FOGOS DE ARTIFÍCIO, GRANADA, PÓLVORA E AFINS.",
    natureza: "339030",
    subitem: "05",
    fonte: "NO SEI nº 1/2024/DAI-EBSERH",
  },
  {
    codigo: "33903006",
    nome: "ALIMENTOS PARA ANIMAIS",
    tipo: "Material de consumo",
    descricao: "Registra o valor das despesas com alimentos destinados a gado bovino, muar e bufalino, caprinos, suínos, ovinos, aves de qualquer espécie, como também para animais silvestres em cativeiro (jardins zoológicos ou laboratórios) e afins, tais como: ALFAFA, ALPISTE, CAPIM VERDE, FARELO, FARINHAS EM GERAL, FUBÁ GROSSO, MILHO EM GRÃO, RAÇÃO BALANCEADA, SAL MINERAL, SUPLEMENTOS VITAMÍNICOS E AFINS.",
    natureza: "339030",
    subitem: "06",
    fonte: "NO SEI nº 1/2024/DAI-EBSERH",
  },
  {
    codigo: "33903007",
    nome: "GÊNEROS DE ALIMENTAÇÃO",
    tipo: "Material de consumo",
    descricao: "Registra o valor das despesas com gêneros de alimentação ao natural, beneficiados ou conservados, tais como: AÇÚCAR, ADOÇANTE, ÁGUA MINERAL, BEBIDAS, CAFÉ, CARNES EM GERAL, CEREAIS, CHÁS, CONDIMENTOS, FRUTAS, GELO, LEGUMES, REFRIGERANTES, SUCOS, TEMPEROS, VERDURAS E AFINS.",
    natureza: "339030",
    subitem: "07",
    fonte: "NO SEI nº 1/2024/DAI-EBSERH",
  },
  {
    codigo: "33903008",
    nome: "ANIMAIS PARA PESQUISA E ABATE",
    tipo: "Material de consumo",
    descricao: "Registra o valor das despesas com animais para pesquisa e abate. Incluem- se nesta classificação os peixes e mariscos, todas as espécies de mamíferos, abelhas para estudos, pesquisa e produção de mel, bem assim qualquer outro animal destinado a estudo genético ou alimentação, tais como: BOI, CABRITO, COBAIAS EM GERAL, MACACO, RATO, RÃ E AFINS.",
    natureza: "339030",
    subitem: "08",
    fonte: "NO SEI nº 1/2024/DAI-EBSERH",
  },
  {
    codigo: "33903009",
    nome: "MATERIAL FARMACOLÓGICO",
    tipo: "Material de consumo",
    descricao: "Registra o valor das despesas com medicamentos ou componentes destinados à manipulação de drogas medicamentosas, tais como: MEDICAMENTOS, SORO, VACINAS E AFINS.",
    natureza: "339030",
    subitem: "09",
    fonte: "NO SEI nº 1/2024/DAI-EBSERH",
  },
  {
    codigo: "33903010",
    nome: "MATERIAL ODONTOLÓGICO",
    tipo: "Material de consumo",
