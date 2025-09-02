const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../connection');

exports.getSigninResults = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email }).lean();
    
    if (!user) {
      const resData = {
          status: false,
          response: 'User not found'
      };
      return res.status(404).json(resData);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resData = {
      status: true,
      response: {
        userId: user._id,
        name: user.name,
        is_admin: user.is_admin,
        level: user.level,
        token
      }
    };
    res.status(200).json(resData);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getSignToken = async (req, res) => {
  try {
    const { email } = req.body;

    const token = jwt.sign({ userId: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resData = {
      status: true,
      response: {
        userId: email,
        token
      }
    };
    res.status(200).json(resData);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

