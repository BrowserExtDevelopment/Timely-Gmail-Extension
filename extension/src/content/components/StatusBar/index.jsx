import React from "react";
import { withStyles, makeStyles, withTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import red from "@material-ui/core/colors/red";

import ReplyByItem from "../ReplyByItem";
import ReadByItem from "../ReadByItem";
import MarkToReplyItem from "../MarkToReplyItem";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "top",
      horizontal: "left"
    }}
    transformOrigin={{
      vertical: "bottom",
      horizontal: "left"
    }}
    {...props}
  />
));
const StyledButton = withStyles(theme => ({
  root: {
    backgroundColor: red[700],
    textTransform: "none",
    color: "white",
    padding: "6px 10px",
    "&:hover": {
      backgroundColor: red[900]
    },
    "&:active": {
      backgroundColor: red[900]
    }
  }
}))(Button);
const StatusBar = ({ handlers, initialStatus }) => {
  // const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledButton
        // className={classes.button}
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        onClick={handleClick}
        // color="secondary"
        disableRipple
        endIcon={<ArrowDropUpIcon />}
      >
        Timely
      </StyledButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <ReadByItem
          handlers={handlers.handlersReadBy}
          initialStatus={initialStatus.readBy}
          onClick={handleClose}
        />

        <ReplyByItem
          handlers={handlers.handlersReplyBy}
          initialStatus={initialStatus.replyBy}
          onClick={handleClose}
        />

        <MarkToReplyItem
          handlers={handlers.handlersMarkToReply}
          initialStatus={initialStatus.markToReply}
          onClick={handleClose}
        />
      </StyledMenu>
    </div>
  );
};
export default StatusBar;
