import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Box, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { PrimaryButton } from './atoms/button/PrimaryButton';

export default function ProjectForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [projectname, setProjectName] = useState<string | null>(null);
  async function createProject({ projectname }: { projectname: string | null }) {
    try {
      console.log('send data');
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

      const { data, error } = await supabase.from('projects').insert([newdata]);
      if (error) {
        throw error;
      }
      console.log(data);
      alert('project was created');
    } catch (error: unknown) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Box shadow='md'>
      <Stack spacing={4} py={4} px={10}>
        <FormControl>
          <FormLabel htmlFor='projectname'>Project Name:</FormLabel>
          <Input
            id='projectname'
            type='text'
            value={projectname || ''}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </FormControl>
        <PrimaryButton onClick={() => createProject({ projectname })} disabled={loading}>
          {loading ? 'Loading ...' : 'Create'}
        </PrimaryButton>
      </Stack>
    </Box>
  );
}
