let template = {
    start: function() {
        let randomUser = this.randomParticipant();
        this.public.chosenUser = randomUser;
    }
}

module.exports = template;