var express = require("express");
var router = express.Router();
import googleClient from "./../utils/google";
import base64url from "base64url";
import _ from "lodash";
var User = require("./../model/user");

router.get("/unread-count", async (req, res, next) => {
  try {
    const email = req.user.email;
    const token = req.user.token;
    const { date = "" } = req.query;
    const unreadMessages = await getUnRead(email, token, date);
    return res.status(200).json({
      msg: "Success",
      result: {
        unread_count: unreadMessages.length,
        unread_messages: unreadMessages,
        date: date,
      },
    });
  } catch (err) {
    console.log("~~~~~ Error in api: '/unread-count'", err);
    return res.status(500).json({ msg: "Server error", result: err });
  }
});

router.get("/unreply-count", async (req, res, next) => {
  try {
    const email = req.user.email;
    const token = req.user.token;
    const { date = "" } = req.query;
    const searchQuery = `in:sent ${process.env.STR_REPLYBY} ${date}`;
    const gmailClient = googleClient(token, email);
    const sentMessages = await gmailClient.searchMessages(email, {
      q: searchQuery,
    });
    const unRepliedMessages = await getUnReplied(email, token, date);

    const unreply = [];
    // console.log("~~~~~~~~~ sent messages", sentMessages);
    for (let i = 0; i < unRepliedMessages.length; i++) {
      const searchObj = _.find(sentMessages, {
        threadId: unRepliedMessages[i].threadId,
      });
      // console.log("~~~~~~ searchobj", searchObj);
      if (!searchObj) {
        unreply.push(unRepliedMessages[i]);
        continue;
      }
      const threadMsg = await gmailClient.getThread(searchObj.threadId, email);
      // console.log("~~~~~~ thread", threadMsg);
      if (threadMsg[threadMsg.length - 1].id === unRepliedMessages[i].id) {
        unreply.push(unRepliedMessages[i]);
        continue;
      }
    }

    return res.status(200).json({
      msg: "Success",
      result: {
        unreplied_count: unreply.length,
        unreplied_messages: unreply,
        date: date,
      },
    });
  } catch (err) {
    console.log("~~~~~ Error in api: '/unreply-count'", err);
    return res.status(500).json({ msg: "Server error", result: err });
  }
});

const getUnRead = async (email, token, date = "") => {
  try {
    const gmailClient = googleClient(token, email);
    const searchQuery = `in:inbox is:unread ${process.env.STR_READBY} ${date}`;
    const messages = await gmailClient.searchMessages(email, {
      q: searchQuery,
    });

    const newMessages = [];
    for (let i = 0; i < messages.length; i++) {
      if (
        await isIncludeTimelyMsg(email, token, messages[i].id, date, "read")
      ) {
        newMessages.push(messages[i]);
      }
    }
    return newMessages;
  } catch (err) {
    console.log("~~~~~ Error in getUnRead", err);
    return [];
  }
};

const getUnReplied = async (email, token, date = "") => {
  try {
    const gmailClient = googleClient(token, email);
    const searchQuery = `in:inbox  ${process.env.STR_REPLYBY} ${date}`;
    const messages = await gmailClient.searchMessages(email, {
      q: searchQuery,
    });

    const newMessages = [];
    for (let i = 0; i < messages.length; i++) {
      if (
        await isIncludeTimelyMsg(email, token, messages[i].id, date, "reply")
      ) {
        newMessages.push(messages[i]);
      }
    }
    return newMessages;
  } catch (err) {
    console.log("~~~~~ Error in getReply", err);
    return null;
  }
};

