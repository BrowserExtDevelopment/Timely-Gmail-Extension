import User from "./../model/user";

export const isAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.headers.email });
    if (!user) {
      console.log("User not in the DB ", req.headers.email);
      return res
        .status(401)
        .json({ msg: "Not Authenticated!", decline: false });
    }

    req.user = user;
    if (req.user.token) {
      return next();
    }

    console.log("User is not authenticated ", req.user);
    return res
      .status(401)
      .json({ msg: "Not Authenticated!", decline: req.user["decline"] });
  } catch (err) {
    return res.status(500).json({ msg: "Server error!", err });
  }
};
