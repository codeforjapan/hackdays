import { Flex, Link, List, ListItem } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { definitions } from '../../../types/supabase';
import { ProjectService } from '../../services/projects.service';
export default function Projects() {
  const [projects, setProjects] = useState<definitions['projects'][] | null>();
  useEffect(() => {
    getData();
  });
  async function getData() {
    try {
      const data: definitions['projects'][] = await ProjectService.getProjects();
      if (!data) {
        throw new Error("can't get data");
      }
      setProjects(data);
    } catch (error: unknown) {
      alert((error as Error).message);
    }
  }
  return (
    <Flex align='center' justify='center' height='100vh'>
      <List>
        {projects?.map((value, i) => {
          return (
            <ListItem>
              <Link href={'/projects/' + value.id}>{value.name}</Link>
            </ListItem>
          );
        })}
      </List>
    </Flex>
  );
}
