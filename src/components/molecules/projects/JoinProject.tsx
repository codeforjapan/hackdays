import { FC, useEffect, useRef, useState } from 'react';
import { ProjectService } from '../../../services/projects.service';
import { supabase } from '../../../utils/supabaseClient';
import { PrimaryButton } from '../../atoms/button/PrimaryButton';

type Props = {
  joined?: boolean;
  project_id: string;
};

const MJoinProject: FC<Props> = ({ joined = false, project_id }) => {
  const [isJoined, setIsJoined] = useState(joined);
  const requesting = useRef(false);

  useEffect(() => {
    setIsJoined(joined);
  }, [joined]);

  const handleClick = async () => {
    const user = supabase.auth.user();
    if (!user) {
      alert('ログインしてね。');
      return;
    }
    if (isJoined === null || requesting.current) return;
    requesting.current = true;
    try {
      if (isJoined) {
        await ProjectService.leaveProject({ profile_id: user.id, project_id: project_id });
        setIsJoined(false);
      } else {
        await ProjectService.joinProject({ profile_id: user.id, project_id: project_id });
        setIsJoined(true);
      }
      requesting.current = false;
    } catch (error) {
      console.log(error);
      requesting.current = false;
    }
  };

  return (
    <PrimaryButton onClick={() => handleClick()}>
      {isJoined ? 'プロジェクトを抜ける' : 'プロジェクトに参加する'}
    </PrimaryButton>
  );
};

export default MJoinProject;
