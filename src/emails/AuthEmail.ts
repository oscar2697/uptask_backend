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
                <p>Hi: ${user.name}, Thanks for signing up with UpTask! </p>
                <p>You must follow this link within 10 minutes of registration to activate your account:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm">Confirm Your Account</a>
                <p>Enter this verification code to sign up: <b>${user.token}</b></p>
                <p>Don't share it with anyone</p>
                <p>This Token expires in 10 minutes</p>
            `
        })

        console.log('Message Send', info.messageId)
    }
}