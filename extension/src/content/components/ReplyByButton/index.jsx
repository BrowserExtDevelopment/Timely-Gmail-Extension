import React from "react";
import IconButton from "@material-ui/core/IconButton";
import ReplyOutlinedIcon from "@material-ui/icons/ReplyOutlined";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { CGmailSDK } from "./../../scripts/sdk";
import { getReplybyCount } from "./../../../utils/sendMessages";
import { getGmailURL } from "./../../../utils/helper";
import moment from "moment";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import red from "@material-ui/core/colors/red";

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

const ReplyByButton = (props, ref) => {
  // const classes = useStylesTooltip();

  const [replyCount, setReplyCount] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const [isUpdateReply, setUpdateReply] = React.useState(true);

  React.useEffect(() => {
    if (isUpdateReply && !isLoading) {
      setLoading(true);
      setUpdateReply(false);
      getReplybyCount(CGmailSDK._iSDK.User.getEmailAddress())
        .then(({ data }) => {
          const { result } = data;
          setReplyCount(parseInt(result.unreplied_count));
          setLoading(false);
          updateReplyCount();
        })
        .catch(err => {
          setLoading(false);
          setReplyCount(0);
          updateReplyCount();
        });
    }
  }, [isUpdateReply]);

  const updateReplyCount = () => {
    setTimeout(() => {
      setUpdateReply(true);
    }, 6000);
  };

  const handleClickButton = () => {
    const date = moment().format("YYYY-MM-DD");
    window.location.href = `${getGmailURL()}#search/in%3Ainbox+%40Timely%3A+Please+reply+by+${date}`;
  };

  return (
    <Badge badgeContent={replyCount} color="primary">
      <StyledButton variant="outlined" onClick={handleClickButton}>
        To Reply
      </StyledButton>
    </Badge>
  );
};
export default ReplyByButton;
