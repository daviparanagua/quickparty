module.exports = {
    randomParticipant () {
        return this.activeUsers[Math.floor(Math.random() * this.activeUsers.length)];
    },
    setPublicData(data) {
        Object.assign(this.public, data);
    },
    getAvailableToUserData(user) {
        let userId = user.id ? user.id : user;
        let allData = this.public;
        let privateData = this.getPrivateData(user);
        let unrestritedData = this.getUnsrestrictedData(user);

        return allData;
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
    setRestrictedData (user, info) {
        let userId = user.id ? user.id : user;
        
        if(!this.isParticipant(user)){return false;}

        if(!this.restricted[userId]) this.restricted[userId] = {}; // Cria objeto, se não existir.
        Object.assign(this.restricted[userId], info);
    },
    getUnrestrictedData (user, info) {
        let userId = user.id ? user.id : user;
        let unrestritedData = {};

        for (restrictedUser in this.restricted) {
            if (!restrictedUser !== userId){
                Object.assign(unrestritedData, this.restricted[restrictedUser]);
            }
        }
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