import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MarkunreadOutlinedIcon from "@material-ui/icons/MarkunreadOutlined";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

import { CGmailSDK } from "./../../scripts/sdk";

import { getReadbyCount } from "./../../../utils/sendMessages";
import { getGmailURL } from "./../../../utils/helper";
import moment from "moment";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";

const StyledButton = withStyles(theme => ({
  root: {
    textTransform: "none",
    border: "0px",
    "&:hover": {
      border: "0px"
    },
    "&:active": {
      border: "0px"
    },
    "&:focus": {
      border: "0px"
    }
  }
}))(Button);

const ReadByButton = (props, ref) => {
  const [readCount, setReadCount] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const [isUpdateRead, setUpdateRead] = React.useState(true);

  React.useEffect(() => {
    if (isUpdateRead && !isLoading) {
      setLoading(true);
      setUpdateRead(false);
      getReadbyCount(CGmailSDK._iSDK.User.getEmailAddress())
        .then(({ data }) => {
          const { result } = data;
          setReadCount(result.unread_count);
          setLoading(false);
          updateReadCount();
        })
        .catch(err => {
          setLoading(false);
          setReadCount(0);
          updateReadCount();
        });
    }
  }, [isUpdateRead]);

  const updateReadCount = () => {
    setTimeout(() => {
      setUpdateRead(true);
    }, 6000);
  };

  const handleClickButton = () => {
    const date = moment().format("YYYY-MM-DD");
    window.location.href = `${getGmailURL()}#search/in%3Ainbox+%40Timely%3A+Please+read+by+${date}`;
  };

  return (
    <Badge badgeContent={readCount} color="primary">
      <StyledButton variant="outlined" onClick={handleClickButton}>
        To Read
      </StyledButton>
    </Badge>
  );
};
export default ReadByButton;
