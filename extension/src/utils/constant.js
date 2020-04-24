export const API_CHECK_AUTH = "/users/check-auth";
export const API_GET_READ_COUNT = "/api/mail/unread-count";
export const API_GET_REPLY_COUNT = "/api/mail/unreply-count";
export const API_DECLINE = "/users/decline";

//Message Types
export const MSG_VAL_EMAIL = 10001;
export const MSG_GOAUTH = 10002;
export const MSG_CHECKAUTH = 10003;
export const MSG_GET_READBY_COUNT = 10004;
export const MSG_GET_REPLYBY_COUNT = 10005;
export const MSG_DECLINE = 10006;
export const MSG_SHOW_PAGE_ACTION = 10007;

export const UNCHECKED = 0;
export const CHECKING = 1;
export const CHECKED = 2;

export const REPLY_ID_PATTERN = /(m_(-)?\d+)*(timely_reply_by)/gi;
export const READ_ID_PATTERN = /(m_(-)?\d+)*(timely_read_by)/gi;
export const GMAIL_URL_PATTERN = /(^https:\/\/mail.google.com\/mail\/u\/(\d)+\/)/gi;
export const FORWARDED_MSG_PATTERN = /(.*)(<br>((?!<br>).)*-+\sForwarded message\s-+.*)/gi;
export const READ_REPLY_PATTERN = /<br>((?!<br>).)*@Timely:\sPlease\s(reply|read)\sby\s((?!<br>).)*/gi;
export const REPLY_PATTERN = /<br>((?!<br>).)*@Timely:\sPlease\sreply\sby\s((?!<br>).)*/gi;
export const READ_PATTERN = /<br>((?!<br>).)*@Timely:\sPlease\sread\sby\s((?!<br>).)*/gi;

export const SEARCHBAR_SELECTOR = "[role='search']";
