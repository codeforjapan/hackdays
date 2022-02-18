import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import SProject from '../../components/SProject';
export default function Project() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Flex align='center' justify='center' height='100vh'>
      <Box bg='white' margin={4} p={4}>
        {id ? <SProject projectid={String(id)} /> : ''}
      </Box>
    </Flex>
  );
}
