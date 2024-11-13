// src/pages/api/login.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { email, password } = req.body;
  
      // 简单的验证逻辑（在实际应用中替换为数据库查询）
      if (email === 'user@nextmail123.com' && password === '123') {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  