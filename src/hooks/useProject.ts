import { useState } from 'react';
import { ProjectService } from '../services/projects.service';
import { definitions } from '../types/supabase';
import { useT } from '@transifex/react';
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
  const [project, setProject] = useState<ProjectType>();
  const [loading, setLoading] = useState<boolean>(false);
  const projectState = { project, loading };

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
  async function insertProject({ projectname }: { projectname: string }) {
    try {
      if (projectname === '') {
        throw new Error('please set project name');
      }
      setLoading(true);
      const user = supabase.auth.user();
      if (!user?.id) {
        throw new Error('not logged in');
      }
      const newdata: {
        owner_user_id: string;
        name: string;
      } = {
        owner_user_id: user?.id,
        name: projectname,
      };
      // create new project
      const data = await ProjectService.insertProject(newdata);
      if (!data) {
        throw new Error("can't create data");
      }
      setProject(data[0]);
    } finally {
      setLoading(false);
    }
  }
  const updateProject = async (newproject: ProjectType) => {
    const data = await ProjectService.updateProject(newproject).catch((e: unknown) => {
      throw e;
    });
    // set new data
    setProject(data);
  };

  return {
    projectState,
    getProject,
    updateProject,
    insertProject,
    getLabel,
  };
}
