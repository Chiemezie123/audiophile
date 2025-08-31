declare module "passport-google-oidc" {
  import { Strategy } from "passport";

  interface GoogleOIDCStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string | string[];
    passReqToCallback?: boolean;
  }

  interface GoogleOIDCProfile {
    id: string;
    displayName: string;
    name: {
      familyName: string;
      givenName: string;
    };
    emails: Array<{
      value: string;
      verified: boolean;
    }>;
    photos: Array<{
      value: string;
    }>;
  }

  type GoogleOIDCVerifyFunction = (
    issuer: string,
    profile: GoogleOIDCProfile,
    done: (error: any, user?: any) => void
  ) => void;

  class GoogleStrategy extends Strategy {
    constructor(
      options: GoogleOIDCStrategyOptions,
      verify: GoogleOIDCVerifyFunction
    );
  }

  export = GoogleStrategy;
}
