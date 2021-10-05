const nodeMailer = require('../config/nodemailer');
const env = require('../config/environment');

module.exports.sendOTPResetPassword = async function(userResetPassword){
    try{
        console.log('Inside OTP for Reset Password Mailer');
        let htmlString = await nodeMailer.renderTemplate({
            userResetPassword: userResetPassword
        }, '/otp/reset_password_otp.ejs');

        let info = await nodeMailer.transporter.sendMail({
            from: env.smtp.auth.user,
            to: userResetPassword.email,
            subject: 'Codeial Reset Password Request',
            html: htmlString
        });

        console.log(info);
    } catch(err){
        console.log("Error while sending OTP Reset Password Mail", err);
    }
};