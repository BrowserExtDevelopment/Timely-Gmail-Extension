var express = require("express");
var router = express.Router();
var User = require("./../model/user");
import googleClient from "./../utils/google";
import { isAuth as authMiddleware } from "./../utils/middlewares";

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("Forbidden!");
});

router.get("/oauth/callback", async (req, res, next) => {
  try {
    const google = googleClient(null, req.query.state);
    const token = await google.getOAuthTokenFromCode(req.query.code);
    const email = req.query.state;
    if (!email) {
      return res.status(500).send("Error in Google OAuth");
    }
    console.log("~~~~~~~~ email", email);
    let user = await User.findOne({ email });
    if (user) {
      user.token = token;
      user.isNew = false;
    } else {
      user = new User({
        email: email,
        token: token,
        decline: false,
      });
    }
    await user.save();
    return res.send("<script>window.close()</script>");
  } catch (err) {
    console.log("~~~~~~~ Error in oauth/callback", err);
    return res.status(500).send("Error in Google OAuth");
  }
});

router.get("/oauth/:email", function (req, res, next) {
  const oauthURI = googleClient(null, req.params.email).getOAuthURI(
    req.params.email
  );
  res.redirect(oauthURI);
});

router.post("/check-auth", authMiddleware, function (req, res, next) {
  console.log("User is authenticated ", req.user);
  return res
    .status(200)
    .json({ msg: "Authenticated!", decline: req.user["decline"] });
});

router.post("/decline", async (req, res, next) => {
  try {
    const email = req.headers.email;
    let user = await User.findOne({ email });
    if (user) {
      user.decline = req.body.status;
      user.isNew = false;
    } else {
      user = new User({
        email: email,
        decline: true,
      });
    }
    await user.save();
    return res.status(200).json({ msg: "Successfully declined!" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error!", err });
  }
});

module.exports = router;
