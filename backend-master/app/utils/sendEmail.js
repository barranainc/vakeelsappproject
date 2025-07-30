const transporter=require("../config/email")

const sendEmail = async (toEmail ,subject, body) => {
    try {
        
        const info = await transporter.sendMail({
            from: `"Vakeel" <${process.env.SMTP_MAIL}>`,
            to: toEmail,
            subject: subject,
            text: subject,
            html: body,
          });
          console.log(await info)
          return await info;
    } catch (error) {
        console.log(error)
       return error;  
    }
    
}



module.exports = {sendEmail}