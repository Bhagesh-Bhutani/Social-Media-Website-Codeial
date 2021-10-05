const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

// process function runs whenever a new job enters the queue
queue.process('emails', function(job, done){
    console.log('emails worker is processing a job', job.data);

    commentsMailer.newComment(job.data);

    done();
});

module.exports = queue;