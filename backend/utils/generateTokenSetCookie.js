import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  res.cookie("token", token, {
    httpOnly: true, // only accessible by web server, prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // only use HTTPS in production
    sameSite: "strict", // protects against CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};
