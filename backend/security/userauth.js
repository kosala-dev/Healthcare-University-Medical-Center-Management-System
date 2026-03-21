const jwt = require("jsonwebtoken");

const verifyPatient = async (req, res, next) => {
  const token = req.cookies.token; //frontend part
  /*const authHeader = req.headers["authorization"]; //postman part
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];*/
  if (!token) {
    return res.json({ message: "Enter Patient Token" });
  } else {
    jwt.verify(token, process.env.PATIENT_KEY, (err, decoded) => {
      if (err) {
        return res.json({ message: "Invalid  Patient Token" });
      } else {
        req.username = decoded.username || decoded.email;
        req.role = decoded.role;
        next();
      }
    });
  }
};
module.exports = verifyPatient;
