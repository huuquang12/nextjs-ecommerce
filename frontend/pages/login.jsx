import React from "react";
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
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Head from "next/head";

export default function LoginScreen() {
  const paperStyle = {
    padding: 20,
    height: 410,
    width: 400,
    margin: "50px auto",
  };
  const avatarStyle = { backgroundColor: "#005792" };
  const btnstyle = { margin: "8px 0" };
  const divstyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <Grid title="Login">
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <AccountCircleIcon />
            </Avatar>
            <h2>Sign In</h2>
          </Grid>
          <TextField
            style={btnstyle}
            variant="outlined"
            label="Email"
            type="email"
            fullWidth
            required
          />
          <TextField
            style={btnstyle}
            variant="outlined"
            label="Password"
            type="password"
            fullWidth
            required
          />
          <div style={divstyle}>
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
            style={btnstyle}
            fullWidth
          >
            Sign in
          </Button>
          <Typography style={btnstyle}>
            {" "}
            Do you have an account ? &nbsp;
            <NextLink href="/register">
              <Link href="#">Sign Up</Link>
            </NextLink>
          </Typography>
        </Paper>
      </Grid>
    </div>
  );
}
