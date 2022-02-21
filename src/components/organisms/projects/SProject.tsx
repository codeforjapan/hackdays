import { useEffect, useState } from 'react';
import { Heading, Stack } from '@chakra-ui/react';
import { EditableProperty, onUpdatePropFunction } from '../../molecules/forms/EditableProperty';
import MMembers from './Members';
import MJoinProject from './JoinProject';
import useProject, { EditableProp, EditablePropStr } from '../../../hooks/useProject';
import { supabase } from '../../../utils/supabaseClient';

export default function SProject({ projectid }: { projectid: string }) {
  const [editable, setEditable] = useState(false);
  const { project, getProject, editProject, getLabel } = useProject();
  useEffect(() => {
    getProject(projectid);
  }, []);
  useEffect(() => {
    if (project) {
      const user = supabase.auth.user();
      setEditable(project.owner_user_id === user?.id);
    }
  }, [project]);

  const updateProject: onUpdatePropFunction = async (property: string, nextValue: string) => {
    if (project) {
      const k: EditableProp = property as EditableProp;
      const newproject = { ...project };
      newproject[k] = nextValue;
      editProject(newproject);
    }
  };
  const isJoined = () => {
    let joined = false;
    const user = supabase.auth.user();
    if (user && project?.profiles) {
      joined = project.profiles.map((m) => m.id).includes(user.id);
    }
    return joined;
  };
  const members = () => {
    return project?.profiles;
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
            onUpdateProp={updateProject}
            editable={editable}
            key={index}
          />
        );
      })}

      <MMembers members={members()}></MMembers>
      <MJoinProject joined={isJoined()} project_id={projectid}></MJoinProject>
    </Stack>
  );
}
