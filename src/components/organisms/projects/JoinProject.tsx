import { FC, useEffect, useRef, useState } from 'react';
import { ProjectService } from '../../../services/projects.service';
import { supabase } from '../../../utils/supabaseClient';
import { PrimaryButton } from '../../atoms/button/PrimaryButton';
import { useT } from '@transifex/react';

type Props = {
  joined?: boolean;
  project_id: string;
};

const MJoinProject: FC<Props> = ({ joined = false, project_id }) => {
  const [isJoined, setIsJoined] = useState(joined);
  const [loading, setLoading] = useState(false);
  const requesting = useRef(false);
  const t = useT();

  useEffect(() => {
    setIsJoined(joined);
  }, [joined]);

  const handleClick = async () => {
    const user = supabase.auth.user();
    if (!user) {
      alert(t('you need to login first'));
      return;
    }
    if (isJoined === null || requesting.current) return;
    requesting.current = true;
    setLoading(true);
    try {
      if (isJoined) {
        await ProjectService.leaveProject({ profile_id: user.id, project_id: project_id });
        setIsJoined(false);
      } else {
        await ProjectService.joinProject({ profile_id: user.id, project_id: project_id });
        setIsJoined(true);
      }
    } catch (error: unknown) {
      console.log((error as Error).message);
    } finally {
      requesting.current = false;
      setLoading(false);
    }
  };

  return (
    <PrimaryButton onClick={() => handleClick()} loading={loading}>
      {isJoined ? t('Leave this project') : t('Join this project')}
    </PrimaryButton>
  );
};

export default MJoinProject;
