import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.ethereal.email",
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

let nodeMailer = async () => {
  try {
    const info = await transporter.sendMail({
      from:{
        name:"akash patel",
        address:"<EMAIL>",
      },
      to: "bar@example.com, baz@example.com",
      subject: "Hello ✔",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:");
    return error
  }
};

export default nodeMailer;
