import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (to, token) => {
  const link = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify your email - TrustLink',
    text: `Click the link to verify your email: ${link}`,
    html: `<p>Click to verify your email: <a href="${link}">${link}</a></p>`
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};
