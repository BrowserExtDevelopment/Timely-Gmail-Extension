import React from "react";
import ReactDOM from "react-dom";
import { composeView } from "./composeView.js";
import { checkAuth, updateDecline } from "utils/sendMessages.js";
import { SEARCHBAR_SELECTOR } from "./../../utils/constant";
import ext from "./../../utils/ext";

import TimelyBar from "./../components/TimelyBar";

/**
 * Define InboxSDK functions
 * @type { class }
 */

export class CGmailSDK {
  _oAuthWindow = null;
  _oAuthTimer = null;
  constructor() {
    InboxSDK.load(1, "sdk_timely_d3496bacbf").then(sdk =>
      this.loadInboxSDK(sdk)
    );
    this.handleCheckAuth = this.handleCheckAuth.bind(this);
  }

  static _iSDK = null;
  static _gSDK = null;
  /**
   * Load functions in InboxSDK
   * @param {object} sdk
   * @returns {void}
   */
  loadInboxSDK = sdk => {
    console.log("loaded InboxSDK", sdk);
    CGmailSDK._iSDK = sdk;
    checkAuth(CGmailSDK._iSDK.User.getEmailAddress(), this.handleCheckAuth);
  };

  handleCheckAuth = res => {
    if (res.isAuth) {
      this.registerHandlers();
      this.addFeatures();
    } else if (!res.decline) {
      this.showGoogleAuthModal();
    }
  };

  handleCheckDeclined = res => {
    if (!res) {
      this.showGoogleAuthModal();
    }
  };

  addFeatures = () => {
    const searchBar = document.querySelector(SEARCHBAR_SELECTOR).parentNode;
    var searchBarView = document.createElement("div");
    searchBarView.setAttribute(
      "style",
      "display:flex; flex-direction:row; justify-content: flex-start; width: 100%;"
    );
    searchBar.parentNode.insertBefore(searchBarView, searchBar.nextSibling);
    ReactDOM.render(<TimelyBar />, searchBarView);
  };

  showGoogleAuthModal = () => {
    var icon = `<img src="${ext.runtime.getURL(
      "assets/img/btn_google_dark_normal_ios.svg"
    )}" style="position:absolute;left:-2px;">Sign in with Google`;

    var auth_modal = CGmailSDK._iSDK.Widgets.showModalView({
      el: "Please authenticate with Google Account to use this extension!",
      title: "Timely",
      buttons: [
        {
          text: "",
          title: `Sign in with Google`,
          onClick: () => {
            this.goGoogleAuth();
            auth_modal.close();
          },
          type: "PRIMARY_ACTION"
        },
        {
          text: "Not Now",
          title: "Cancel",
          onClick: function() {
            auth_modal.close();
          },
          type: "SECONDARY"
        },
        {
          text: "Never",
          title: "Never",
          onClick: function() {
            updateDecline(CGmailSDK._iSDK.User.getEmailAddress(), true, res => {
              auth_modal.close();
            });
          },
          type: "SECONDARY"
        }
      ]
    });

    const SigninButton = document.querySelector(
      ".inboxsdk__modal_container .inboxsdk__modal_buttons button"
    );
    SigninButton.innerHTML = icon;
    SigninButton.setAttribute(
      "style",
      "height:42px;letter-spacing:0.2px;font-family:Roboto;padding-left: 50px;"
    );
  };

  /**
   * register Handlers of InboxSDK
   */
  registerHandlers = () => {
    // Register New composeviews
    CGmailSDK._iSDK.Compose.registerComposeViewHandler(compVw => {
      composeView(compVw);
    });
  };

  goGoogleAuth = () => {
    var oAuthURL = `${AUTH_URL}/${CGmailSDK._iSDK.User.getEmailAddress()}`;
    this._oAuthWindow = window.open(
      oAuthURL,
      "SomeAuthentication",
      "width=500,height=660,modal=yes,alwaysRaised=yes"
    );
    this._oAuthTimer = setInterval(() => {
      if (!this._oAuthWindow || !this._oAuthWindow.closed) return;
      clearInterval(this._oAuthTimer);
      window.location.reload();
    }, 100);
  };
}

export const inboxSDK = () => {
  return new CGmailSDK();
};
