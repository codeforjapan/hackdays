import { ProjectService } from '../../services/projects.service';
import { supabase } from '../../utils/supabaseClient';

describe('ProjectService', () => {
  it('should get first 30 projects', async () => {
    expect.assertions(1);
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
      return {
        select: jest.fn().mockImplementation(() => {
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
  it('should update existing project', async () => {
    expect.assertions(1);
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        upsert: jest.fn().mockResolvedValue({
          data: [{ id: 'myid', name: 'newname' }],
        }),
      };
    });
    const ret = await ProjectService.updateProject({ id: 'myid', name: 'newname' });
    expect(ret).toEqual({ id: 'myid', name: 'newname' });
  });
  it('should throw error when update failed', async () => {
    expect.assertions(1);
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        upsert: jest.fn().mockResolvedValue({
          data: null,
        }),
      };
    });
    expect(async () => {
      await ProjectService.updateProject({ id: 'fail', name: 'fail' });
    }).rejects.toThrow();
  });
  /**
  owner_user_id: string;
  name: string;
  purpose?: string;
  what_to_do?: string;
  problems?: string;
  targets?: string;
  needed_help?: string;
  project_url?: string;
  how_to_join?: string;
   */
  it('should insert new project', async () => {
    expect.assertions(1);
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        insert: jest.fn().mockResolvedValue({
          data: { id: 'newid', name: 'projname' },
        }),
      };
    });
    const ret = await ProjectService.insertProject({ owner_user_id: 'myid', name: 'projname' });
    expect(ret).toEqual({ id: 'newid', name: 'projname' });
  });
  it('should allow joining to a project', async () => {
    expect.assertions(2);
    const project_id = 'proj_id';
    const profile_id = 'prof_id';
    const mock_insert = jest.fn().mockResolvedValue({
      data: [{ id: 'newid', project_id, profile_id }],
    });
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        insert: mock_insert,
      };
    });
    const ret = await ProjectService.joinProject({ project_id, profile_id });
    expect(ret).toEqual([{ id: 'newid', project_id, profile_id }]);
    expect(mock_insert).toBeCalledWith([{ project_id, profile_id }]);
  });
  it('should allow leaving from a project', async () => {
    expect.assertions(2);
    const project_id = 'proj_id';
    const profile_id = 'prof_id';
    const mock_eq = jest.fn().mockResolvedValue({
      data: [{ id: 'deleted_id', project_id, profile_id }],
    });
    supabase.from = jest.fn().mockImplementation(() => {
      return {
        delete: jest.fn().mockImplementation(() => {
          return {
            eq: jest.fn().mockImplementation(() => {
              return {
                eq: mock_eq,
              };
            }),
          };
        }),
      };
    });
    const ret = await ProjectService.leaveProject({ project_id, profile_id });
    expect(ret).toEqual([{ id: 'deleted_id', project_id, profile_id }]);
    expect(mock_eq).toBeCalledWith('project_id', project_id);
  });
});
