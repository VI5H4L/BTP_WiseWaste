const expressAsyncHandler = require("express-async-handler");
const { User } = require("../../models/user.models");
const { hashData } = require("../../utils/hashPassword");

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
  const phone = req.body.phone;
  if (phone!="9999999999") {
    try {
      const user = await User.findOneAndUpdate({ emailID: emailID }, {phone : phone}, {
        new: true,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  const password = req.body.password;
  if (password!="") {
    try {
      if (password.length < 8) {
        res.json({ success: false, message: "Password is too short!" });
      } else {
        // hash password
        const hasedPassword = await hashData(password);
        const user = await User.findOneAndUpdate(
          { emailID: emailID },
          { password: hasedPassword },
          { new: true }
        );

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
  if(phone=="9999999999" && password=="") res.end();
});

module.exports = { getProfileData, updateProfileData };
