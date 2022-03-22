import React, { useContext, useEffect } from "react";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Link,
  makeStyles,
} from "@material-ui/core";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import Head from "next/head";
import NextLink from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";
import { getError } from "../../utils/error";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

const useStyles = makeStyles({
  paperStyle: {
    padding: 20,
    height: 410,
    width: 400,
    justifyContent: "center",
    margin: "30px auto",
  },
  avatarStyle: { backgroundColor: "#005792" },
  btnstyle: { margin: "12px 0" },
  divstyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default function AdminLogin() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const classes = useStyles();

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

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
      if (data.isAdmin) {
        router.push("/admin/dashboard");
      } else {
        enqueueSnackbar("You do not access this page", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <div>
      <Head>
        <title>Admin</title>
      </Head>
      <Grid>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Paper elevation={10} className={classes.paperStyle}>
            <Grid align="center">
              <Avatar className={classes.avatarStyle}>
                <SupervisorAccountIcon />
              </Avatar>
              <h2>ADMIN</h2>
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
            />
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
            />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.btnstyle}
              fullWidth
            >
              Sign in
            </Button>
          </Paper>
        </form>
      </Grid>
    </div>
  );
}
