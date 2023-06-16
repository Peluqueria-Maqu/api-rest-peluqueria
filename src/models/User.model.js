import { model, Schema } from "mongoose";
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
})

UserSchema.pre('save', async function (next) {
  const user = this

  if (!user.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
  } catch (error) {
    throw new Error('Falló el hash de contraseña', error)
  }
  next()
})

UserSchema.methods.comparePassword = async function (clientPassword) {
  return await bcrypt.compare(clientPassword, this.password)
}

export const User = model('User', UserSchema)