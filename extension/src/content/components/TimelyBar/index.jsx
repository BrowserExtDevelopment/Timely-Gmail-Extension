import React from "react";
import ReadByButton from "./../ReadByButton";
import ReplyByButton from "./../ReplyByButton";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import red from "@material-ui/core/colors/red";

const useStyles = makeStyles(theme => ({
  timelyBar: {
    border: "1px solid",
    borderRadius: "8px",
    padding: "0px 20px",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white"
  },
  divider: {
    backgroundColor: red[900],
    margin: "0px 10px"
  }
}));

const TimelyBar = props => {
  const classes = useStyles();
  return (
    <div className={classes.timelyBar}>
      <ReadByButton />
      <Divider className={classes.divider} orientation="vertical" flexItem />
      <ReplyByButton />
    </div>
  );
};
export default TimelyBar;
