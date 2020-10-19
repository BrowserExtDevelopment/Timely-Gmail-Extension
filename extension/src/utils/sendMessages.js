import ext from "./ext";
import {
  MSG_CHECKAUTH,
  MSG_GET_READBY_COUNT,
  MSG_GET_REPLYBY_COUNT,
  MSG_DECLINE,
  MSG_SHOW_PAGE_ACTION
} from "./constant";

export const checkAuth = (email, callback) => {
  ext.runtime.sendMessage({ type: MSG_CHECKAUTH, data: email }, response => {
    callback(response);
  });
};

export const updateDecline = (email, status, callback) => {
  ext.runtime.sendMessage(
    { type: MSG_DECLINE, data: email, status: status },
    response => callback(response)
  );
};

export const getReadbyCount = email => {
  return new Promise((resolve, reject) => {
    try {
      ext.runtime.sendMessage(
        {
          type: MSG_GET_READBY_COUNT,
          data: email
        },
        res => {
          resolve(res);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const getReplybyCount = email => {
  return new Promise((resolve, reject) => {
    try {
      ext.runtime.sendMessage(
        {
          type: MSG_GET_REPLYBY_COUNT,
          data: email
        },
        res => {
          resolve(res);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const showPageAction = () => {
  ext.runtime.sendMessage({ type: MSG_SHOW_PAGE_ACTION });
};
