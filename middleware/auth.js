const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "id",
  clientId: process.env.COGNITO_CLIENT_ID,
  
});

const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    const payload = await verifier.verify(token);
    req.user = payload; 
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ 
        message: "Unauthorized: Invalid token", 
        error: err.message // This will now help if there are other issues
    });
  }
};

module.exports = { checkAuth };