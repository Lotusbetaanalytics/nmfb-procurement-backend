const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan");
const colors = require("colors");
// const dotenv = require("dotenv").config();
const dotenv = require("dotenv").config({ path: "./config/.env" });
const cors = require("cors");
const errorHandler = require("./middleware/error");
const rateLimit = require("express-rate-limit");
const express = require("express");
const connectDB = require("./config/db");

// // //load env vars
// // dotenv.config({ path: "./config/.env" });

// import routes
// TODO: Add Routes
const auth  = require("./routes/auth")
const staff = require("./routes/staff")
const role  = require("./routes/role")
const team  = require("./routes/team")
const budgetLineItem  = require("./routes/budgetLineItem")
const contract  = require("./routes/contract")
const contractEvaluation  = require("./routes/contractEvaluation")
const contractType  = require("./routes/contractType")
const evaluationTemplate  = require("./routes/evaluationTemplate")
const projectCategory  = require("./routes/projectCategory")
const projectInitiation  = require("./routes/projectInitiation")
const projectOnboarding  = require("./routes/projectOnboarding")
const projectTask  = require("./routes/projectTask")
const projectType  = require("./routes/projectType")
const log  = require("./routes/log")

// configure express
const app = express();

//connection to the db
connectDB();

// set up app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"))

//Sanitize data
app.use(mongoSanitize());

//set security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);
app.use(cors());

// configure routes
// TODO: app.use routes
app.use("/api/v1/auth", auth)
app.use("/api/v1/staff", staff)
app.use("/api/v1/role", role)
app.use("/api/v1/team", team)
app.use("/api/v1/budgetLineItem", budgetLineItem)
app.use("/api/v1/contract", contract)
app.use("/api/v1/contractEvaluation", contractEvaluation)
app.use("/api/v1/contractType", contractType)
app.use("/api/v1/evaluationTemplate", evaluationTemplate)
app.use("/api/v1/projectCategory", projectCategory)
app.use("/api/v1/projectInitiation", projectInitiation)
app.use("/api/v1/projectOnboarding", projectOnboarding)
app.use("/api/v1/projectTask", projectTask)
app.use("/api/v1/projectType", projectType)
app.use("/api/v1/log", log)

app.use(errorHandler);

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/public');
app.set('view engine', 'html');

app.get('/*', function(req, res) {
  if (req.xhr) {
    var pathname = url.parse(req.url).pathname;
    res.sendfile('index.html', {root: __dirname + '/public' + pathname});
  } else {
    res.render('index');
  }
});

// Error handling
app.use((req, res) => {
  res.status(400).json({
    success: false,
    message: 'Page not found!'
  });
});

app.get("/", (req, res) => {
  return res.status(200).json({ msg: "SDLC Compliance App" });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.yellow)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  server.close(() => process.exit(1));
});
