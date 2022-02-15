import { PostgrestResponse } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { definitions } from '../../types/supabase';
import { supabase } from '../utils/supabaseClient';
import { Box, ListItem, UnorderedList } from '@chakra-ui/react';

export default function SProject({ projectid }: { projectid: string }) {
  const [project, setSProject] = useState<definitions['projects'] | null>();

  useEffect(() => {
    getProject(projectid);
  }, []);
  async function getProject(projectid: string) {
    console.log(projectid);
    try {
      const { data, error }: PostgrestResponse<definitions['projects']> = await supabase
        .from('projects')
        .select()
        .eq('id', projectid);
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("can't create data");
      }
      setSProject(data[0]);
    } catch (error: unknown) {
      alert((error as Error).message);
    }
  }
  return (
    <Box shadow='md'>
      <UnorderedList>
        <ListItem>name: {project ? project.name : ''}</ListItem>
        <ListItem>purpose: {project?.purpose}</ListItem>
      </UnorderedList>
    </Box>
  );
}
