import React from "react";
import ReactDOM from "react-dom";
import StatusBar from "./../components/StatusBar";

import ext from "./../../utils/ext";

class StatusBarView {
  /**
   * @param statusBarView
   * @param {handlersReadBy:{}, handlersReplyBy:{}} handlers
   */
  constructor(statusBarView, handlers, initialStatus) {
    var statusBarViewEl = document.createElement("div");
    this._statusBarView = statusBarView;

    ReactDOM.render(
      <StatusBar handlers={handlers} initialStatus={initialStatus} />,
      statusBarViewEl
    );
    this._statusBarView.append(statusBarViewEl);
  }
}

export const statusBar = (statusBarView, handlers, initialStatus) => {
  return new StatusBarView(statusBarView, handlers, initialStatus);
};
