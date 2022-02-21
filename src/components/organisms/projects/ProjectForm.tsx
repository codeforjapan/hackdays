import { useEffect, useState } from 'react';
import { Box, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { PrimaryButton } from '../../atoms/button/PrimaryButton';
import { useRouter } from 'next/router';
import useProject from '../../../hooks/useProject';

/**
 * Project form for creating new project
 */
export default function ProjectForm() {
  const [projectname, setProjectName] = useState<string | null>(null);
  const router = useRouter();
  const { loading, project, createProject } = useProject();
  useEffect(() => {
    if (project) {
      router.replace(`/projects/${project.id}`);
    }
  }, [project]);

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
