                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                            {moeda(
                              emLiquidacao,
                            )}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                            {moeda(
                              liquidadoPagar,
                            )}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                            {moeda(pago)}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-slate-900">
                            {moeda(total)}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>

          {empenhosFiltrados.length >
            100 && (
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500">
              Exibindo os primeiros 100
              registros de{" "}
              {empenhosFiltrados.length}.
              Posteriormente adicionaremos
              paginação e detalhamento
              individual.
            </div>
          )}
        </section>

        {composicao && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={() => setComposicao(null)}>
            <div className="flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Memória de cálculo</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{composicao.titulo}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>{linhasComposicao.length} registro(s)</span>
                    <span className="font-bold text-slate-900">Total: {moeda(composicao.total)}</span>
                  </div>
                </div>
                <button type="button" onClick={() => setComposicao(null)} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label="Fechar">
                  <X size={21} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 px-6 py-3">
                <button type="button" onClick={exportarComposicaoCSV} disabled={!linhasComposicao.length} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  <Download size={16} /> Exportar CSV
                </button>
                <button type="button" onClick={exportarComposicaoExcel} disabled={!linhasComposicao.length} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                  <FileSpreadsheet size={16} /> Exportar Excel
                </button>
                <span className="self-center text-xs text-slate-500">A soma da coluna Valor corresponde ao indicador selecionado.</span>
              </div>

              <div className="overflow-auto">
                {linhasComposicao.length ? (
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="sticky top-0 bg-slate-100">
                      <tr>
                        {Object.keys(linhasComposicao[0]).map((coluna) => (
                          <th key={coluna} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{coluna.replace(/_/g, " ")}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {linhasComposicao.map((linha, indice) => (
                        <tr key={indice} className="hover:bg-slate-50">
                          {Object.keys(linhasComposicao[0]).map((coluna) => (
                            <td
                              key={coluna}
                              className={`px-4 py-3 align-top text-slate-700 ${
                                coluna === "Valor"
                                  ? "whitespace-nowrap text-right font-semibold text-slate-900"
                                  : coluna === "Favorecido" || coluna === "Descricao"
                                    ? "min-w-[220px] max-w-[360px] whitespace-normal break-words leading-5"
                                    : "max-w-[240px] whitespace-nowrap"
                              }`}
                            >
                              {coluna === "Valor"
                                ? moeda(Number(linha[coluna]) || 0)
                                : String(linha[coluna] ?? "") || "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-sm text-slate-500">Não há registros para compor este indicador com os filtros atuais.</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
