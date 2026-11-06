require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "development-only-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

const otpStore = new Map(); // use Redis/database in production

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

const hash = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

// Limit OTP requests: 5 per 15 minutes per IP
const sendLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

// Send OTP
app.post("/auth/send-otp", sendLimiter, async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Enter a valid email" });
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  otpStore.set(email, {
    hash: hash(otp),
    expires: Date.now() + 5 * 60 * 1000,
    attempts: 0,
  });

  try {
    const transporter = getTransporter();
    if (!transporter) {
      return res.status(503).json({ error: "Email delivery is not configured" });
    }
    await transporter.sendMail({
      from: `"Your Site" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your login code",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });
    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not send email" });
  }
});

// Verify OTP
app.post("/auth/verify-otp", (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const otp = (req.body.otp || "").trim();
  const record = otpStore.get(email);

  if (!record || Date.now() > record.expires) {
    return res.status(400).json({ error: "OTP expired or not found" });
  }
  if (++record.attempts > 5) {
    otpStore.delete(email);
    return res.status(429).json({ error: "Too many attempts. Request a new OTP." });
  }
  const expectedHash = hash(otp);
  if (!crypto.timingSafeEqual(Buffer.from(record.hash, "hex"), Buffer.from(expectedHash, "hex"))) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  otpStore.delete(email);
  req.session.user = { email }; // user is now logged in
  res.json({ message: "Logged in" });
});

// Example protected route
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.status(401).send("Please log in first");
  res.send(`Welcome, ${req.session.user.email}`);
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => console.log(`OTP auth demo running on http://localhost:${port}`));
