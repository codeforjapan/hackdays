import { ProjectService } from '../../../src/services/projects.service';
import { supabase } from '../../../src/utils/supabaseClient';

describe('ProjectService', () => {
  it('should get first 30 projects', async () => {
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        select: jest.fn().mockImplementation(() => {
          return {
            order: jest.fn().mockImplementation(() => {
              return {
                limit: jest.fn().mockResolvedValue({
                  data: [{ id: 'hoge' }, { id: 'fuga' }],
                }),
              };
            }),
          };
        }),
      };
    });

    const ret = await ProjectService.getProjects();
    expect(ret.length).toEqual(2);
  });
  it('should throw error when failed', async () => {
    expect.assertions(1);
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        select: jest.fn().mockImplementation(() => {
          return {
            order: jest.fn().mockImplementation(() => {
              return {
                limit: jest.fn().mockRejectedValue(new Error('failed')),
              };
            }),
          };
        }),
      };
    });
    expect(async () => {
      await ProjectService.getProjects();
    }).rejects.toThrow();
  });
  it('should throw error when no data found', async () => {
    expect.assertions(1);
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        select: jest.fn().mockImplementation(() => {
          return {
            order: jest.fn().mockImplementation(() => {
              return {
                limit: jest.fn().mockResolvedValue({
                  data: null,
                }),
              };
            }),
          };
        }),
      };
    });
    expect(async () => {
      await ProjectService.getProjects();
    }).rejects.toThrow();
  });
  it('should return specific project', async () => {
    expect.assertions(1);
    supabase.from = jest.fn().mockImplementation(() => {
      console.log('from');
      return {
        select: jest.fn().mockImplementation(() => {
          console.log('select');
          return {
            eq: jest.fn().mockResolvedValue({
              data: [{ id: 'myid' }],
            }),
          };
        }),
      };
    });
    const ret = await ProjectService.getProject('myid');
    expect(ret).toEqual({ id: 'myid' });
  });
  it('should throw error when no data found', async () => {
    expect.assertions(1);
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        select: jest.fn().mockImplementation(() => {
          return {
            eq: jest.fn().mockResolvedValue({
              data: null,
            }),
          };
        }),
      };
    });
    expect(async () => {
      await ProjectService.getProject('fail');
    }).rejects.toThrow();
  });
});
