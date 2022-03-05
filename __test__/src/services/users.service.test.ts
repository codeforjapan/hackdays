import { UpdateUserServiceParam, UserService } from '../../../src/services/users.service';
import { supabase } from '../../../src/utils/supabaseClient';
describe('UserService test', () => {
  it('should get user', async () => {
    expect.assertions(1);
    const userdata = {
      username: 'myusername',
      website: 'https://test.com',
      avatar_url: 'https://avatar.com/',
    };
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        select: jest.fn().mockImplementation(() => {
          return {
            eq: jest.fn().mockImplementation(() => {
              return {
                single: jest.fn().mockResolvedValue({ data: userdata }),
              };
            }),
          };
        }),
      };
    });

    const ret = await UserService.getUser('myid');
    expect(ret).toEqual(userdata);
  });
  it('should throw error when failed', async () => {
    expect.assertions(1);
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        select: jest.fn().mockImplementation(() => {
          return {
            eq: jest.fn().mockImplementation(() => {
              return {
                single: jest.fn().mockResolvedValue({
                  data: [],
                  error: new Error('failed'),
                  status: 404,
                }),
              };
            }),
          };
        }),
      };
    });
    expect(async () => {
      await UserService.getUser('bad');
    }).rejects.toThrow();
  });
  it('should throw error when no data found', async () => {
    expect.assertions(1);
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        select: jest.fn().mockImplementation(() => {
          return {
            eq: jest.fn().mockImplementation(() => {
              return {
                single: jest.fn().mockResolvedValue({
                  data: null,
                }),
              };
            }),
          };
        }),
      };
    });
    expect(async () => {
      await UserService.getUser('hoge');
    }).rejects.toThrow();
  });
  it('should update user info', async () => {
    expect.assertions(1);
    const newuserdata: UpdateUserServiceParam = {
      id: 'myid',
      username: 'newusername',
      website: 'https://test.com',
      avatar_url: 'https://avatar.com/',
      updated_at: new Date(),
    };
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        upsert: jest.fn().mockResolvedValue(null),
      };
    });

    expect(UserService.updateUser(newuserdata)).resolves.toEqual(null);
  });
});
