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
} from "@material-ui/core";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import React from "react";
import Head from "next/head";
import NextLink from "next/link";
export default function AdminHomeScreen() {
  const paperStyle = {
    padding: 20,
    height: 410,
    width: 400,
    margin: "50px auto",
  };
  const avatarStyle = { backgroundColor: "#005792" };
  const btnstyle = { margin: "8px 0" };
  return (
    <div>
      <Head>
        <title>Admin</title>
      </Head>
      <Grid>
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <SupervisorAccountIcon />
            </Avatar>
            <h2>ADMIN</h2>
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
          <Typography>
            <NextLink href="">
              <Link href="#">Forgot password ?</Link>
            </NextLink>
          </Typography>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={btnstyle}
            fullWidth
          >
            Sign in
          </Button>
        </Paper>
      </Grid>
    </div>
  );
}
