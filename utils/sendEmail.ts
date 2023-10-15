import nodemailer from "nodemailer";

const sendEmail = async (email: string, subject: string, text: string) => {
    try {

        let testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            requireTLS: true,
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        }).then((info) => {
            console.log("Email Sent: ", nodemailer.getTestMessageUrl(info))
        })

    } catch (error) {
        console.log(error, "email not sent");
    }
};

export default sendEmail;