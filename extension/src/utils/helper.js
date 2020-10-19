import { GMAIL_URL_PATTERN } from "./constant";

/**
 * Convert string to html object
 * @param { html string } string
 * @returns { html object }
 */
export const createDOM = string => {
  var temp = document.createElement("div");
  temp.innerHTML = string;
  var htmlObject = temp.firstChild;
  return htmlObject;
};

export const findParentBySelector = selector => {
  var all = document.querySelectorAll(selector);
  var cur = this.element.parentNode;
  while (cur && !collectionHas(all, cur)) {
    //keep going up until you find a match
    cur = cur.parentNode; //go up
  }
  return cur; //will return null if not found
};

/**
 * check to include a element
 *
 * @param { all element } a
 * @param { element to find } b
 * @returns { boolean }
 */
const collectionHas = (a, b) => {
  for (var i = 0, len = a.length; i < len; i++) {
    if (a[i] == b) return true;
  }
  return false;
};

export const getGmailURL = () => {
  let url = window.location.href;
  url = url.match(GMAIL_URL_PATTERN);
  if (!url) return "";
  return url[0];
};
