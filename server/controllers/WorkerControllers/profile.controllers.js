const expressAsyncHandler = require("express-async-handler");
const { User } = require("../../models/user.models");

const getProfileData = expressAsyncHandler(async (req, res) => {
  const emailID = req.query.emailID;

  try {
    const user = await User.findOne({ emailID: emailID });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
const updateProfileData = expressAsyncHandler(async (req, res) => {
    const emailID = req.query.emailID;

    try {
        const user = await User.findOneAndUpdate(
            { emailID: emailID },
            req.body,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
  
});

module.exports = { getProfileData,updateProfileData };
