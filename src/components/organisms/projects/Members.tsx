import { Box, Heading } from '@chakra-ui/react';
import { FC } from 'react';
import { definitions } from '../../../types/supabase';

type Props = {
  members: definitions['profiles'][] | undefined;
};

const MMembers: FC<Props> = ({ members }) => {
  return (
    <Box>
      <Heading as='h2'>OurMembers</Heading>
      {members
        ? members.map((member, index) => {
            return <div key={index}>{member.username}</div>;
          })
        : ''}
    </Box>
  );
};

export default MMembers;
