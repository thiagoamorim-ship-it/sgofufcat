          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Utilize os arquivos Excel extraídos do
            Tesouro Gerencial para Empenhos, RAP ou
            Crédito Orçamentário.
          </p>

          <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#002B49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#003d66]">
            {carregando ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <FileSpreadsheet
                size={18}
              />
            )}

            {carregando
              ? 'Analisando...'
              : 'Selecionar arquivo'}

            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              disabled={carregando}
              onChange={(event) => {
                const selecionado =
                  event.target.files?.[0];

                if (selecionado) {
                  void processarArquivo(
                    selecionado,
                  );
                }

                event.currentTarget.value =
                  '';
              }}
            />
          </label>
        </section>
      ) : (
        <>
          {/* Resumo */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Arquivo
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                {arquivo.name}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Aba analisada
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {planilha || '—'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Registros encontrados
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {linhas.length.toLocaleString(
                  'pt-BR',
                )}
              </p>
            </div>
          </section>

          {/* Resultado */}
          <section
            className={`rounded-2xl border p-5 ${
              tipo === 'desconhecido'
                ? 'border-amber-200 bg-amber-50'
                : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            <div className="flex items-start gap-3">
              {tipo === 'desconhecido' ? (
                <AlertCircle
                  size={22}
                  className="mt-0.5 shrink-0 text-amber-600"
                />
              ) : (
                <CheckCircle2
                  size={22}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
              )}

              <div>
                <p
                  className={`font-bold ${
                    tipo ===
                    'desconhecido'
                      ? 'text-amber-900'
                      : 'text-emerald-900'
                  }`}
                >
                  {tipo ===
                  'desconhecido'
                    ? 'Estrutura ainda não reconhecida'
                    : 'Planilha reconhecida'}
                </p>

                <p
                  className={`mt-1 text-sm ${
                    tipo ===
                    'desconhecido'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  Tipo detectado:{' '}
                  <strong>
                    {nomeTipo(tipo)}
                  </strong>

                  {tipo === 'rap' && (
                    <span className="ml-2 inline-flex rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      Parser RAP v2
                    </span>
                  )}
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
