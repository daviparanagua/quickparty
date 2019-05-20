const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');

let template = {
    public: {},
    start: function (commonIncludes) {
        let {currentUser} = commonIncludes;
        this.theLiar = this.randomParticipant();
        this.addUserTag(this.theLiar, 'isLiar');

        // Carregar questões
        fs.readFile(path.resolve(__dirname, './questions.csv'), 'utf8', (err, contents) => {
            const questions = parse(contents, {
                columns: true,
                skip_empty_lines: true
            })

            this.questions = questions;
            this.nextQuestion(commonIncludes);
        });
        /**
        console.log(this.tags);
        console.log('------');
        console.log(this.getUserTags(theLiar));
         */
    },
    nextQuestion ({currentUser}) {
        let selectedQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
        this.currentQuestion = selectedQuestion;
        this.setRestrictedData(currentUser, selectedQuestion);
        //this.sendSessionInfo();
    },
    sendSessionInfo () {
        let allinfo = this.public;

        this.activeUsers.forEach( (user => {
            // console.log(user);
        }));

    },
    events: {
        test: function (payload, {io, socket, currentUser}) {
            io.in(socket.currentRoom).emit('session', this.getUnrestrictedData(currentUser));
        }
    }
}

module.exports = template;