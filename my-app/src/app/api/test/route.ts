import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  // adding logic to just fetch the data and give back positive response after recieve data
  const { email, message } = await request.json();
  console.log(email, message);
  // adding logic with nodemailer to send this data to my email while I save myemail and email password in .env.local file
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: email,
    to: process.env.MY_EMAIL,
    subject: `Message from ${email}`,
    text: message,
  };
  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ messsage: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error sending email" });
  }
}
