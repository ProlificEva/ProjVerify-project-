const { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand } = require("@aws-sdk/client-cognito-identity-provider");
require('dotenv').config();

// Initialize the Cognito Client
const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

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
            { Name: "custom:department", Value: department }
        ]
    };

    try {
        const command = new SignUpCommand(params);
        const response = await client.send(command);
        res.status(200).json({ message: "User registered successfully!", data: response });
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
            PASSWORD: password
        }
    };

    try {
        const command = new InitiateAuthCommand(params);
        const response = await client.send(command);
        // Returns the ID Token which the frontend will use for authorization
        res.status(200).json({ 
            token: response.AuthenticationResult.IdToken,
            message: "Login successful" 
        });
    } catch (err) {
        res.status(401).json({ error: "Invalid email or password" });
    }
};