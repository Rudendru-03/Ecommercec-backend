const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config({ quiet: true });

const authRouter = require("./router/authRoutes");
const userRouter = require("./router/userRoutes");
const productRouter = require("./router/productRoutes");
const categoryRouter = require("./router/categoryRoutes");
const cartRouter = require("./router/cartRoutes");
const wishlistRouter = require("./router/wishlistRoutes");
const orderRouter = require("./router/orderRoutes");
const paymentRouter = require("./router/paymentRoutes");
const discountRouter = require("./router/discountRoutes");
const inventoryRouter = require("./router/inventoryRoutes");
const adminRouter = require("./router/adminRoutes");
const uploadRouter = require("./router/uploadRoutes");
const { connectDB, sequelize } = require("./config/db");

require("./services/passport");
require("./model/Category");
require("./model/Product");
require("./model/Address");
require("./model/Order");
require("./model/CartItem");
require("./model/ProductImage");
require("./model/WishlistItem");
require("./model/ProductVariant");
require("./model/Review");
require("./model/OrderTracking");
require("./model/OrderItem");
require("./model/InventoryLog");
require("./model/Payment");
require("./model/DiscountCode");
require("./model/OrderDiscountUsage");

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
      ? `<h1>Hello ${req.user.name}</h1><a href='/auth/logout'>Logout</a>`
      : `<h1>Home</h1><a href='/auth/google'>Login with Google</a>`,
  );
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.use("/orders", orderRouter);
app.use("/payments", paymentRouter);
app.use("/discounts", discountRouter);
app.use("/inventory", inventoryRouter);
app.use("/admin", adminRouter);
app.use("/upload", uploadRouter);

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log("Database & tables synced");

  app.listen(PORT, () => {
    console.log(`Server is running on the PORT: ${PORT}`);
  });
};

startServer();
