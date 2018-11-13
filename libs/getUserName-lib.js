export function getUserName(event) {
  return(
    event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
  );
}