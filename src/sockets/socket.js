// src/sockets/socket.js
import io from 'socket.io-client';
const {VITE_PROD_URL, VITE_DEV_URL,VITE_ENV} = import.meta.env;
const socketUrl = VITE_ENV === 'prod'
  ? VITE_PROD_URL
  : VITE_DEV_URL;
// Établir une connexion WebSocket. Assurez-vous que l'URL est correcte.
const socket = io(socketUrl)

const connecting = (firstname) => {
  try {
    socket.emit('connecting', firstname);
  } catch (error) {
    console.error(error);
  }
};

const joinProjectRoom = (projectData) => {
  try {
    socket.emit('joinProject', projectData);
    socket.project = projectData.id;
  } catch (error) { console.error(error); }
};

const leaveProjectRoom = (projectId) => {
  socket.emit('leaveProject', projectId);
};

const emitNewCollaborator = () => {
  try {
    socket.emit('newCollaborator');
  } catch (error) { console.error(error); }
};
function initializeCollaboratorReceived(onCollaboratorReceived) {
  socket.on('refreshCollaborators', () => {
    if (onCollaboratorReceived) {
      onCollaboratorReceived();
    }
  });
}
// --------------------board-------------------------
function initializeBoardEvents(refreshBoard) {
  socket.on('refreshBoard', () => {
    
    if (refreshBoard) {
      refreshBoard();
    }
  });
}



export {
  emitNewCollaborator,
  initializeBoardEvents,
  initializeCollaboratorReceived,
  connecting,
  joinProjectRoom,
  leaveProjectRoom,
  socket,
};
