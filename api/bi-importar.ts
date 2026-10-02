      .single();

    if (cargaError || !carga?.id) {
      console.error(
        'Erro ao criar carga:',
        cargaError,
      );

      return responder(res, 500, {
        error:
          'Não foi possível iniciar a importação.',
      });
    }

    const cargaId = carga.id;

    try {
      const tamanhoLote = 500;

      for (
        let inicio = 0;
        inicio < registros.length;
        inicio += tamanhoLote
      ) {
        const lote = registros
          .slice(
            inicio,
            inicio + tamanhoLote,
          )
          .map((registro) => ({
            ...registro,
            carga_id: cargaId,
          }));

        const { error: insertError } =
          await supabase
            .from(tabelaDestino)
            .insert(lote);

        if (insertError) {
          throw insertError;
        }
      }

      const {
        error: finalizarError,
      } = await supabase
        .from('bi_cargas')
        .update({
          status: 'concluido',
          quantidade_registros:
            registros.length,
          mensagem_erro: null,
        })
        .eq('id', cargaId);

      if (finalizarError) {
        throw finalizarError;
      }

      return responder(res, 200, {
        success: true,
        cargaId,
        tipo,
        quantidade:
          registros.length,
        message:
          tipo === 'rap'
            ? 'Importação de RAP concluída com sucesso.'
            : 'Importação de Empenhos concluída com sucesso.',
      });
    } catch (importError: any) {
      console.error(
        'Erro durante a importação:',
        importError,
      );

      await supabase
        .from(tabelaDestino)
        .delete()
        .eq('carga_id', cargaId);

      await supabase
        .from('bi_cargas')
        .update({
          status: 'erro',
          quantidade_registros: 0,
          mensagem_erro:
            importError?.message ||
            'Erro durante a importação.',
        })
        .eq('id', cargaId);

      return responder(res, 500, {
        error:
          'A importação não foi concluída. Nenhum registro parcial foi mantido.',
      });
    }
  } catch (error: any) {
    if (
      error?.message ===
      'NAO_AUTENTICADO'
    ) {
      return responder(res, 401, {
        error:
          'Sua sessão expirou. Entre novamente no SGOF.',
      });
    }

    if (
      error?.message ===
      'ACESSO_NEGADO'
    ) {
      return responder(res, 403, {
        error:
          'Seu usuário não possui permissão para importar dados.',
      });
    }

    console.error(
      'Erro inesperado em bi-importar:',
      error,
    );

    return responder(res, 500, {
      error:
        'O servidor não conseguiu processar a importação.',
    });
