const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp, type) => {
  let title = type === 'account-verification' ? 'Verify your eventora account' : 'Verify your event booking';

  const mailOptions = {
    from: `Your App Name <${process.env.EMAIL_USER}>`,
    to: email,
    subject: title,
    text: `Hello,\n\nYour OTP code for ${purposeText} is: ${otp}.\n\nThis code is valid for 5 minutes. Do not share this code with anyone.`,
    text: `Your OTP code is: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email} for ${type}`);
    return info;
  } catch (error) {
    console.error("Failed to send email via Nodemailer:", error);
    throw new Error("Email service failed, please try again later.");
  }
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  const mailOptions = {
    from: `Your App Name <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `🎉 Booking Confirmed: ${eventTitle}`,
    text: `Hi ${userName},\n\nYour booking for the event "${eventTitle}" has been successfully confirmed!\n\nThank you for booking with us. Enjoy your event!`,
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2ECC71;">Booking Confirmed!</h2>
                <p>Hi <strong>${userName}</strong>,</p>
                <p>Great news! Your spot for <strong>"${eventTitle}"</strong> is officially locked in.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2ECC71; margin: 20px 0;">
                    <p style="margin: 0; font-size: 16px;"><strong>Event:</strong> ${eventTitle}</p>
                </div>
                <p>Thank you for choosing us. We hope you have an incredible time!</p>
                <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
                <p style="font-size: 12px; color: #7f8c8d;">This is an automated confirmation email. Please do not reply directly to this message.</p>
            </div>
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Booking email sent successfully to ${userEmail}`);
    return info;
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
    throw new Error("Booking confirmation email could not be sent.");
  }
};

module.exports = { sendOtpEmail };
