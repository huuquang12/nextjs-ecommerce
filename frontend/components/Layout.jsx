import {
  AppBar,
  Badge,
  Button,
  Container,
  createMuiTheme,
  CssBaseline,
  Link,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Cookies from "js-cookie";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { Store } from "../utils/Store";
import useStyles from "../utils/styles";

const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: "1.6rem",
      fontWeight: 400,
      margin: "1rem 0",
    },
    h2: {
      fontSize: "1.4rem",
      fontWeight: 400,
      margin: "1rem 0",
    },
  },
  palette: {
    type: "light",
    primary: {
      main: "#005792",
    },
    secondary: {
      main: "#ff3945",
    },
  },
});

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);

  const router = useRouter();

  const { cart, userInfo } = state;

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = () => {
    setAnchorEl(null);
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    router.push("/");
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - ECommerce` : "ECommerce"}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>ECommerce</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div className={classes.divStyle}>
              <NextLink href="/cart" passHref>
                <Link>
                  <div className={classes.divStyle}>
                    <IconButton aria-label="cart">
                      <StyledBadge
                        badgeContent={cart.cartItems.length}
                        color="secondary"
                      >
                        <ShoppingCartIcon />
                      </StyledBadge>
                    </IconButton>
                  </div>
                </Link>
              </NextLink>
              {userInfo ? (
                <div className={classes.root}>
                  <Avatar alt="Remy Sharp" className={classes.orange}>
                    {" "}
                    <Button
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={loginClickHandler}
                      className={classes.navbarButton}
                    >
                      {userInfo.name}
                    </Button>
                  </Avatar>

                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted={false}
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                    PaperProps={{
                      style: {
                        transform: "translateX(-30px) translateY(30px)",
                      },
                    }}
                  >
                    <MenuItem onClick={loginMenuCloseHandler}>Profile</MenuItem>
                    <MenuItem onClick={loginMenuCloseHandler}>
                      My account
                    </MenuItem>
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </div>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
