exports.googleCallback = (req, res) => {
  res.redirect("/");
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
};
