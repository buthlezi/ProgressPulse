import { Amplify} from 'aws-amplify';

Amplify.configure({
  Auth: {   
    Cognito : {
        userPoolId: 'eu-west-1_QXx8z3uxF',
        userPoolClientId: '41th1hn5fqt9cve32ilr8k4ots',    }
  }
});