const isIncludeTimelyMsg = async (email, token, msgId, date, flag = "read") => {
  const gmailClient = googleClient(token, email);
  const message = await gmailClient.getMessage(msgId, email);

  //Decode message
  var strDecoded = base64url.decode(message);

  //Get message body
  const boundaryReg = /boundary="(.+)"/gi;
  const aryBoundary = Array.from(strDecoded.matchAll(boundaryReg));
  const strBoundary = aryBoundary[0][1];
  const messageReg = new RegExp(
    `--${strBoundary}[\\S\\s]*Content-Type: text\\/plain;([\\S\\s]*)--${strBoundary}[\\S\\s]*Content-Type: text\\/html;`,
    "gim"
  );
  const aryMessage = Array.from(strDecoded.matchAll(messageReg));
  const strMessage = aryMessage[0][1];

  //Remove repliedmessage
  const repliedMsgReg = /^((?!>).*)/gim;
  const repliedMsg = Array.from(strMessage.match(repliedMsgReg));
  const strRepliedMsg = repliedMsg.join("");

  //Remove forwardedmessage
  const forwardedMsgReg = /-+\sForwarded message\s-+([\S\s]*)/gim;
  const forwardedMsg = strRepliedMsg.replace(forwardedMsgReg, "");
  const timelyPattern = new RegExp(
    `@Timely:\\sPlease\\s${flag}\\sby\\s${date}`,
    "gim"
  );

  return timelyPattern.test(forwardedMsg);
};

// const getReadby = async (email, token, date = "") => {
//   try {
//     const gmailClient = googleClient(token, email);
//     const searchQuery = `in:inbox ${process.env.STR_READBY} ${date}`;
//     const messages = await gmailClient.searchMessages(email, {
//       q: searchQuery,
//     });
//     return messages;
//   } catch (err) {
//     console.log("~~~~~ Error in getReadby", err);
//     return [];
//   }
// };

// const getRead = async (email, token, date = "") => {
//   try {
//     const gmailClient = googleClient(token, email);
//     const searchQuery = `in:inbox is:read ${process.env.STR_READBY} ${date}`;
//     const messages = await gmailClient.searchMessages(email, {
//       q: searchQuery,
//     });
//     return messages;
//   } catch (err) {
//     console.log("~~~~~ Error in getRead", err);
//     return [];
//   }
// };

// const getReplyby = async (email, token, date = "") => {
//   try {
//     const gmailClient = googleClient(token, email);
//     const searchQuery = `in:inbox ${process.env.STR_REPLYBY} ${date}`;
//     const messages = await gmailClient.searchMessages(email, {
//       q: searchQuery,
//     });
//     console.log("~~~~~~~ received messages", messages);
//     return messages;
//   } catch (err) {
//     console.log("~~~~~ Error in getReplyby", err);
//     return [];
//   }
// };

// router.get("/readby-count", async (req, res, next) => {
//   try {
//     const email = req.user.email;
//     const token = req.user.token;
//     const { date = "" } = req.query;
//     const messages = await getReadby(email, token, date);
//     return res.status(200).json({
//       msg: "Success",
//       result: {
//         readby_count: messages.length,
//         readby_messages: messages,
//         date: date
//       }
//     });
//   } catch (err) {
//     console.log("~~~~~ Error in api: '/readby-count'", err);
//     return res.status(500).json({ msg: "Server error", result: err });
//   }
// });

// router.get("/read-count", async (req, res, next) => {
//   try {
//     const email = req.user.email;
//     const token = req.user.token;
//     const { date = "" } = req.query;
//     const readByMessages = await getReadby(email, token, date);
//     const readMessages = await getRead(email, token, date);
//     return res.status(200).json({
//       msg: "Success",
//       result: {
//         readby_count: readByMessages.length,
//         read_count: readMessages.length,
//         readby_messages: readByMessages,
//         read_messages: readMessages,
//         date: date
//       }
//     });
//   } catch (err) {
//     console.log("~~~~~ Error in api: '/read-count'", err);
//     return res.status(500).json({ msg: "Server error", result: err });
//   }
// });

// router.get("/replyby-count", async (req, res, next) => {
//   try {
//     const email = req.user.email;
//     const token = req.user.token;
//     const { date = "" } = req.query;
//     const messages = await getReplyby(email, token, date);
//     return res.status(200).json({
//       msg: "Success",
//       result: {
//         replyby_count: messages.length,
//         replyby_messages: messages,
//         date: date
//       }
//     });
//   } catch (err) {
//     console.log("~~~~~ Error in api: '/replyby-count'", err);
//     return res.status(500).json({ msg: "Server error", result: err });
//   }
// });

module.exports = router;
