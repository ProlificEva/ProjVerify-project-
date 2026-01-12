import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Amplify } from 'aws-amplify';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));


Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_XXXXXXXXX',         // Replace with your User Pool ID
      userPoolClientId: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p' // Replace with your App Client ID
    }
  }
});