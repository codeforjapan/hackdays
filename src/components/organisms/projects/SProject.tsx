import { useEffect, useState } from 'react';
import { Heading, Stack } from '@chakra-ui/react';
import { EditableProperty, onUpdatePropFunction } from '../../molecules/forms/EditableProperty';
import MMembers from './Members';
import MJoinProject from './JoinProject';
import useProject, { EditableProp, EditablePropStr } from '../../../hooks/useProject';
import { supabase } from '../../../utils/supabaseClient';

export default function SProject({ projectid }: { projectid: string }) {
  const [editable, setEditable] = useState(false);
  const { projectState, getProject, editProject, getLabel } = useProject();
  useEffect(() => {
    getProject(projectid);
  }, []);
  useEffect(() => {
    if (projectState.project) {
      const user = supabase.auth.user();
      setEditable(projectState.project.owner_user_id === user?.id);
    }
  }, [projectState.project]);

  const updateProject: onUpdatePropFunction = async (property: string, nextValue: string) => {
    if (projectState.project) {
      const k: EditableProp = property as EditableProp;
      const newproject = { ...projectState.project };
      newproject[k] = nextValue;
      editProject(newproject);
    }
  };
  const isJoined = () => {
    let joined = false;
    const user = supabase.auth.user();
    if (user && projectState.project?.profiles) {
      joined = projectState.project.profiles.map((m) => m.id).includes(user.id);
    }
    return joined;
  };
  const members = () => {
    return projectState.project?.profiles;
  };

  return (
    <Stack spacing={4}>
      <Heading as='h1'>{projectState.project ? projectState.project.name : ''}</Heading>
      {EditablePropStr.filter((v) => v != 'name').map((v: string, index) => {
        const val = v as EditableProp;
        const defaultval = projectState.project ? (projectState.project[val] ? projectState.project[val] : '') : '';
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
