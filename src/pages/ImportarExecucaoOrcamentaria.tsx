                </p>
              </div>
            </div>
          </section>

          {/* Prévia */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-slate-900">
                  Pré-visualização
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Primeiros 5 registros •{' '}
                  {colunas.length}{' '}
                  coluna(s) identificada(s)
                </p>
              </div>

              <button
                type="button"
                onClick={limpar}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <X size={16} />
                Remover arquivo
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-max divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {colunas.map(
                      (coluna) => (
                        <th
                          key={coluna}
                          className="max-w-[260px] whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-slate-500"
                        >
                          {coluna}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {previa.map(
                    (linha, indice) => (
                      <tr key={indice}>
                        {colunas.map(
                          (coluna) => (
                            <td
                              key={coluna}
                              className="max-w-[260px] truncate whitespace-nowrap px-4 py-3 text-xs text-slate-600"
                              title={texto(
                                linha[coluna],
                              )}
                            >
                              {texto(
                                linha[coluna],
                              ) || '—'}
                            </td>
                          ),
                        )}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Confirmação */}
          <div className="flex flex-col items-end gap-2">
            {tipo !== 'rap' && tipo !== 'empenhos' && (
              <p className="text-xs text-amber-600">
                A gravação no banco está habilitada para RAP e Empenhos.
              </p>
            )}

            <button
              type="button"
              onClick={() => void confirmarImportacao()}
              disabled={
                importando ||
                (tipo !== 'rap' && tipo !== 'empenhos') ||
                !linhas.length
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#002B49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#003d66] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {importando && (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              )}

              {importando
                ? 'Importando...'
                : 'Confirmar importação'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
