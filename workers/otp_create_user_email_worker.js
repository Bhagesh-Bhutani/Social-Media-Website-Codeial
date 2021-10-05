const queue = require('../config/kue');

const otpCreateUserMailer = require('../mailers/create_user_otp_mailer');

queue.process('otp_create_user', function(job, done){
    console.log('otp_create_user worker is processing a job', job.data);

    otpCreateUserMailer.sendOTPCreateUser(job.data);

    done();
});

module.exports = queue;