import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Link,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Typography
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import ArrowForwardIosTwoToneIcon from "@material-ui/icons/ArrowForwardIosTwoTone";
import CancelIcon from "@material-ui/icons/Cancel";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import axios from "axios";
import Cookies from "js-cookie";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { getError } from "../utils/error";

import { Store } from "../utils/Store";
import useStyles from "../utils/styles";

const theme = createTheme({
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

  const [sidbarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/products/categories`
      );
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/products/brands`
      );
      setBrands(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  useEffect(() => {
    fetchBrands();
  }, []);

  const [query, setQuery] = useState("");
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
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
          <Toolbar className={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                className={classes.menuButton}
              >
                <MenuIcon className={classes.navbarButton} />
              </IconButton>
              <NextLink href="/" passHref>
                <Link>
                  <Typography className={classes.brand}>E-Commerce</Typography>
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor="left"
              open={sidbarVisible}
              onClose={sidebarCloseHandler}
            >
              <List className={classes.list}>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography className={classes.title}>
                      Categories
                    </Typography>
                    <IconButton
                      style={{ left: "90px" }}
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {categories.map((category) => (
                  <NextLink
                    key={category}
                    href={`/search?category=${category}`}
                    passHref
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                      <ArrowForwardIosTwoToneIcon />
                    </ListItem>
                  </NextLink>
                ))}
              </List>
              <Divider light />
              <List className={classes.list}>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography className={classes.title}>Brands</Typography>
                  </Box>
                </ListItem>

                {brands.map((brand) => (
                  <NextLink
                    key={brand}
                    href={`/search?brand=${brand}`}
                    passHref
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={brand}></ListItemText>
                      <ArrowForwardIosTwoToneIcon />
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>

            <div className={classes.search}>
              <form onSubmit={submitHandler}>
                <IconButton
                  type="submit"
                  className={classes.iconButton}
                  aria-label="search"
                >
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                </IconButton>
                <InputBase
                  name="query"
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onChange={queryChangeHandler}
                />
              </form>
            </div>
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
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler("/profile")}
                    >
                      Profile
                    </MenuItem>
                    {userInfo.isAdmin ? (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler("/admin/dashboard")
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    ) : (
                      ""
                    )}
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler("/order-history")}

                    >
                      Order Hisotry
                    </MenuItem>
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </div>
              ) : (
                <div>
                  <NextLink href="/login" passHref>
                    <Link>
                      <Typography component="span">Login</Typography>
                    </Link>
                  </NextLink>
                  <span style={{ marginLeft: "10px" }}>/</span>
                  <NextLink href="/register" passHref>
                    <Link>
                      <Typography component="span">Register</Typography>
                    </Link>
                  </NextLink>
                </div>
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
