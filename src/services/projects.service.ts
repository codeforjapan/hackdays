import { PostgrestResponse } from "@supabase/supabase-js";
import { definitions } from '../../types/supabase';
import { supabase } from "../utils/supabaseClient";

export const ProjectService = {
  getProjects,
  getProject,
  createProject
}
async function getProjects(limit = 30) {
  try {
    const { data, error }: PostgrestResponse<definitions['projects']> = await supabase
      .from('projects')
      .select()
      .order('id', { ascending: false })
      .limit(limit)

    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("can't retlieve data");
    }
    return data
  } catch (error: unknown) {
    throw error
  }
}

async function getProject(projectid: string) {
  console.log(projectid);
  try {
    const { data, error }: PostgrestResponse<definitions['projects']> = await supabase
      .from('projects')
      .select()
      .eq('id', projectid);
    console.log(data)
    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("can't create data");
    }
    return data[0]
  } catch (error: unknown) {
    throw error
  }
}
async function createProject(newdata: {
  owner_user_id: string;
  name: string;
  purpose?: string;
  what_to_do?: string;
  problems?: string;
  targets?: string;
  needed_help?: string;
  project_url?: string;
  how_to_join?: string;
}) {
  const { data, error }: PostgrestResponse<definitions['projects']> = await supabase
    .from('projects')
    .insert([newdata]);
  if (error) {
    throw error;
  }
  return data
}
