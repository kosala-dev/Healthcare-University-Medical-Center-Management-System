const jwt = require("jsonwebtoken");

const verifyAdmin = async (req, res, next) => {
  const token = req.cookies.token; //frontend part
  /*const authHeader = req.headers["authorization"]; //postman part
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];*/
  if (!token) {
    return res.json({ message: "Enter Admin Token" });
  } else {
    jwt.verify(token, process.env.Admin_key, (err, decoded) => {
    if (err) {
        // ... handle error
    } else {
        req.role = decoded.role;
        req.username = decoded.username;
        req.designation = decoded.designation; // 🆕 NEW: Attach the designation
        next();
    }
    });
  }
};
module.exports = verifyAdmin;
