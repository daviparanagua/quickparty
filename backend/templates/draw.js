let template = {
    public: {},
    start: function() {
        let activeUsers = this.currentRoom.activeUsers;
        let randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
        this.public.chosenUser = randomUser;
        //this.helpers.sendRoomInfo(this.roomId);
    }
}

module.exports = function (commonIncludes){
    let {rooms, socket} = commonIncludes;
    let newSession = Object.assign({}, template, commonIncludes);

    newSession.gameSession = {};
    newSession.currentRoom = rooms[socket.currentRoom];
    newSession.roomId = socket.currentRoom;

    return newSession;
}