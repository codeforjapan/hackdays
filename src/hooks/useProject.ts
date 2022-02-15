import { PostgrestResponse } from "@supabase/supabase-js";
import { useState } from "react";
import { definitions } from "../../types/supabase";
import { supabase } from "../utils/supabaseClient";

export default function useProject() {
  const [project, setSProject] = useState<definitions['projects'] | null>();

  async function getProject(projectid: string) {
    console.log(projectid);
    try {
      const { data, error }: PostgrestResponse<definitions['projects']> = await supabase
        .from('projects')
        .select()
        .eq('id', projectid);
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("can't create data");
      }
      console.log(data);
      console.log(data[0].name);
      setSProject(data[0]);
      console.log('=============')
      console.log(project)
    } catch (error: unknown) {
      alert((error as Error).message);
    }
  }

  return {
    project,
    getProject
  };
}
