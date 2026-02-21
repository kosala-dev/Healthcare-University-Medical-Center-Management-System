const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const patientmodel = require("../models/patient");
const adminmodel = require("../models/admin");
const superadminmodel = require("../models/superadmin");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Allow only university domains
        if (
          !email.endsWith("@vau.ac.lk") &&
          !email.endsWith("@stu.vau.ac.lk")
        ) {
          return done(null, false, { message: "University email required" });
        }

        // Superadmin/admin schemas in this project are username-based.
        const superadmin = await superadminmodel.findOne({
          $or: [{ email }, { username: email }],
        });
        if (superadmin) {
          return done(null, { email, role: "superadmin" });
        }

        const admin = await adminmodel.findOne({
          $or: [{ email }, { username: email }],
        });
        if (admin) {
          return done(null, { email, role: admin.admintype });
        }

        const patient = await patientmodel.findOne({ email });
        if (patient) {
          return done(null, { email, role: "patient" });
        }

        return done(null, false, { message: "User not registered" });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
