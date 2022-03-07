import {
  AppBar,
  Container,
  createMuiTheme,
  CssBaseline,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
  Badge,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core";
import Cookies from "js-cookie";
import Head from "next/head";
import React, { useState } from "react";
import useStyles from "../utils/styles";
import NextLink from "next/link";
import { useContext } from "react";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";

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
      main: "#ff3945",
    },
    secondary: {
      main: "#005792",
    },
  },
});

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
            <div>
              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="primary"
                      badgeContent={cart.cartItems.length}
                    >
                      Cart
                    </Badge>
                  ) : (
                    "Cart"
                  )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
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
                </>
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
