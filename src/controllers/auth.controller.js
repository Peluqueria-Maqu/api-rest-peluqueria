import { User } from '../models/User.model.js';
import { generateRefreshToken, generateToken } from '../utils/generateManager.util.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  console.log(req.body);  
  const { name, lastname, email, password, role } = req.body;
  try {
    // alternativa buscando el usuario por email:
    let user = await User.findOne({ email });
    if (user) throw ({code: 11000})
    
    user = new User({ name, lastname, email, password, role });
    await user.save();
    
    // jwt 
    
    return res.status(201).json({ message: "Registered user successfully" });
  } catch (error) {
    // alternativa por defecto moongose para validar si el usuario existe:
    if (error.code === 11000) {
      return res.status(400).json({ message: "The user is already registered", error: error });
    }
    return res.status(500).json({ message: "Server Error" });
  }
  
  // res.json({ ok: 'Register' });
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) 
      return res.status(400).json({ message: "Unregistered user" });

    // ? Se llama a la función comparePassword del modelo User en User.model.js
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Incorrect password');

    const { token, expiresIn } = generateToken(user._id);
    generateRefreshToken(user._id, res);

    return res.status(200).json({token, expiresIn});

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

}


export const refreshToken = (req, res) => {

  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) throw new Error("No existe el token");

    const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

    const { token, expiresIn } = generateToken(uid);
    return res.status(200).json({ token, expiresIn });
    
  } catch (error) {
    const tokenVerificationError = {
      ["invalid signature"]: "Invalid token",
      ["jwt expired"]: "JWT expirado",
      ["jwt malformed"]: "JWT formato incorrecto",
      ["invalid token"]: "Token Invalido",
      ["No Bearer"]: "Utiliza el formato Bearer token",
    }

    return res
      .status(401)
      .send({ error: tokenVerificationError[error.message] || error.message });
  }

}

export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logout successfully' });
}