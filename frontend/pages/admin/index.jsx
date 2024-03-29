import {
  Avatar,
  Button,
  Grid,
  makeStyles,
  Paper,
  TextField
} from "@material-ui/core";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import axios from "axios";
import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import useStyles from '../../utils/styles';


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
