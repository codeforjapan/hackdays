import { PostgrestResponse } from '@supabase/supabase-js';
import { useEffect, useState, useCallback } from 'react';
import { definitions } from '../types/supabase';
import { supabase } from '../utils/supabaseClient';
import { ProjectService } from '../services/projects.service';
import { Box, Editable, Heading, ListItem, Stack, UnorderedList } from '@chakra-ui/react';
import { EditableProperty, onUpdatePropFunction } from './atoms/EditableProperty';
import { useT } from '@transifex/react';

export default function SProject({ projectid }: { projectid: string }) {
  const [project, setSProject] = useState<definitions['projects'] | null>();
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    getProject(projectid);
  }, []);
  const EditablePropStr = [
    'name',
    'purpose',
    'what_to_do',
    'problems',
    'targets',
    'needed_help',
    'project_url',
    'how_to_join',
  ] as const;

  type EditableProp = typeof EditablePropStr[number];
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

  const getLabel = (key: EditableProp) => {
    const labels: { [name: string]: string } = {
      purpose: t('Purpose'),
      what_to_do: t('What to do'),
      problems: 'Problems',
      targets: 'Targets',
      needed_help: 'Needed help',
      project_url: 'Project URL',
      how_to_join: 'How to join',
    };
    return labels[String(key)];
  };
  const t = useT();
  return (
    <Stack spacing={4}>
      <Heading as='h1'>{project ? project.name : ''}</Heading>
      {EditablePropStr.filter((v) => v != 'name').map((v: string) => {
        const val = v as EditableProp;
        const defaultval = project ? (project[val] ? project[val] : '') : '';
        return (
          <EditableProperty
            label={getLabel(val)}
            defaultValue={defaultval}
            property={val}
            onUpdateProp={editProject}
            editable={editable}
          />
        );
      })}
    </Stack>
  );
}
