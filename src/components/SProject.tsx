import { PostgrestResponse } from '@supabase/supabase-js';
import { useEffect, useState, useCallback } from 'react';
import { definitions } from '../../types/supabase';
import { supabase } from '../utils/supabaseClient';
import { ProjectService } from '../services/projects.service';
import { Box, Editable, Heading, ListItem, Stack, UnorderedList } from '@chakra-ui/react';
import { EditableProperty, onUpdatePropFunction } from './atoms/EditableProperty';

export default function SProject({ projectid }: { projectid: string }) {
  const [project, setSProject] = useState<definitions['projects'] | null>();
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    getProject(projectid);
  }, []);
  type EditableProp =
    | 'name'
    | 'purpose'
    | 'what_to_do'
    | 'problems'
    | 'targets'
    | 'needed_help'
    | 'project_url'
    | 'how_to_join';
  const editProject: onUpdatePropFunction = async (property: string, nextValue: string) => {
    if (project) {
      const k: EditableProp = property as EditableProp;
      project[k] = nextValue;
      await ProjectService.updateProject(project)
        .then((data) => {
          console.log(data);
          if (!data) {
            throw new Error("can't get data");
          }
          setSProject(data);
        })
        .catch((error: unknown) => {
          throw error;
        });
    }
  };
  async function getProject(projectid: string) {
    try {
      const user = supabase.auth.user();
      const data = await ProjectService.getProject(projectid);
      if (!data) {
        throw new Error("can't get data");
      }
      setEditable(user?.id == data.owner_user_id);
      setSProject(data);
    } catch (error: unknown) {
      alert((error as Error).message);
    }
  }
  return (
    <Stack spacing={4}>
      <Heading as='h1'>{project ? project.name : ''}</Heading>
      <EditableProperty
        label='purpose'
        defaultValue={project?.purpose}
        property='purpose'
        onUpdateProp={editProject}
        editable={editable}
      />
    </Stack>
  );
}
