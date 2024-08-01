const appError = require('../error/appError.js')
const {transporter}=require('./sendVerificationEmail.js')
const QRCode=require('qrcode')
const generateQR = async (text) => {
    try {
      return await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
      throw new appError('Error generating QR', 500);
    }
  };
  
const sendQrToMail=async(user,qrData)=>{

    try {
        const qrCodeUrl = await generateQR(qrData);
        //console.log(qrCodeUrl)
        const info = await transporter.sendMail({
            from: 'akkr9507@gmail.com', // sender address
            to: user?.email, // list of receivers
            subject: "one time entry qr code", // Subject line
            text: "don't share this can be used only once ",// plain text body
            html: `<p>${qrData}</p>`, // html body
            attachments: [{
                filename: 'QR_code.png',
                path: qrCodeUrl,
            }]
        });
        console.log("Message sent: %s", info);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }
    catch (e) {
        console.error(e)
        throw new appError("unable to send qr to email",400)
    }

}
module.exports=sendQrToMail;
