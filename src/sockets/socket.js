// src/sockets/socket.js
import io from 'socket.io-client';

// Établir une connexion WebSocket. Assurez-vous que l'URL est correcte.
const socket = io('http://localhost:4000');

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
// ---------------messages----------------------------
function initializeMessageReceived(onMessageReceived) {
  socket.on('refreshMessage', (message) => {
    if (onMessageReceived) {
      onMessageReceived(message);
    }
  });
}

export {
  emitNewCollaborator,
  initializeBoardEvents,
  initializeCollaboratorReceived,
  initializeMessageReceived,
  connecting,
  joinProjectRoom,
  leaveProjectRoom,
  socket,
};
