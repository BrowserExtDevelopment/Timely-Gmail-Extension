export const readBy = date =>
  `<div id="timely_read_by" style="margin-bottom:2px; border: 1px solid #f2c6bf;border-radius: 3px;background-color: #ffc;" contenteditable="false" readonly>@Timely: Please read by <span>${date}. Powered by <a href="https://gettimely.email/"> Timely Mail</a></span></div>`;
export const replyBy = date =>
  `<div id="timely_reply_by" style="margin-bottom:2px; border: 1px solid #f2c6bf;border-radius: 3px;background-color: #ffc;" contenteditable="false" readonly>@Timely: Please reply by <span>${date}. Powered by <a href="https://gettimely.email/"> Timely Mail</a></span></div>`;
export const markToReply = date =>
  `<div id="timely_mark_to_reply" style="margin-bottom:2px; border: 1px solid #f2c6bf;border-radius: 3px;background-color: #ffc;" contenteditable="false" readonly>@Timely: Please mark to reply <span>${date}. Powered by <a href="https://gettimely.email/"> Timely Mail</a></span></div>`;