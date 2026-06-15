const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    const userData = req.headers['user-data'];
    
    if (!userData) {
      return res.status(401).json({ error: 'User data required' });
    }
    
    const user = JSON.parse(userData);
    
    if (!user.id) {
      return res.status(401).json({ error: 'Telegram ID required' });
    }
    
    let dbUser = await User.findOne({ telegramId: user.id.toString() });
    
    if (!dbUser) {
      dbUser = new User({
        telegramId: user.id.toString(),
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        languageCode: user.language_code
      });
      await dbUser.save();
    } else {
      // Update user info
      dbUser.username = user.username || dbUser.username;
      dbUser.firstName = user.first_name || dbUser.firstName;
      dbUser.lastName = user.last_name || dbUser.lastName;
      await dbUser.save();
    }
    
    req.user = dbUser;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = authenticateUser;