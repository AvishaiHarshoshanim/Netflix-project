const tokenService = require("../services/token");
const jwt = require("jsonwebtoken");
const key = require("../config/config").secretKey;
const User = require("../services/users");
// Function to create a new token
const generateToken = async (req, res) => {
  const userName = req.body.userName; // extract the values ​​of userName from the body of the request
  const password = req.body.password; // extract the values ​​of password from the body of the request

// Check if userName and password exist in the request body
if (!userName || !password) {
  return res.status(400).json({ error: "Missing userName or password in request body" });
}

  try {
    const token = await tokenService.createToken(userName, password);

    // Returning the token to the client
    res.status(200).json({ token: token }); // The token is returned to the client
  } catch (err) {
    res.status(401).json({ error: "Invalid username or password" });
  }
};
const processLogin = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const user = await User.getUserByName(userName);
    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    if (user.password === password) {
      const token = jwt.sign(
        { userName: user.userName, role: user.role || "user" }, // Default role "user"
        key,
        { expiresIn: "1h" }
      );

      return res.status(201).json({ token });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Error in processLogin:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { generateToken, processLogin };