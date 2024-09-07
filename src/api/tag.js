import axios from './axios';

export async function createTag(tagData) {
  console.log(tagData);
  try {
    const tag = await axios.post('/tags', {
      name: tagData.name,
      code_color: tagData.code_color,
      project_id: tagData.project_id,
    });
    return tag.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteTag(tagData) {
  try {
    const deletedTag = await axios.delete(`/tags/${tagData.id}`,{project_id:tagData.project_id});
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateTag(tagData) {
  try {
    const tag = await axios.patch(`/tags/${tagData.id}`, {
      name: tagData.name,
      code_color: tagData.code_color,
      project_id: tagData.project_id,
    });
    return tag.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTagsByProject(projectId) {
  try {
    const tags = await axios.get(`/tags/projects/${projectId}`);
    return tags.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
