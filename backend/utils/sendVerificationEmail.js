const nodemailer = require("nodemailer");
const appError = require("../error/appError");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: process.env.GMAIL_PORT,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
async function sendVerificationEmail(href) {
    // send mail with defined transport object
    try {
        const info = await transporter.sendMail({
            from: 'akkr9507@gmail.com', // sender address
            to: "amul.kumar.min21@itbhu.ac.in", // list of receivers
            subject: "account verification Link", // Subject line
            text: "this is email to verify your account ",// plain text body
            html: `<a href=${href}>${href}<a/>`, // html body
        });
        console.log("Message sent: %s", info);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }
    catch (e) {
        console.error(e)
        throw new appError("unable to send email",400)
    }

}

module.exports = {sendVerificationEmail,transporter};