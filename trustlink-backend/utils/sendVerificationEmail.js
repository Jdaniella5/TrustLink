import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `TrustLink <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your Email Address",
        html: `
        <h2>Verify Your Email Address</h2>
        <p>Hello,</p>
        <p>Thank you for signing up to TrustLink. Please verify your email address with this code below:</p>
        <h2>${code}</h2>
        <p>This code will expire in 30 seconds.</p>
        <br>
        <p>If you did not create this account, kindly ignore</p>
        <p>Best regards,<br>TrustLink</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};
   