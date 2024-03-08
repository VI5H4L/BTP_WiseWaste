const cron = require('node-cron');
const mongoose = require('mongoose');
const {User} = require('../models/user.models'); 

mongoose.connect('mongodb://localhost/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');

  // Schedule cron job
  cron.schedule('0 * * * *', async () => {
    try {
      const expiredStudents = await User.find({
        verified: false,
        verificationExpiresAt: { $lt: new Date() },
      });

      for (const student of expiredStudents) {
        // Delete the student's record or take necessary actions
        await student.remove();
      }
    } catch (error) {
      console.error('Error deleting expired students:', error);
    }
  });
});
