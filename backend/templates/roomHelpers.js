module.exports = {
    randomParticipant () {
        return this.activeUsers[Math.floor(Math.random() * this.activeUsers.length)];
    },

    setPrivateData (user, info) {
        let userId = user.id ? user.id : user;
        
        if(!this.isParticipant(user)){return false;}

        if(!this.private[userId]) this.private[userId] = {}; // Cria objeto, se não existir.
        Object.assign(this.private[userId], info);
    },
    getPrivateData (userId, info) {
        let userId = user.id ? user.id : user;

        return this.private[userId][info];
    },
    isParticipant (user) {
        let userId = user.id ? user.id : user;

        return this.activeUsers.some( (thisUser) => { thisUser.id == userId });
    },
    addUserTag (user, tag) {
        this.setUserTags(user, {[tag]: true});
    },
    setUserTags (user, tags) {
        let userId = user.id ? user.id : user;
        if (!this.tags[userId]) this.tags[userId] = {};

        Object.assign(this.tags[userId], tags);
    },
    getUserTags (user) {
        let userId = user.id ? user.id : user;
        return this.tags[userId];
    },
    userHasTag (user, tag) {
        let userId = user.id ? user.id : user;
        if (!this.tags[userId]) return false;
        return this.tags[userId][tag] || false;        
    }

    
}