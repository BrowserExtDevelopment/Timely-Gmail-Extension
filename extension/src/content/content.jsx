/* global document */

import React from "react";
import ReactDOM from "react-dom";
import { CGmailSDK, inboxSDK } from "./scripts/sdk.js";
import {
  showPageAction,
  updateDecline,
  checkAuth
} from "./../utils/sendMessages";
import ext from "./../utils/ext";
import { MSG_DECLINE } from "./../utils/constant";

const handleCheckAuth = res => {
  if (!CGmailSDK._iSDK) {
    return;
  }

  console.log("Received auth message ", res);
  if (res.isAuth) {
    return;
  }

  if (!res.decline) {
    return window.location.reload();
  }

  updateDecline(CGmailSDK._iSDK.User.getEmailAddress(), false, res => {
    window.location.reload();
  });
};

const onRequest = (request, sender, reply) => {
  if (!CGmailSDK._iSDK) {
    reply();
  }
  switch (request.type) {
    case MSG_DECLINE: {
      checkAuth(CGmailSDK._iSDK.User.getEmailAddress(), handleCheckAuth);
      break;
    }
  }

  return true;
};

ext.runtime.onMessage.addListener(onRequest);

class Main extends React.Component {
  constructor(props) {
    super(props);
    showPageAction();
    inboxSDK();
  }

  render() {
    return <></>;
  }
}

const app = document.createElement("div");
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
