import { alpha, makeStyles } from "@material-ui/core";
import { deepOrange } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginLeft: "15px",
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
  toolbar: {
    justifyContent: "space-between",
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
    width: "100%",
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

  title: {
    fontSize: "18px",
    fontWeight: "700",
    lineHeight: "24px",
    color: "#111111",
    textTransform: "capitalize",
  },
  text: {
    color: "#0f1111",
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "400",
    textAlign: "center",
  },
  description: {
    color: "#757575",
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "400",
  },
  pdt: {
    paddingTop: "26px",
  },

  // custom styles
  divStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarStyle: {
    backgroundColor: "#005792",
  },
  paperStyle: {
    padding: 20,
    height: 410,
    width: 400,
    justifyContent: "center",
    margin: "30px auto",
  },
  btnstyle: { margin: "12px 0" },
  // divstyle: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },

  error: {
    color: "#f04040",
  },
  fullWidth: {
    width: "100%",
  },
  list: {
    width: "250px",
  },
  menuButton: { padding: 0 },
  mt1: { marginTop: "1rem" },
  sort: {
    marginRight: 5,
  },

  // reviews
  reviewForm: {
    maxWidth: 800,
    width: "100%",
  },
  reviewItem: {
    marginRight: "1rem",
    borderRight: "1px #808080 solid",
    paddingRight: "1rem",
  },

  // search
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: "25px",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: theme.spacing(4),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "15ch",
      "&:focus": {
        width: "23ch",
      },
    },
  },
  iconButton: {
    paddingLeft: theme.spacing(4),
    borderRadius: "0 5px 5px 0",
    "& span": {
      color: "#ffffff",
    },
  },

  // Map
  fullContainer: { height: "100vh" },
  mapInputBox: {
    position: "absolute",
    display: "flex",
    left: 0,
    right: 0,
    margin: "10px auto",
    width: 300,
    height: 40,
    "& input": {
      width: 250,
    },
  },
}));

export default useStyles;
