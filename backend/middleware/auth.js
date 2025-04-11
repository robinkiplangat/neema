const { Clerk } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const clerk = Clerk({ apiKey: process.env.VITE_CLERK_SECRET_KEY });

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token with Clerk
    const { sub } = await clerk.verifyToken(token);
    
    if (!sub) {
      return res.status(401).json({ message: 'Token verification failed' });
    }

    // Find user in our database
    let user = await User.findOne({ clerkId: sub });
    
    if (!user) {
      // If user doesn't exist in our database yet, get user from Clerk
      const clerkUser = await clerk.users.getUser(sub);
      
      // Create user in our database
      user = new User({
        clerkId: sub,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        profileImageUrl: clerkUser.profileImageUrl
      });
      
      await user.save();
    }

    // Add user to request object
    req.user = {
      id: user._id,
      clerkId: user.clerkId,
      email: user.email
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 