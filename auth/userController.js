var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from './generateAccessToken.js';
import { userFields } from './types.js';
import { sendEmail } from '../middleware/sendEmail.js';
const prisma = new PrismaClient();
//API for User Registration 
export const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { name, email, password } = _a, restData = __rest(_a, ["name", "email", "password"]);
    // Check if the email is already registered
    const existingUser = yield prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    //criteria pasword sould be 6 char long contains one lowercase, uppercase, number and special char
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).*$/;
    if (password.length < 6 && !regex.test(password)) {
        return res.status(400).json({
            error: 'Password should be 6 char long contains one lowercase, uppercase, number and special char'
        });
    }
    // Hash the password
    const hashedPassword = yield bcrypt.hash(password, 10);
    //generating username.
    //generate 4 digit random number
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const username = name.split(' ').join('_') + randomNumber.toString();
    try {
        // Create the user
        const newUser = yield prisma.user.create({
            data: Object.assign({ name: name, email: email, password: hashedPassword, username: username }, restData),
            select: userFields,
        });
        //generating token
        const payload = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username
        };
        try {
            const token = yield generateToken(payload);
            return res.status(201).json({ data: newUser, accessToken: token });
        }
        catch (error) {
            return res.status(500).json({ error: "Error in generating token", details: error });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//Api for login user    
export const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        // Verify the password
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        // Generating token
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        //excluding password
        const newUser = {
            id: user.id, name: user.name, username: user.username,
            email: user.email, created_at: user.created_at,
        };
        const token = yield generateToken(payload);
        return res.json({ data: newUser, accessToken: token });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
export const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if req.user exists because we have inserted user details in req.user after token verification.
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }
    const userId = req.user.id;
    const dataToUpdate = req.body;
    try {
        yield prisma.user.update({
            where: {
                id: userId,
            },
            data: Object.assign({}, dataToUpdate),
        });
        //sending email
        const payload = {
            to: req.user.email,
            subject: 'Profile updation email',
            html: '<p>Congrats! <strong>Your profile has been updated</strong>!</p>'
        };
        yield sendEmail(payload);
        return res.status(200).json({
            message: "Profile updated successfully!"
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//# sourceMappingURL=userController.js.map