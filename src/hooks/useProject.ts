import { useState } from 'react';
import { ProjectService } from '../services/projects.service';
import { definitions } from '../types/supabase';
import { useT } from '@transifex/react';
import { debuglog } from '../utils/commonTools';
import { supabase } from '../utils/supabaseClient';
export const EditablePropStr = [
  'name',
  'purpose',
  'what_to_do',
  'problems',
  'targets',
  'needed_help',
  'project_url',
  'how_to_join',
] as const;

export type EditableProp = typeof EditablePropStr[number];
export type ProjectType = definitions['projects'];
export type ProjectState = {
  loading: boolean;
  project: ProjectType | null;
};
export default function useProject() {
  const t = useT();
  const [projectState, setProjectState] = useState<ProjectState>({ project: null, loading: false });
  function setProject(project: ProjectType) {
    projectState.project = project;
    setProjectState(projectState);
  }
  function setLoading(loading: boolean) {
    projectState.loading = loading;
    setProjectState(projectState);
  }

  const getLabel = (key: EditableProp) => {
    const labels: { [name: string]: string } = {
      purpose: t('Purpose'),
      what_to_do: t('What to do'),
      problems: t('Problems'),
      targets: t('Targets'),
      needed_help: t('Needed help'),
      project_url: t('Project URL'),
      how_to_join: t('How to join'),
    };
    return labels[String(key)];
  };
  async function getProject(projectid: string) {
    const data = await ProjectService.getProject(projectid);
    if (!data) {
      throw new Error("can't get data");
    }
    setProject(data);
  }
  async function createProject({ projectname }: { projectname: string | null }) {
    try {
      if (!projectname) {
        alert('please set project name');
        return;
      }
      setLoading(true);
      const user = supabase.auth.user();
      if (!user?.id) {
        throw new Error('not logged in');
        return;
      }
      const newdata: {
        owner_user_id: string;
        name: string;
      } = {
        owner_user_id: user?.id,
        name: projectname,
      };
      // create new project
      const data = await ProjectService.createProject(newdata);
      if (!data) {
        throw new Error("can't create data");
      }
      setProject(data[0]);
    } catch (error: unknown) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }
  const editProject = async (newproject: ProjectType) => {
    const data = await ProjectService.updateProject(newproject).catch((e: unknown) => {
      throw e;
    });
    debuglog(data);
    // set new data
    setProject(data);
  };

  return {
    projectState,
    getProject,
    editProject,
    createProject,
    getLabel,
  };
}
