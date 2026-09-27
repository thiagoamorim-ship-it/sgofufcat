import { supabase } from './supabase';

export type PerfilUsuario = 'administrador' | 'usuario';

export type UsuarioPerfil = {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  ativo: boolean;
};

export async function buscarPerfilUsuario(
  userId: string,
): Promise<UsuarioPerfil | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nome, email, perfil, ativo')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Erro ao carregar perfil do usuário:', error);
    return null;
  }

  return data as UsuarioPerfil;
}

export function usuarioEhAdministrador(
  perfil: UsuarioPerfil | null,
) {
  return perfil?.perfil === 'administrador';
}
