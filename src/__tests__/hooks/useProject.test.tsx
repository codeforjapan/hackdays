import { renderHook, act } from '@testing-library/react-hooks';
import useProject, { ProjectType } from '../../hooks/useProject';
import { v4 as uuidv4 } from 'uuid';
import { ProjectService } from '../../services/projects.service';
import { waitFor } from '@testing-library/react';
import { supabase } from '../../utils/supabaseClient';

describe('useProject', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.fn().mockRestore();
  });
  it('should return label data', () => {
    const { result } = renderHook(() => useProject());
    expect(result.current.getLabel('purpose')).not.toBeNull();
    expect(result.current.getLabel('what_to_do')).not.toBeNull();
    expect(result.current.getLabel('problems')).not.toBeNull();
    expect(result.current.getLabel('targets')).not.toBeNull();
    expect(result.current.getLabel('needed_help')).not.toBeNull();
    expect(result.current.getLabel('project_url')).not.toBeNull();
    expect(result.current.getLabel('how_to_join')).not.toBeNull();
  });
  it('should raise error when project name is not set', async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useProject());
    await act(async () => {
      const t = async () => {
        await result.current.insertProject({ projectname: '' });
      };
      expect(t).rejects.toThrow();
    });
  });
  it('should raise error when user is not logged in', async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useProject());
    supabase.auth.user = jest.fn().mockReturnValue(null);
    await act(async () => {
      const t = async () => {
        await result.current.insertProject({ projectname: 'new project' });
      };
      expect(t).rejects.toThrow();
    });
  });
  it('should create new project with current user id', async () => {
    expect.assertions(2);
    const { result } = renderHook(() => useProject());
    const myid = uuidv4();
    supabase.auth.user = jest.fn().mockReturnValue({ id: myid });
    const newid = uuidv4();
    const projectname = 'test project';
    ProjectService.insertProject = jest.fn().mockReturnValue([
      {
        id: newid,
        owner_user_id: myid,
        name: projectname,
      },
    ]);
    await act(async () => {
      await result.current.insertProject({ projectname: projectname });
    });
    expect(ProjectService.insertProject).toBeCalledWith({ name: projectname, owner_user_id: myid });
    expect(result.current.projectState.project).toEqual({
      id: newid,
      owner_user_id: myid,
      name: projectname,
    });
  });
  it('should raise error when updating failed', async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useProject());
    const myid = uuidv4();
    supabase.auth.user = jest.fn().mockReturnValue({ id: myid });
    ProjectService.insertProject = jest.fn().mockResolvedValue(null);
    await act(async () => {
      const t = async () => {
        await result.current.insertProject({ projectname: 'hoge' });
      };
      expect(t).rejects.toThrow();
    });
  });

  it('should get project', async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useProject());
    const projectid = uuidv4();
    ProjectService.getProject = jest.fn().mockResolvedValue({ id: projectid });
    await act(async () => {
      result.current.getProject(projectid);
    });
    await waitFor(() => {
      expect(result.current.projectState.project?.id).toEqual(projectid);
    });
  });
  it('should raise error when getProject railed', async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useProject());
    ProjectService.getProject = jest.fn().mockResolvedValue(null);
    await act(async () => {
      const t = async () => {
        await result.current.getProject('hoge');
      };
      expect(t).rejects.toThrow();
    });
  });
  it('should update project', async () => {
    const { result } = renderHook(() => useProject());
    const projectid = uuidv4();
    const myid = uuidv4();
    const newdata: ProjectType = {
      id: projectid,
      owner_user_id: myid,
      name: 'new project id',
      purpose: 'purpose',
    };
    ProjectService.updateProject = jest.fn().mockResolvedValue(newdata);
    await act(async () => {
      result.current.updateProject(newdata);
    });
    await waitFor(() => {
      expect(result.current.projectState.project).toEqual(newdata);
    });
  });
});
