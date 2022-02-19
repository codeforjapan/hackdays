import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Box, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { PrimaryButton } from './atoms/button/PrimaryButton';
import { useRouter } from 'next/router';
import { ProjectService } from '../services/projects.service';

export default function ProjectForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [projectname, setProjectName] = useState<string | null>(null);
  const router = useRouter();
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
      const data = await ProjectService.createProject(newdata);
      if (!data) {
        throw new Error("can't create data");
      }
      router.replace(`/projects/${data[0].id}`);
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
