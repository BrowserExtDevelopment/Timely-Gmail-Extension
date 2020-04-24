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

import "./read-by-button.scss";

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

const ReadByItem = React.forwardRef(
  ({ handlers, initialStatus, onClick: handleClose } = props, ref) => {
    const classes = useStyles();

    const [readByButtonStatus, setReadByButtonStatus] = React.useState(
      initialStatus
    );
    const [readByDate, setReadByDate] = React.useState(new Date());
    const [showPicker, setShowPicker] = React.useState(false);
    console.log(
      "~~~~~~~~~~ Rendered readbybutton",
      showPicker,
      readByButtonStatus
    );
    const handlerAddReadBy = handlers.add;
    const handlerRemoveReadBy = handlers.remove;

    const handleClickReadButton = () => {
      if (!readByButtonStatus) {
        setShowPicker(true);
      } else {
        handlerRemoveReadBy();
        setReadByButtonStatus(false);
      }
      handleClose();
    };

    const handleClosePicker = () => {
      console.log("Called handleClosePicker");
      setShowPicker(false);
      handleClose();
    };

    const handleAcceptPicker = date => {
      setReadByButtonStatus(true);
      setReadByDate(date);
      handlerAddReadBy(date);
    };

    return (
      <MuiPickersUtilsProvider utils={MomentUtils} innerRef={ref}>
        <DatePicker
          value={readByDate}
          open={showPicker}
          onAccept={handleAcceptPicker}
          onClose={handleClosePicker}
          onChange={setReadByDate}
          disablePast={true}
          TextFieldComponent={() => (
            <MenuItem
              className={
                readByButtonStatus ? classes.rootSelected : classes.root
              }
              onClick={handleClickReadButton}
            >
              <ListItemIcon className={classes.itemIcon}>
                {readByButtonStatus ? <ToggleOnIcon /> : <ToggleOffIcon />}
              </ListItemIcon>
              <ListItemText primary="Read By" />
            </MenuItem>
          )}
        />
      </MuiPickersUtilsProvider>
    );
  }
);
export default ReadByItem;
