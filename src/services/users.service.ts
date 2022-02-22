import { supabase } from '../utils/supabaseClient';
export type UpdateUserServiceParam = {
  id: string | undefined;
  username: string | null;
  website: string | null;
  avatar_url: string | null;
  updated_at: Date;
};
export const UserService = {
  getUser,
  updateUser,
};
async function getUser(id: string) {
  const { data, error, status } = await supabase
    .from('profiles')
    .select(`username, website, avatar_url`)
    .eq('id', id)
    .single();
  if (error && status !== 406) {
    throw error;
  }
  if (!data) {
    throw new Error("can't retlieve data");
  }
  return data;
}
async function updateUser(updates: UpdateUserServiceParam) {
  return supabase.from('profiles').upsert(updates, {
    returning: 'minimal', // Don't return the value after inserting
  });
}
