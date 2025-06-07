import jwt from "jsonwebtoken";

export const googleAuthCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
};