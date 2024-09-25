import axios from './axios';

export async function createList(listData) {
  try {
    const list = await axios.post('/lists', {
      name: listData.name,
      position: listData.position,
      code_color: listData.code_color,
      project_id: listData.project_id,
    });
    return list.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteList(listId) {
  try {
    const list = await axios.delete(`/lists/${listId}`);
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateList(listData) {
  try {
    const list = await axios.patch(`/lists/${listData.id}`, {
      name: listData.name,
      position: listData.position,
      code_color: listData.code_color,
      project_id: listData.project_id,
    });
    return list.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getListByProject(projectId) {
  try {
    const lists = await axios.get(`/lists/projects/${projectId}`);
    return lists.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
