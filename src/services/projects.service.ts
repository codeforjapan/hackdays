import { PostgrestResponse } from '@supabase/supabase-js';
import { definitions } from '../../types/supabase';
import { supabase } from '../utils/supabaseClient';

export const ProjectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  joinProject,
  leaveProject,
};
async function getProjects(limit = 30) {
  try {
    const { data, error }: PostgrestResponse<definitions['projects']> = await supabase
      .from('projects')
      .select()
      .order('id', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("can't retlieve data");
    }
    return data;
  } catch (error: unknown) {
    throw error;
  }
}

async function getProject(projectid: string) {
  try {
    const { data, error }: PostgrestResponse<definitions['projects']> = await supabase
      .from('projects')
      .select(
        `owner_user_id, name, purpose, what_to_do, problems, targets, needed_help, project_url, how_to_join, created_at, profiles (id, username, avatar_url)`,
      )
      .eq('id', projectid);
    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("can't create data");
    }
    return data[0];
  } catch (error: unknown) {
    throw error;
  }
}
async function updateProject(project: definitions['projects']) {
  try {
    const { data, error }: PostgrestResponse<definitions['projects']> = await supabase.from('projects').upsert(project);
    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("can't update data");
    }
    return data[0];
  } catch (error: unknown) {
    throw error;
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
  const { data, error }: PostgrestResponse<definitions['projects']> = await supabase.from('projects').insert([newdata]);
  if (error) {
    throw error;
  }
  return data;
}
async function joinProject(params: { profile_id: string; project_id: string }) {
  try {
    const { data } = await supabase.from('joined_projects').insert([params]);
    return data;
  } catch (error) {
    throw error;
  }
}
async function leaveProject(params: { profile_id: string; project_id: string }) {
  try {
    const { data } = await supabase
      .from('joined_projects')
      .delete()
      .eq('profile_id', params.profile_id)
      .eq('project_id', params.project_id);
    return data;
  } catch (error) {
    throw error;
  }
}
