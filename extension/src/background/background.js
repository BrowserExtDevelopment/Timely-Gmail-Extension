import ext from "./../utils/ext";
import {
  API_GET_READ_COUNT,
  API_GET_REPLY_COUNT,
  API_CHECK_AUTH,
  API_DECLINE,
  MSG_CHECKAUTH,
  MSG_GET_READBY_COUNT,
  MSG_GET_REPLYBY_COUNT,
  MSG_DECLINE,
  MSG_SHOW_PAGE_ACTION
} from "./../utils/constant";
import moment from "moment";
import axios from "axios";

/**
 * Define content script functions
 * @type {class}
 */
class Background {
  constructor() {
    this.init();
  }

  /**
   * Document Ready
   * @returns {void}
   */
  init = () => {
    console.log("loaded Background Scripts");

    //Add message listener in Browser.
    ext.runtime.onMessage.addListener(this.onMessage);

    //Add page action listener in Browser
    ext.pageAction.onClicked.addListener(this.onClickedExtension);
  };

  /**
   * Create a new api request object
   */
  axiosInstance = email =>
    axios.create({
      baseURL: BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
        email: email
      },
      transformRequest: [
        (data, headers) => {
          console.log("===== request header from client =====", headers);
          console.log("===== request data from client=====", data);
          return data;
        }
      ],
      transformResponse: [
        data => {
          let resp;

          try {
            resp = JSON.parse(data);
          } catch (error) {
            throw Error(
              `[requestClient] Error parsing response JSON data - ${JSON.stringify(
                error
              )}`
            );
          }
          console.log("===== response data from server =====", resp);
          return resp;
        }
      ],
      timeout: 30000,
      validateStatus: status => {
        console.log("===== response status code from server =====", status);
        return status >= 200 && status < 300; // default
      }
    });

  //TODO: Listeners

  /**
   * installed timely chrome extension
   */
  onInstalled = () => {
    console.log("installed timely extension");
  };

  /**
   * Clicked browser action
   */
  onClickedExtension = tab => {
    console.log("~~~~~~~ Clicked extension icon", tab);
    ext.tabs.sendMessage(tab.id, { type: MSG_DECLINE });
  };

  /**
   * Message Handler Function
   * @param { object } message
   * @param { object } sender
   * @param { object } reply
   */
  onMessage = (message, sender, reply) => {
    switch (message.type) {
      case MSG_CHECKAUTH: {
        this.axiosInstance(message.data)
          .post(API_CHECK_AUTH)
          .then(res => {
            reply({ isAuth: true, decline: res.data.decline });
          })
          .catch(err => {
            reply({
              isAuth: false,
              decline: err.response.data.decline
            });
          });
        break;
      }
      case MSG_GET_READBY_COUNT: {
        const date = moment().format("YYYY-MM-DD");
        this.axiosInstance(message.data)
          .get(API_GET_READ_COUNT, {
            params: {
              date: date
            }
          })
          .then(res => {
            reply(res);
          })
          .catch(err => {
            reply(null);
          });
        break;
      }
      case MSG_GET_REPLYBY_COUNT: {
        const date = moment().format("YYYY-MM-DD");
        this.axiosInstance(message.data)
          .get(API_GET_REPLY_COUNT, {
            params: {
              date: date
            }
          })
          .then(res => {
            reply(res);
          })
          .catch(err => {
            reply(null);
          });
        break;
      }
      case MSG_DECLINE: {
        this.axiosInstance(message.data)
          .post(
            API_DECLINE,
            JSON.stringify({
              status: message.status
            })
          )
          .then(res => {
            reply(true);
          })
          .catch(err => {
            reply(false);
          });
        break;
      }
      case MSG_SHOW_PAGE_ACTION: {
        ext.pageAction.show(sender.tab.id);
        reply(true);
        break;
      }
    }
    return true;
  };
}

export const background = new Background();
