import { transport } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transport.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Verify Your Email',
            text: 'UpTask -  Verify Your Email',
            html: `
                <p>Hi: ${user.name}, You have created an Account in UpTask. Just confirm your Email to Start</p>
                <p>Click in the next Link: </p>
                <a href="">Confirm Your Account</a>
                <p>Enter Code: <b>${user.token}</b></p>
                <p>This Token expires in 10 minutes</p>
            `
        })

        console.log('Message Send', info.messageId)
    }
}