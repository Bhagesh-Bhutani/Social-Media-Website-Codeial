const nodeMailer = require('../config/nodemailer');
const env = require('../config/environment');

module.exports.sendOTPCreateUser = async function(tempUser){
    try{
        console.log('Inside OTP for Create User Mailer');
        let htmlString = await nodeMailer.renderTemplate({
            tempUser: tempUser
        }, '/otp/create_user_otp.ejs');

        let info = await nodeMailer.transporter.sendMail({
            from: env.smtp.auth.user,
            to: tempUser.email,
            subject: 'Create Account on Codeial | OTP',
            html: htmlString
        });

        console.log(info);
    } catch(err){
        console.log("Error while sending OTP Create User Mail");
    }
};