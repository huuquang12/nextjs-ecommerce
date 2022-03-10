import {
  Avatar,
  Button, Checkbox, FormControlLabel, Grid,
  Link, makeStyles, Paper,
  TextField,
  Typography
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import axios from "axios";
import Cookies from "js-cookie";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Store } from "../utils/Store";

const useStyles = makeStyles({
  paperStyle: {
    padding: 20,
    height: 560,
    width: 400,
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

export default function Register() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const classes = useStyles();

  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords doesn't match", { variant: "error" });
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/users/register",
        {
          name,
          email,
          password,
        }
      );
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", data);
      router.push(redirect || "/");
    } catch (err) {
      enqueueSnackbar(
        err.response.data ? err.response.data.message : err.message,
        { variant: "error" }
      );
    }
  };

  return (
    <div>
      <Head>
        <title>Register</title>
      </Head>
      <Grid>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Paper elevation={10} className={classes.paperStyle}>
            <Grid align="center">
              <Avatar className={classes.avatarStyle}>
                <AccountCircleIcon />
              </Avatar>
              <h2>Sign Up</h2>
            </Grid>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 4,
              }}
              render={({ field }) => (
                <TextField
                  className={classes.btnstyle}
                  variant="outlined"
                  label="Name"
                  inputProps={{ type: "name" }}
                  fullWidth
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === "minLength"
                        ? "Name must be at least 4 characters"
                        : "Name is required"
                      : ""
                  }
                  {...field}
                />
              )}
            ></Controller>

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

            <Controller
              name="confirmPassword"
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
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === "minLength"
                        ? "Password must be at least 6 characters"
                        : "Confirm  Password is required"
                      : ""
                  }
                  {...field}
                />
              )}
            ></Controller>
            <div className={classes.divstyle}>
              <FormControlLabel
                control={<Checkbox name="checkedB" color="primary" />}
                label="Remember me"
              />
              <Typography>
                <NextLink href="">
                  <Link href="#">Forgot password ?</Link>
                </NextLink>
              </Typography>
            </div>

            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.btnstyle}
              fullWidth
            >
              Register
            </Button>
            <Typography className={classes.btnstyle}>
              {" "}
              Already have an account ? &nbsp;
              <NextLink href={`/login?redirect=${redirect || "/"}`} passHref>
                <Link href="#">Sign In</Link>
              </NextLink>
            </Typography>
          </Paper>
        </form>
      </Grid>
    </div>
  );
}
