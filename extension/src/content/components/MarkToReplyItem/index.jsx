import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import MomentUtils from "@date-io/moment";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import red from "@material-ui/core/colors/red";

import "./mark-to-reply-button.scss";

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

const MarkToReplyItem = React.forwardRef(
  ({ handlers, initialStatus, onClick: handleClose } = props, ref) => {
    const classes = useStyles();

    const [
      markToReplyButtonStatus,
      setMarkToReplyButtonStatus
    ] = React.useState(initialStatus);

    const [markToReplyDate, setMarkToReplyDate] = React.useState(new Date());
    const [showPicker, setShowPicker] = React.useState(false);
    console.log(
      "~~~~~~~~~~ Rendered markToReplybutton",
      showPicker,
      markToReplyButtonStatus
    );
    const handlerAddMarkToReply = handlers.add;
    const handlerRemoveMarkToReply = handlers.remove;

    const handleClickMarkToReplyButton = () => {
      if (!markToReplyButtonStatus) {
        setShowPicker(true);
      } else {
        handlerRemoveMarkToReply();
        setMarkToReplyButtonStatus(false);
      }
      handleClose();
    };

    const handleClosePicker = () => {
      console.log("Called handleClosePicker");
      setShowPicker(false);
      handleClose();
    };

    const handleAcceptPicker = date => {
      setMarkToReplyButtonStatus(true);
      setMarkToReplyDate(date);
      handlerAddMarkToReply(date);
    };

    return (
      <MuiPickersUtilsProvider utils={MomentUtils} innerRef={ref}>
        <DatePicker
          value={markToReplyDate}
          open={showPicker}
          onAccept={handleAcceptPicker}
          onClose={handleClosePicker}
          onChange={setMarkToReplyDate}
          disablePast={true}
          TextFieldComponent={() => (
            <MenuItem
              className={
                markToReplyButtonStatus ? classes.rootSelected : classes.root
              }
              onClick={handleClickMarkToReplyButton}
            >
              <ListItemIcon className={classes.itemIcon}>
                {markToReplyButtonStatus ? <ToggleOnIcon /> : <ToggleOffIcon />}
              </ListItemIcon>
              <ListItemText primary="Mark To Reply" />
            </MenuItem>
          )}
        />
      </MuiPickersUtilsProvider>
    );
  }
);
export default MarkToReplyItem;