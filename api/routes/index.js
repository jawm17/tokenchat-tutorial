const path = require("path");
const router = require("express").Router();
const tokenRouter = require("./tokenRouter.js");
const userRouter = require("./userRouter.js");
const messageRouter = require("./messageRouter.js");

// API Routes
router.use("/api", userRouter);
router.use("/api/token", tokenRouter);
router.use("/api/message", messageRouter);

// If no API routes are hit, send the React app
// router.use('*',function(req, res) {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

module.exports = router;