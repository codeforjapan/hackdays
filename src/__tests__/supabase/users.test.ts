import { supabase, supabase_admin } from '../../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@supabase/supabase-js';

let currentUser: User | null = null;
const email = `${uuidv4()}@test.com`;
describe('create users', () => {
  it('should throw error of creating a new user as a normal user', async () => {
    expect.assertions(2);
    const { data: user, error } = await supabase.auth.api.createUser({
      email: 'user@email.com',
      password: 'password',
    });
    expect(user).toBeNull();
    expect(error).not.toBeNull();
  });
});
describe('login and create user', () => {
  beforeAll(async () => {
    const { data: user } = await supabase_admin.auth.api.createUser({
      email: email,
      password: 'password',
    });
    currentUser = user;
  });
  it('a new profile should be created after adding new user', async () => {
    expect.assertions(4);
    expect(currentUser).not.toBeNull();
    const { data, error, status } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', currentUser?.id)
      .single();
    expect(error).toBeNull();
    expect(status).not.toBe(406);
    expect(data.username).toBe(null);
  });
});
