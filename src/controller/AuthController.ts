import { Request, Response } from "express";
import Auth from "../models/Auth";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const {password, email} = req.body

            //Prevent user Exists twice
            const userExists = await Auth.findOne({email})

            if(userExists) {
                const error =  new Error('Email is Already Registered')
                return res.status(409).json({error: error.message})
            }

            // Create a user
            const user = new Auth(req.body)

            // Hash Passwaord
            user.password = await hashPassword(password)

            //Generate Token
            const token = new Token()
            token.token =  generateToken()
            token.user = user.id

            //Send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(),  token.save()])

            res.send('Your Account was created successfully! Please check your email for confirmation')
        } catch (error) {
            res.status(500).json({error: 'Something went Wrong'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const {token} = req.body
            const tokenExists = await Token.findOne({token})
            
            if(!tokenExists) {
                const error = new Error('Token not Valid')
                res.status(404).json({error: error.message})
            }

            const user = await Auth.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([
                user.save(),
                tokenExists.deleteOne()
            ])

            res.send('Account Confirmed')
        } catch (error) {
            res.status(500).json({error: 'Something went Wrong'})
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const {email, password} =  req.body
            const user =  await Auth.findOne({email})

            if(!user) {
                const error = new Error('User not exists')
                res.status(404).json({error: error.message})
            }

            if(!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('Account not confirmed, We sent an Email to confirm your Account')
                return res.status(401).json({error: error.message})
            }

            //Check Password
            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect) {
                const error = new Error('Invalid username or password')
                return res.status(401).json({error: error.message})
            }

            const token = generateJWT({id: user.id})
            res.send(token)
        } catch (error) {
            res.status(500).json({error: 'Something went Wrong'})
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const {email} = req.body

            //user Exists 
            const user = await Auth.findOne({email})

            if(!user) {
                const error =  new Error('Email is not Registered')
                return res.status(404).json({error: error.message})
            }

            if(user.confirmed) {
                const error =  new Error('Email is already Confirmed!')
                return res.status(409).json({error: error.message})
            }

            //Generate Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(),  token.save()])

            res.send('Your new Token was sent, check your Email')
        } catch (error) {
            res.status(500).json({error: 'Something went Wrong'})
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const {email} = req.body

            //user Exists 
            const user = await Auth.findOne({email})

            if(!user) {
                const error =  new Error('Email is not Registered')
                return res.status(404).json({error: error.message})
            }

            //Generate Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            //Send email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Check your email and follow the instructions')
        } catch (error) {
            res.status(500).json({error: 'Something went Wrong'})
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const {token} = req.body
            const tokenExists = await Token.findOne({token})
            
            if(!tokenExists) {
                const error = new Error('Token not Valid')
                return res.status(404).json({error: error.message})
            }

            res.send('Token valid, Enter your new password')
        } catch (error) {
            res.status(500).json({error: 'Something went Wrong'})
        }
    }

    static updatePassword = async (req: Request, res: Response) => {
        try {
            const {token} = req.params
            const {password} = req.body
            const tokenExists = await Token.findOne({token})
            
            if(!tokenExists) {
                const error = new Error('Token not Valid')
                return res.status(404).json({error: error.message})
            }

            const user = await Auth.findById(tokenExists.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('Password reset successfully')
        } catch (error) {
            res.status(500).json({error: 'Something went Wrong'})
        }
    }
}