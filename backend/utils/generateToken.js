import jwt from 'jsonwebtoken';

// payload example: { id: user._id, role: 'user' } or { email, role: 'admin' }
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

export default generateToken;
