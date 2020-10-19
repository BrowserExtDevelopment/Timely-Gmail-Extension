import { google } from "googleapis";
import User from "./../model/user";
class GoogleClient {
  constructor(tokens = null, domain = null) {
    this._oAuthOptions = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectURI: process.env.GOOGLE_REDIRECT_URI,
    };

    console.log("Domain: ", domain);
    // if (domain != null && domain.indexOf("simulateanything.com") >= 0) {
    //   console.log("Switching auth tokens for internal app");
    //   this._oAuthOptions = {
    //     clientId: "15064503013-j8k85b6dbv4harog4tjmmj90nbef4ivi.apps.googleusercontent.com",
    //     clientSecret: "_LV_JojWL-dRWF-vbKBe-crz",
    //     redirectURI: process.env.GOOGLE_REDIRECT_URI
    //   }
    // } else
    // if (domain != null && domain.indexOf("loctoc.com") >= 0) {
    //   console.log("Switching auth tokens for internal app");
    //   this._oAuthOptions = {
    //     clientId: "330760698146-6h8btn9qa637pp6ldkmc1qp8706tvh8e.apps.googleusercontent.com",
    //     clientSecret: "yVLbfcITSXHaPqNAeu4LMGDS",
    //     redirectURI: process.env.GOOGLE_REDIRECT_URI
    //   }
    // }

    this._scopes = ["https://www.googleapis.com/auth/gmail.readonly"];

    this._oAuthClient = new google.auth.OAuth2(
      this._oAuthOptions.clientId,
      this._oAuthOptions.clientSecret,
      this._oAuthOptions.redirectURI
    );
    this._tokens = tokens;
    this._oAuthAPIClient = null;
    this._oGmailAPIClient = null;
    this.authorize();
  }

  getOAuthURI = (email) => {
    return this._oAuthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: this._scopes,
      state: email,
    });
  };

  getOAuthTokenFromCode = async (code) => {
    try {
      const res = await this._oAuthClient.getToken(code);
      this._tokens = {
        access_token: res.tokens.access_token,
        refresh_token: res.tokens.refresh_token,
      };
      return this._tokens;
    } catch (err) {
      console.log("~~~~~ Error in getOAuthTokenFromCode", err);
      return null;
    }
  };

  authorize = async (tokens = null) => {
    if (tokens) {
      this._tokens = tokens;
    }
    if (!this._tokens) {
      return;
    }
    this._oAuthClient.setCredentials(this._tokens);
    this._oAuthAPIClient = google.oauth2({
      auth: this._oAuthClient,
      version: "v2",
    });
    this._oGmailAPIClient = google.gmail({
      version: "v1",
      auth: this._oAuthClient,
    });
  };

  getAccessTokenFromRefresh = async () => {
    this._oAuthClient.setCredentials({
      refresh_token: this._tokens.refresh_token,
    });
    const res = await this._oAuthClient.getAccessToken();
    this._tokens = {
      access_token: res.res.data.access_token,
      refresh_token: res.res.data.refresh_token,
    };
    return this._tokens;
  };

  getUserInfo = async () => {
    if (!this._tokens) {
      return null;
    }
    this.authorize();
    const { data } = await this._oAuthAPIClient.userinfo.get();
    return data;
  };

  searchMessages = async (userId, options = {}) => {
    try {
      if (!this._oGmailAPIClient) {
        return null;
      }
      const { data } = await this._oGmailAPIClient.users.messages.list({
        ...options,
        userId,
      });
      return data.messages ? data.messages : [];
    } catch (err) {
      console.log("~~~~~ Error in searchMessages", err.response.data.error);
      if (
        err.response &&
        err.response.data &&
        err.response.data.error === "invalid_grant"
      ) {
        User.findOneAndDelete({ email: userId }, function (err) {
          if (err) console.log(err);
          console.log("Successful deletion");
        });
      }
      return [];
    }
  };

  getMessage = async (msgId, userId, format = "raw") => {
    try {
      if (!this._oGmailAPIClient) {
        return null;
      }
      const { data } = await this._oGmailAPIClient.users.messages.get({
        id: msgId,
        userId,
        format,
      });
      return data.raw ? data.raw : "";
    } catch (err) {
      console.log("~~~~~ Error in getMessage", err.response.data.error);
      if (
        err.response &&
        err.response.data &&
        err.response.data.error === "invalid_grant"
      ) {
        User.findOneAndDelete({ email: userId }, function (err) {
          if (err) console.log(err);
          console.log("Successful deletion");
        });
      }
      return "";
    }
  };

  getThread = async (threadId, userId, format = "minimal") => {
    try {
      if (!this._oGmailAPIClient) {
        return null;
      }
      const { data } = await this._oGmailAPIClient.users.threads.get({
        id: threadId,
        userId,
        format,
      });
      return data.messages ? data.messages : [];
    } catch (err) {
      console.log("~~~~~ Error in searchMessages", err.response.data.error);
      if (
        err.response &&
        err.response.data &&
        err.response.data.error === "invalid_grant"
      ) {
        User.findOneAndDelete({ email: userId }, function (err) {
          if (err) console.log(err);
          console.log("Successful deletion");
        });
      }
      return [];
    }
  };
}

export default (token = null, domain = null) => {
  return new GoogleClient(token, domain);
};
