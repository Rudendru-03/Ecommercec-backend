const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config({ quiet: true });

const authRouter = require("./router/authRoutes");
const { connectDB, sequelize } = require("./config/db");

require("./services/passport");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(
  session({
    secret: "rudendru",
    resave: false,
    saveUninitialized: true,
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  // res.json({ Message: "Hello from Google OAUth" });
  res.send(
    req.user
      ? `<h1>Hello ${req.user.displayName}</h1><a href='/auth/logout'>Logout</a>`
      : `<h1>Home</h1><a href='/auth/google'>Login with Google</a>`,
  );
});

app.use("/auth", authRouter);

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log("Database & tables synced");

  app.listen(PORT, () => {
    console.log(`Server is running on the PORT: ${PORT}`);
  });
};

startServer();
