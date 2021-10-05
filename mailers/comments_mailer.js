const nodeMailer = require('../config/nodemailer');
const env = require('../config/environment');

exports.newComment = async (comment) => {
    try{
        console.log("Inside newComment Mailer");
        let htmlString = await nodeMailer.renderTemplate({
            comment: comment
        }, '/comments/new_comment.ejs');

        let info = await nodeMailer.transporter.sendMail({
            from: env.smtp.auth.user,
            to: comment.user.email,
            subject: 'New Comment Published',
            html: htmlString
        });

        console.log(info);
    } catch(err){
        console.log("Error in sending new comment mail", err);
    }
};