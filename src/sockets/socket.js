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
    console.log(socket);
  } catch (error) { console.error(error); }
};

const leaveProjectRoom = (projectId) => {
  socket.emit('leaveProject', projectId);
  console.log(`Left project room: ${projectId}`);
};

const emitNewCollaborator = () => {
  try {
    console.log('Emit new collaborator');
    socket.emit('newCollaborator');
  } catch (error) { console.error(error); }
};
function initializeCollaboratorReceived(onCollaboratorReceived) {
  socket.on('refreshCollaborators', () => {
    console.log('im the websocket emit collaborator');
    if (onCollaboratorReceived) {
      onCollaboratorReceived();
    }
  });
}
// --------------------board-------------------------
const emitBoardEdition = () => {
  try {
    socket.emit('boardEvent');
  } catch (error) { console.error(error); }
};

function initializeBoardEvents(refreshBoard) {
  socket.on('refreshBoard', () => {
    if (refreshBoard) {
      refreshBoard();
    }
  });
}
// ---------------messages----------------------------
const emitMessageCreation = () => {
  try {
    socket.emit('messageCreation');
  } catch (error) { console.error(error); }
};
function initializeMessageReceived(onMessageReceived) {
  socket.on('receiveMessage', (message) => {
    if (onMessageReceived) {
      onMessageReceived(message);
    }
  });
}
function initializeChatState(onChatStateReceived) {
  socket.on('chatState', (data) => {
    if (onChatStateReceived) {
      onChatStateReceived(data);
    }
  });
}
function initializeUserState(onUserStateReceived) {
  socket.on('userState', (userFromServer) => {
    if (onUserStateReceived) {
      onUserStateReceived(userFromServer);
    }
  });
}

export {
  emitNewCollaborator,
  emitBoardEdition,
  emitMessageCreation,
  initializeBoardEvents,
  initializeCollaboratorReceived,
  initializeUserState,
  initializeChatState,
  initializeMessageReceived,
  connecting,
  joinProjectRoom,
  leaveProjectRoom,
  socket,
};
