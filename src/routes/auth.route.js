import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
const router = express.Router();
import { body } from 'express-validator';
import { validationResultExpress } from '../middlewares/validationResultExpress.validator.js';


router.post('/register',
  [
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
      })
  ],
  validationResultExpress,
  register)
router.post('/login', 
  [
    // validaciones de email
    body('email', "Formato email incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),  
  ],
  validationResultExpress,
  login)

export default router;
