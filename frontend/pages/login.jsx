import React, { useContext, useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Avatar,
  Button,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  makeStyles,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Head from "next/head";
import axios from "axios";
import Cookies from "js-cookie";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";

const useStyles = makeStyles({
  paperStyle: {
    padding: 20,
    height: 410,
    width: 400,
    justifyContent: "center",
    margin: "30px auto",
  },
  avatarStyle: { backgroundColor: "#005792" },
  btnstyle: { margin: "8px 0" },
  divstyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const classes = useStyles();

  const router = useRouter();
  const { redirect } = router.query;
  console.log(redirect);
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems },
  } = state;

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);

  const submitHandler = async ({ email, password }) => {
    closeSnackbar();
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email,
          password,
        }
      );
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      const user = data;
      console.log("log in");
      const cart = await axios.get(
        `http://localhost:8000/api/carts/user/${data._id}`
      );
      dispatch({ type: "CART_UPDATE", payload: cart.data.cartItems });
      console.log("get cart");

      const saveCart = await axios.post(
        `http://localhost:8000/api/carts/save`,
        {
          cartItems,
          user,
        }
      );
      console.log(saveCart);
      // dispatch({ type: "CART_UPDATE", payload: saveCart.data.cartItems });
      router.push(redirect || "/");
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <Grid>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Paper elevation={10} className={classes.paperStyle}>
            <Grid align="center">
              <Avatar className={classes.avatarStyle}>
                <AccountCircleIcon />
              </Avatar>
              <h2>Sign In</h2>
            </Grid>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  className={classes.btnstyle}
                  variant="outlined"
                  label="Email"
                  type="email"
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === "pattern"
                        ? "Email is not valid"
                        : "Email is required"
                      : ""
                  }
                  {...field}
                />
              )}
            ></Controller>

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  className={classes.btnstyle}
                  variant="outlined"
                  label="Password"
                  type="password"
                  fullWidth
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === "minLength"
                        ? "Password must be at least 6 characters"
                        : "Password is required"
                      : ""
                  }
                  {...field}
                />
              )}
            ></Controller>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.btnstyle}
              fullWidth
            >
              Sign in
            </Button>
            <Typography className={classes.btnstyle}>
              {" "}
              Do you have an account ? &nbsp;
              <NextLink href={`/register?redirect=${redirect || "/"}`} passHref>
                <Link>Sign Up</Link>
              </NextLink>
            </Typography>
          </Paper>
        </form>
      </Grid>
    </div>
  );
}
