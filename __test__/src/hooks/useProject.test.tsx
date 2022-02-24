import { renderHook, act } from '@testing-library/react-hooks';
import useProject from '../../../src/hooks/useProject';
import { v4 as uuidv4 } from 'uuid';
import { ProjectService } from '../../../src/services/projects.service';
import { waitFor } from '@testing-library/react';

describe('useProject', () => {
  it('should get project', async () => {
    const { result } = renderHook(() => useProject());
    const projectid = uuidv4();
    ProjectService.getProject = jest.fn().mockResolvedValue({ id: projectid });
    await act(async () => {
      result.current.getProject(projectid);
    });
    await waitFor(() => {
      expect(result.current.projectState.project.id).toEqual(projectid);
    });
  });
});
