import {CognitoIdentityProviderClient, InitiateAuthCommand} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({region: 'eu-west-1'});

export async function testLogin(email: string, password: string) {
    const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: "41th1hn5fqt9cve32ilr8k4ots",
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    })
    const result = await client.send(command)
    console.log("COGNITO_RESULT", result);
}
