module.exports = {
    randomParticipant () {
        return this.currentRoom.activeUsers[Math.floor(Math.random() * this.currentRoom.activeUsers.length)];
    }

    
}