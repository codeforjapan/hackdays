import { PostgrestResponse } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { definitions } from '../../types/supabase';
import { supabase } from '../utils/supabaseClient';
import { ProjectService } from '../services/projects.service';
import { Box, Editable, Heading, ListItem, Stack, UnorderedList } from '@chakra-ui/react';
import { EditableProperty } from './atoms/EditableProperty';

export default function SProject({ projectid }: { projectid: string }) {
  const [project, setSProject] = useState<definitions['projects'] | null>();
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    getProject(projectid);
  }, []);
  async function editProject(key: any, nextValue: any) {
    console.log(key, nextValue);
  }
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
    <Box shadow='md'>
      <Stack spacing={4}>
        <Heading as='h1'>{project ? project.name : ''}</Heading>
        <EditableProperty
          label='purpose'
          data={project}
          property='purpose'
          onUpdateProp={editProject}
          editable={editable}
        />
      </Stack>
    </Box>
  );
}
