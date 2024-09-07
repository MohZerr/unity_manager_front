import { defineStore } from 'pinia';
import { createTag, updateTag, deleteTag, getTagsByProject } from '@/api/tag.js';


const useTagStore = defineStore('tag', {
  state: () => ({
    colors: [
      { name: 'red', code: '#ae2e25' },
      { name: 'yellow', code: '#c7ad00' },
      { name: 'orange', code: '#a54800' },
      { name: 'blue', code: '#267699' },
      { name: 'green', code: '#216e4e' },
      { name: 'brown', code: '#7f5f01' },
      { name: 'violet', code: '#5e4db2' },
      { name: 'gray', code: '#777777' },
    ],
    tag: {
      name: '',
      code_color: '',
      project_id: '',
    },
    selectedTags: [],
  }),
  actions: {
    setTagName(name) {
      this.tag.name = name;
    },
    setTagColor(color) {
      this.tag.code_color = color;
    },
    setProjectId(projectId) {
      this.tag.project_id = projectId;
    },

    setSelectedTags(tags) {
      this.selectedTags = tags;
      this.selectedTags.sort((a, b) => ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1));
    },

    addTag(newTag) {
      console.log('addTag');
      createTag({...newTag, project_id: this.tag.project_id});
    },

    editTag(editedTag) {
      console.log('editedTag');
      updateTag({...editedTag, project_id: this.tag.project_id});
    },

    removeTag(removedTagId) {
      deleteTag({
    id: removedTagId,
    project_id: this.tag.project_id
  });
    },
  },
  getters: {
    getColors: (state) => state.colors,
    getTag: (state) => state.tag,
    getSelectedTags: (state) => state.selectedTags,
  },
});

export default useTagStore;
