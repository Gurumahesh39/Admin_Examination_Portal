const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    let token;

    //Check header exists and format is correct
    if (req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");

      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }
    // No token
    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    //Verify token
    const decoded = jwt.verify(
      token, process.env.JWT_SECRET || "secret");
    // Attach user
    req.user = decoded;
    next();

  } catch (err) {
    console.log("Auth Error:", err.message);

    //Token expired
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    // Invalid token
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;