import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function Project() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Flex align='center' justify='center' height='100vh'>
      {id}
    </Flex>
  );
}
