const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
require("dotenv").config();

// Initialize the Cognito Client
const client = new CognitoIdentityProviderClient({
  region: process.env.REGION_COGNITO|| "us-west-1",
});

// Logic for User Registration
exports.register = async (req, res) => {
  const { email, password, name, role, department } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: name },
      { Name: "custom:role", Value: role },
      { Name: "custom:department", Value: department },
    ],
  };

  try {
    const command = new SignUpCommand(params);
    const response = await client.send(command);
    res
      .status(200)
      .json({ message: "User registered successfully!", data: response });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Logic for User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const response = await client.send(command);
    // Returns the ID Token which the frontend will use for authorization
    res.status(200).json({
      token: response.AuthenticationResult.IdToken,
      message: "Login successful",
    });
  } catch (err) {
    console.error("DEBUG LOGIN ERROR:", err); // Look at your terminal for this!
    res.status(401).json({ 
        error: err.message, // This will tell you exactly what's wrong
        code: err.__type 
    });
  }
};



exports.confirmRegistration = async (req, res) => {
  const { email, code } = req.body; // The 6-digit code from the email

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  };

  try {
    const command = new ConfirmSignUpCommand(params);
    await client.send(command);
    res.status(200).json({ message: "Account confirmed! You can now log in." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
