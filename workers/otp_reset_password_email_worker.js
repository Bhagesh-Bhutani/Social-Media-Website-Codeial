const queue = require('../config/kue');

const otpResetPasswordMailer = require('../mailers/reset_password_otp_mailer');

queue.process('otp_reset_password', function(job, done){
    console.log('otp_reset_password worker is processing a job', job.data);

    otpResetPasswordMailer.sendOTPResetPassword(job.data);

    done();
});

module.exports = queue;