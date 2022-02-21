import { supabase } from '../../utils/supabaseClient';
import { Flex } from '@chakra-ui/react';
import ProjectForm from '../../components/organisms/projects/ProjectForm';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export default function CreateProject() {
  const router = useRouter();

  useEffect(() => {
    // if user is not logged in, redirect to the index
    if (!supabase.auth.user()) {
      router.replace('/');
    }
  }, []);
  return (
    <Flex align='center' justify='center' height='100vh'>
      <ProjectForm />
    </Flex>
  );
}
