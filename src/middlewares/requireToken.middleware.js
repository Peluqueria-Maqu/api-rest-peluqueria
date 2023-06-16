import jwt from 'jsonwebtoken';
import 'dotenv/config.js';
import { User } from '../models/User.model.js';

export const requireToken = async (req, res, next) => {
  try {
    let token = req.headers?.authorization;
    if (!token) throw new Error('No Bearer');

    token = token.split(' ')[1];
    // console.log(token);
    const {uid} = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(uid);
    req.user = await User.findById(uid);
    // console.log(req.user);
    next();
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