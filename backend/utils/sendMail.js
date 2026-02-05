const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendRegistrationEmail = async (to, name) => {
  await transporter.sendMail({
    from: `"HairCare AI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Registration Successful",
    html: `<h2>Welcome, ${name}!</h2><p>Your registration at HairCare AI was successful.</p>`,
  });
};

exports.sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"HairCare AI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "OTP for Password Reset",
    html: `
      <h2>Password Reset OTP</h2>
      <p>Your OTP code is: <b>${otp}</b></p>
      <p>This code is valid for 10 minutes. Please do not share it with anyone.</p>
    `,
  });
};
