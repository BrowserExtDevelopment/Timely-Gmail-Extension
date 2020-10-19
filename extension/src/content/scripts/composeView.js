import { statusBar } from "./statusBar";
import { readBy, replyBy } from "./htmlElments";
import { createDOM } from "./../../utils/helper";
import uniqueString from "unique-string";
import {
  REPLY_ID_PATTERN,
  READ_ID_PATTERN,
  FORWARDED_MSG_PATTERN,
  READ_REPLY_PATTERN,
  READ_PATTERN,
  REPLY_PATTERN
} from "./../../utils/constant";

class ComposeView {
  constructor(props) {
    this._composeView = props;
    this._timelyButtonClass = uniqueString();
    console.log("loaded ComposeView", props);
    this.init();
  }

  init = () => {
    this.addFeatures();

    this._composeView.on("destroy", event => this.onDestroy(event)); //Add Destroy Event

    this._composeView.on("sent", event => this.onSent(event)); //Add Sent Event
  };

  addFeatures = () => {
    this._composeView.addButton({
      title: "Timely",
      iconClass: this._timelyButtonClass,
      onClick: e => {}
    });

    const timelyButton = document
      .getElementsByClassName(`${this._timelyButtonClass}`)[0]
      .closest("td.inboxsdk__compose_actionToolbar");

    timelyButton.innerHTML = "";

    const handlers = {
      handlersReadBy: { add: this.addReadBy, remove: this.removeReadBy },
      handlersReplyBy: { add: this.addReplyBy, remove: this.removeReplyBy }
    };

    const initialStatus = {
      readBy: this.isExistReadBy(),
      replyBy: this.isExistReplyBy()
    };

    statusBar(timelyButton, handlers, initialStatus);
  };

  /**
   *Destroy Event for ComposeView
   * @param { object | { messageID: string, closedByInboxSDK: boolean } } event
   */
  onSent = event => {
    console.log(event);
  };

  /**
   *Destroy Event for ComposeView
   * @param { object | { messageID: string, closedByInboxSDK: boolean } } event
   */
  onDestroy = event => {
    console.log(event);
  };

  addReplyBy = date => {
    this.addTimelyInEmail(replyBy(date.format("YYYY-MM-DD")));
  };

  removeReplyBy = () => {
    this.removeTimelyInEmail(REPLY_PATTERN);
  };

  addReadBy = date => {
    this.addTimelyInEmail(readBy(date.format("YYYY-MM-DD")));
  };

  removeReadBy = () => {
    this.removeTimelyInEmail(READ_PATTERN);
  };

  isExistReadBy = () => {
    const strEmailBody = this.getBodyInEmail();
    return strEmailBody.match(READ_PATTERN) ? true : false;
  };

  isExistReplyBy = () => {
    const strEmailBody = this.getBodyInEmail();
    return strEmailBody.match(REPLY_PATTERN) ? true : false;
  };

  addTimelyInEmail = str => {
    let emailBody = this._composeView.getBodyElement();
    const forwarded_msg = emailBody.innerHTML.match(FORWARDED_MSG_PATTERN);
    if (forwarded_msg) {
      emailBody.innerHTML = emailBody.innerHTML.replace(
        FORWARDED_MSG_PATTERN,
        `$1<br>${str}$2`
      );
    } else {
      emailBody.innerHTML = `${emailBody.innerHTML}<br>${str}`;
    }
  };

  getBodyInEmail = () => {
    let emailBody = this._composeView.getBodyElement();
    const forwarded_msg = emailBody.innerHTML.match(FORWARDED_MSG_PATTERN);
    if (forwarded_msg) {
      return forwarded_msg[0].replace(FORWARDED_MSG_PATTERN, "$1");
    } else {
      return emailBody.innerHTML;
    }
  };

  removeTimelyInEmail = pattern => {
    let strEmailBody = this.getBodyInEmail();
    strEmailBody = strEmailBody.replace(pattern, "");
    let emailBody = this._composeView.getBodyElement();
    const forwarded_msg = emailBody.innerHTML.match(FORWARDED_MSG_PATTERN);
    if (forwarded_msg) {
      emailBody.innerHTML = forwarded_msg[0].replace(
        FORWARDED_MSG_PATTERN,
        `${strEmailBody}$2`
      );
    } else {
      emailBody.innerHTML = strEmailBody;
    }
  };
}

export const composeView = props => {
  return new ComposeView(props);
};
