import express from 'express';
import { login, register, refreshToken, logout } from '../../controllers/auth.controller.js';
const router = express.Router();
import { body } from 'express-validator';
import { validationUserData } from '../../middlewares/validationUserData.middleware.js';
import { requireToken } from '../../middlewares/requireToken.middleware.js';

import { User } from '../../models/User.model.js';


router.post('/register',
  [
    // validaciones de nombre
    body('name', "Mínimo 3 caracteres")
      .trim()
      .isLength({ min: 3 }),
    // validaciones de apellido
    body('lastname', "Mínimo 3 caracteres")
      .trim()
      .isLength({ min: 3 }),
    // validaciones de email
    body('email', "Formato email incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),
    // validaciones de contraseñas
    body('password', "Mínimo 6 caracteres")
      .trim()
      .isLength({ min: 6 }),
    body('password', "Formato de contraseña incorrecta")
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        return value;
      }),
    body('role', "El rol debe ser admin o user")
      .trim()
      .isIn(['admin', 'user'])
  ],
  validationUserData,
  register)

router.post('/login',
  [
    // validaciones de email
    body('email', "Formato email incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),
  ],
  validationUserData,
  login)

// test protected route
router.get('/protected', requireToken, async (req, res) => {
  const user = await User.findById(req.user.id)
  const { password, role, ...rest } = user._doc
  res.json({ role, ...rest  })
})

router.get('/refresh', refreshToken)
router.get('/logout', logout)

export default router;
