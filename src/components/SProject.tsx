import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { ProjectService } from '../services/projects.service';
import { Heading, Stack } from '@chakra-ui/react';
import { EditableProperty, onUpdatePropFunction } from './molecules/forms/EditableProperty';
import { t } from '../utils/commonTools';
import MMembers from './organisms/projects/Members';
import MJoinProject from './organisms/projects/JoinProject';
import { definitions } from '../types/supabase';
import { debug } from '../utils/commonTools';
export default function SProject({ projectid }: { projectid: string }) {
  const [project, setSProject] = useState<definitions['projects'] | null>();
  const [members, setProjectMembers] = useState<definitions['profiles'][]>([]);
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    getProject(projectid);
  }, []);
  const EditablePropStr = [
    'name',
    'purpose',
    'what_to_do',
    'problems',
    'targets',
    'needed_help',
    'project_url',
    'how_to_join',
  ] as const;

  type EditableProp = typeof EditablePropStr[number];
  const editProject: onUpdatePropFunction = async (property: string, nextValue: string) => {
    if (project) {
      const k: EditableProp = property as EditableProp;
      project[k] = nextValue;
      await ProjectService.updateProject(project)
        .then((data) => {
          debug(data);
          if (!data) {
            throw new Error("can't get data");
          }
          setSProject(data);
        })
        .catch((error: unknown) => {
          throw error;
        });
    }
  };
  async function getProject(projectid: string) {
    try {
      const user = supabase.auth.user();
      const data = await ProjectService.getProject(projectid);
      if (!data) {
        throw new Error("can't get data");
      }
      setEditable(user?.id == data.owner_user_id);
      setSProject(data);
      setProjectMembers(data.profiles || []);
    } catch (error: unknown) {
      alert((error as Error).message);
    }
  }

  const getLabel = (key: EditableProp) => {
    const labels: { [name: string]: string } = {
      purpose: t('Purpose'),
      what_to_do: t('What to do'),
      problems: t('Problems'),
      targets: t('Targets'),
      needed_help: t('Needed help'),
      project_url: t('Project URL'),
      how_to_join: t('How to join'),
    };
    return labels[String(key)];
  };

  const isJoined = () => {
    let joined = false;
    const user = supabase.auth.user();
    if (user) {
      joined = members.map((m) => m.id).includes(user.id);
    }
    return joined;
  };

  return (
    <Stack spacing={4}>
      <Heading as='h1'>{project ? project.name : ''}</Heading>
      {EditablePropStr.filter((v) => v != 'name').map((v: string, index) => {
        const val = v as EditableProp;
        const defaultval = project ? (project[val] ? project[val] : '') : '';
        return (
          <EditableProperty
            label={getLabel(val)}
            defaultValue={defaultval}
            property={val}
            onUpdateProp={editProject}
            editable={editable}
            key={index}
          />
        );
      })}

      <MMembers members={members}></MMembers>
      <MJoinProject joined={isJoined()} project_id={projectid}></MJoinProject>
    </Stack>
  );
}
