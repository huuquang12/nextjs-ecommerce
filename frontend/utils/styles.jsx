import { makeStyles } from "@material-ui/core";
import { deepOrange } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginLeft: "20px",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  navbar: {
    backgroundColor: "#1a94ff",
    "& a": {
      color: "#FFFFFF",
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: "80vh",
  },
  footer: {
    textAlign: "center",
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    maxWidth: 500,
    margin: "0 auto",
  },
  navbarButton: {
    color: "#ffffff",
    textTransform: "initial",
    margin: "0 15px",
  },
  transparentBackgroud: {
    backgroundColor: "transparent",
  },
  divStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarStyle: {
    backgroundColor: "#005792",
  },
}));

export default useStyles;
