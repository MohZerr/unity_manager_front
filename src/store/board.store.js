import { defineStore } from 'pinia';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  removeProject,
  createCollaborator,
  getLastCollaborator,
} from '@/api/project.js';
import useUserStore from '@/store/user.store';
import { getTagsByProject } from '@/api/tag';
import { socket } from '@/sockets/socket';

const useBoardStore = defineStore('board', {
  state: () => ({
    selectedProject: {},
    projects: [],
  }),
  actions: {
    persistToLocalStorage() {
      localStorage.setItem('projectId', JSON.stringify(this.selectedProject.id));
    },
    setProject(project) {
      console.log('setProject', project);
      this.selectedProject = project;
      this.persistToLocalStorage();
    },

    setSelectedProject(projectId) {
      getProject(projectId).then((project) => {
        this.selectedProject = project;
      });
    },
    fetchProjects() {
      getProjects().then((projects) => {
        this.projects = projects;
      });
    },
    addProject(project) {
      createProject(project).then((result) => {
        if (!this.projects) {
          this.projects = [];
        }
        if (!this.projects) {
          this.projects = [];
        }
        this.projects.push(result);
        this.projects.sort((a, b) => ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1));
      });
    },
    editProject(project) {
      updateProject(project).then((result) => {
        this.selectedProject = result;
      });
    },
    async deleteProject(projectId) {
      this.projects = this.projects.filter(
        (project) => project.id !== projectId,
      );
      if (this.selectedProject.id === projectId) {
        this.selectedProject = {};
      }
      this.projects = this.projects.filter(
        (project) => project.id !== projectId,
      );
      await removeProject(projectId);
    },

    async addCollaborator(collaborator) { // Add collaborator to the project
      await createCollaborator(collaborator);
    },
    async updateCollaborators() {
      await getLastCollaborator(this.selectedProject.id).then((collaborator) => {
        this.selectedProject.collaborators.push(collaborator);
      });
    },
    async refreshTags() {
      return this.selectedProject.tags = await getTagsByProject(this.selectedProject.id);
    },
    refreshMessageColor() {
      this.selectedProject.messages.forEach((message) => {
        if (message.user_id === useUserStore().user.id) {
          message.user.color = useUserStore().user.code_color;
        }
      });
    },
    initializeWebSocketEvents() {
      socket.on('refreshMessage', (data) => {
        this.refreshMessage(data);
      });
      socket.on('refreshTag', (data) => {
        console.log('refreshTagSocket');
        this.refreshTags(data);
      });
      socket.on('refreshList', (data) => {
        this.refreshLists(data);
      });
      socket.on('refreshCard', (data) => {
        this.refreshCards(data);
      });
    },

    async refreshMessage(data) {
      if(data.verb === 'update') {
        this.selectedProject.messages = this.selectedProject.messages.map(message => {
          if(message.id === data.result.id) {
            return data.result;
          }
          return message;
        });
      }
      if(data.verb === 'create') {
        console.log(data);
        data.result.user = this.selectedProject.collaborators.find(user => user.id === data.result.user_id);
        data.result.user.color = this.selectedProject.collaborators.find(user => user.id === data.result.user_id).code_color;
        this.selectedProject.messages = [...this.selectedProject.messages, data.result];
      }
      if(data.verb === 'delete') {
        this.selectedProject.messages = this.selectedProject.messages.filter(message => message.id !== data.result.id);
      }
    },
    async refreshLists(data) {
      console.log(data);
      if (data.verb === 'update') {
        const newList = data.result;
      
        // Étape 1 : Mettre à jour la liste avec les nouvelles données
        this.selectedProject.lists = this.selectedProject.lists.map(list => {
          if (list.id === newList.id) {
            return {
              ...list,
              ...newList
            };
          }
          return list;
        });
        console.log('lists', this.selectedProject.lists);
      
        // Étape 2 : Trier les listes par position après la mise à jour
        this.selectedProject.lists = this.selectedProject.lists.sort((a, b) => a.position - b.position);

        if(newList.position<0.001) {
          console.log('reset position');
          this.selectedProject.lists.forEach((list, index) => {
            list.position = index + 1;
          });
        }
      }
      if(data.verb === 'create') {
        this.selectedProject.lists = [...this.selectedProject.lists, data.result];
      }
      if(data.verb === 'delete') {
        this.selectedProject.lists = this.selectedProject.lists.filter(list => list.id !== data.result.id);
      }
    },
    async refreshCards(data) {
      console.log(data);
      if (data.verb === 'update') {
        const newCard = data.result;
        const selectedCard = this.selectedProject.lists.flatMap(list => list.cards).find(card => card.id === newCard.id);
    
        // Étape 1 : Supprimer la carte de l'ancienne liste
        this.selectedProject.lists = this.selectedProject.lists.map(list => {
            if (list.cards.find(card => card.id === newCard.id)) {
                list.cards = list.cards.filter(card => card.id !== newCard.id);
            }
            return list;
        });
    
        // Étape 2 : Ajouter ou mettre à jour la carte dans la nouvelle liste
        this.selectedProject.lists = this.selectedProject.lists.map(list => {
            if (list.id === newCard.list_id) {
                // Si la carte existe déjà dans la nouvelle liste, on la met à jour
                const existingCardIndex = list.cards.findIndex(card => card.id === newCard.id);
                if (existingCardIndex !== -1) {
                    list.cards[existingCardIndex] = { ...list.cards[existingCardIndex], ...newCard };
                } else {
                    // Sinon, on ajoute la nouvelle carte à la liste
                    list.cards.push({...selectedCard, ...newCard});
                    list.cards.sort((a, b) => a.position - b.position);
                }
            }
            return list;
        });
    }
      if (data.verb === 'create') {
        this.selectedProject.lists = this.selectedProject.lists.map(list =>
          list.id === data.result.list_id ? ({
            ...list,
            cards: [...list.cards, data.result]
          }) : list
        );
      };

      if(data.verb === 'delete') {
        const deletedCard = this.selectedProject.lists.flatMap(list => list.cards).find(card => card.id === data.result.id);

        this.selectedProject.lists = this.selectedProject.lists.map(list => {
          if (list.cards.find(card => card.id === deletedCard.id)) {
            list.cards = list.cards.filter(card => card.id !== deletedCard.id);
          }
          return list;
        });
      }
    },
    async refreshTags(data) {
      if(data.verb === 'update') {
        this.selectedProject.tags = this.selectedProject.tags.map(tag => {
          if(tag.id === data.result.id) {
            return data.result;
          }
          return tag;
        })
      }
      if(data.verb === 'create') {
        this.selectedProject.tags = [...this.selectedProject.tags, data.result];
      }
      if(data.verb === 'delete') {
        this.selectedProject.tags = this.selectedProject.tags.filter(tag => tag.id !== data.result.id);
      }
    },
  },
  getters: {

    // Getter pour sélectionner récupérer le projet seletionné
    project: (state) => state.selectedProject || {},

    projectId: (state) => state.selectedProject.id || '',

    // Getter pour sélectionner tous les projets
    allProjects: (state) => state.projects,

    // Getter pour sélectionner les messages d'un projet seletionné
    messages: (state) => state.selectedProject.messages || [],

    // Getter pour sélectionner les utilisateurs d'un projet seletionné
    users: (state) => state.selectedProject.users || [],

    // Getter pour sélectionner les listes d'un projet seletionné
    lists: (state) => state.selectedProject.lists || [],

    // Getter pour sélectionner les cartes d'un projet seletionné
    cards: (state) => {
      return state.selectedProject.lists.flatMap(list => list.cards);
    },

    // Getter pour sélectionner les tags d'un projet seletionné
    tags: (state) => state.selectedProject.tags || [],

    // Getter pour séléctionner les collaborateurs d'un projet seletionné
    collaborators: (state) => state.selectedProject.collaborators || [],
  },
});

export default useBoardStore;
