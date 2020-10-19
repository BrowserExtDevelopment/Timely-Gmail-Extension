import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import MomentUtils from "@date-io/moment";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";

import "./reply-by-button.scss";

const useStyles = makeStyles(theme => ({
  root: {},
  rootSelected: {
    backgroundColor: red[900],
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.getContrastText(red[900])
    },
    "&:focus": {
      backgroundColor: red[900]
    },
    "&:hover": {
      backgroundColor: red[900]
    }
  },
  itemIcon: {
    minWidth: "40px"
  }
}));

const ReplyByItem = React.forwardRef(
  ({ handlers, initialStatus, onClick: handleClose } = props, ref) => {
    const classes = useStyles();
    const [replyButtonStatus, setReplyButtonStatus] = React.useState(
      initialStatus
    );
    const [replyByDate, setReplyByDate] = React.useState(new Date());
    const [showPicker, setShowPicker] = React.useState(false);

    const handlerAddReplyBy = handlers.add;
    const handlerRemoveReplyBy = handlers.remove;

    const handleClickReplyButton = () => {
      if (!replyButtonStatus) {
        setShowPicker(true);
      } else {
        setReplyButtonStatus(false);
        handlerRemoveReplyBy();
      }
      handleClose();
    };

    const handleClosePicker = () => {
      setShowPicker(false);
    };

    const handleAcceptPicker = date => {
      setReplyButtonStatus(true);
      setReplyByDate(date);
      handlerAddReplyBy(date);
    };

    return (
      <MuiPickersUtilsProvider utils={MomentUtils} innerRef={ref}>
        <DatePicker
          value={replyByDate}
          onChange={setReplyByDate}
          open={showPicker}
          onAccept={handleAcceptPicker}
          onClose={handleClosePicker}
          disablePast={true}
          TextFieldComponent={() => (
            <MenuItem
              className={
                replyButtonStatus ? classes.rootSelected : classes.root
              }
              onClick={handleClickReplyButton}
            >
              <ListItemIcon className={classes.itemIcon}>
                {replyButtonStatus ? <ToggleOnIcon /> : <ToggleOffIcon />}
              </ListItemIcon>
              <ListItemText primary="Reply By" />
            </MenuItem>
          )}
        />
      </MuiPickersUtilsProvider>
    );
  }
);

export default ReplyByItem;
