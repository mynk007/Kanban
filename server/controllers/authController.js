import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword })
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email, password)
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }
        return res.json(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            }
        )
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
