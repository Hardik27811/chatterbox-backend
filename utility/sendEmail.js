const nodemailer = require('nodemailer')

const sendEmail = async ({to,subject,text})=>{
    const transporter = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT,
        secure: false,
        auth : {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        
    })


const message = {
    from :`"ChatterBox" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
}
await transporter.sendMail(message)
}

module.exports = sendEmail;