import jwt from 'jsonwebtoken';


export const generateToken = (uid) => {
  const expiresIn = 60 * 15;
  
  try {
    const token = jwt.sign({ uid: uid }, process.env.JWT_SECRET, { expiresIn });
    return { token, expiresIn };
  } catch (error) {
    throw new Error('Error generating token');
  }
}

export const generateRefreshToken = (uid, res) => {
  const expiresIn = 60 * 60 * 24 * 30;
  try {
    const refreshToken = jwt.sign({ uid: uid }, process.env.JWT_REFRESH, { expiresIn });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.MODE === 'DEVELOPMENT' ? false : true,
      expires: new Date(Date.now() + expiresIn * 1000),
    });
  } catch (error) {
    throw new Error('Error generating token');
  }
}