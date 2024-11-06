import nodemailer from 'nodemailer';
const sendEmail= async (options) => {
    try {
        // Tạo transporter để gửi email
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          }
        });
    
        // Tùy chỉnh nội dung email
        const mailOptions = {
          from: `"Đội ngũ hỗ trợ" <${process.env.MAIL_USER}>`,
          to: options.to,
          subject: options.subject,
          html: options.html
        };
    
        // Gửi email
        await transporter.sendMail(mailOptions);
    
        console.log('Email sent');
      } catch (error) {
        console.log(error);
        throw new Error('Failed to send email');
      }
    };
export default sendEmail;