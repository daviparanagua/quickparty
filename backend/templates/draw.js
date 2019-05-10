module.exports = function ({io, socket, users, rooms, helpers}) {
    let gameInstance = {};
    let thisRoomId = socket.currentRoom;
    let thisRoom = rooms[thisRoomId];

    gameInstance.start = () => {
        helpers.sendRoomInfo(thisRoomId);
    }

    return gameInstance;

}