import { joinProjectRoom, emitNewCollaborator } from '@/sockets/socket';
import axios from './axios';
import useBoardStore from '@/store/board.store';


export async function getProject(projectId) {
  try {
    const boardStore = useBoardStore();
    const project = await axios.get(`/projects/${projectId}/details`);
    const projectInfo = { id: project.data.id, name: project.data.name };
    if (project) {
      joinProjectRoom(projectInfo);
      boardStore.setProject(project.data);
    }
    return project.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getProjects() {
  try {
    const response = await axios.get('/projects/user');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createProject(projectData) {
  try {
    const project = await axios.post('/projects', projectData);
    return project.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateProject(projectData) {
  try {
    const project = await axios.patch(`/projects/${projectData.id}`, {
      name: projectData.name,
    });
    return project.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function removeProject(projectId) {
  try {
    await axios.delete(`/projects/${projectId}`);
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getLastCollaborator(projectId) {
  try {
    const response = await axios.get(`/projects/${projectId}/collaborators`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createCollaborator(collaborator) {
  try {
    const response = await axios.post(`/projects/${collaborator.project_id}/collaborators`, collaborator);
    if (response) {
      emitNewCollaborator();
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
