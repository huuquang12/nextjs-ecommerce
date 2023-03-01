import Layout from "../components/Layout";
import useStyles from "../utils/styles";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import NextLink from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useContext, useState } from "react";
import { Store } from "../utils/Store";
import moment from "moment";
import OpacityIcon from "@material-ui/icons/Opacity";
import { useSnackbar } from "notistack";

export default function Reward() {
  const router = useRouter();
  const { redirect } = router.query;
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems },
  } = state;
  const [userRunes, setUserRunes] = useState(0);
  const styles = {
    rew: {
      marginBottom: "35px",
      display: "flex",
      gap: "35px",
      flexWrap: "wrap",
    },
    rewardCard: {
      marginTop: "30px",
      width: "270px",
      height: "350px",
      borderRadius: "15px",
    },
    rewardImg: {
      height: "185px",
      overflow: "hidden",
      borderRadius: "15px 15px 0 0",
    },
    bottom: {
      bottom: "24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  };

  useEffect(() => {
    if (userInfo) {
      const fetch = async (req, res) => {
        const { data } = await axios.get(
          `http://localhost:8000/api/runes/user/${userInfo._id}`
        );
        setUserRunes(data.runes);
      };
      fetch();
    } else {
      setUserRunes(0);
    }
  }, []);

  return (
    <Layout title="Runes">
      <Grid container spacing={2}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/runes" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Runes Collection"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/reward" passHref>
                <ListItem button selected component="a">
                  <ListItemText primary="Reward"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Typography component="h3" variant="h2" style={{ color: "black" }}>
              Claim Your Rewards
            </Typography>
            <div style={{ alignSelf: "flex-end" }}>
              <span
                style={{
                  color: "rgb(88 102 126)",
                  lineHeight: "1.5",
                  fontSize: "14px",
                }}
              >
                {" "}
                Your Runes:
              </span>
              <div className={classes.divStyle}>
                {" "}
                <OpacityIcon />
                {userRunes}
              </div>
            </div>
          </div>
          <p
            style={{ color: "#757575", marginBottom: "15px", marginTop: "0px" }}
          >
            Choose from the rewards below to exchange your runes.
          </p>
          <Typography variant="subtitle1">Claim Rewards</Typography>
          <div style={styles.rew}>
            <Card style={styles.rewardCard}>
              <CardMedia
                style={styles.rewardImg}
                component="img"
                image="images\voucher10.jpg"
                title="Voucher 10%"
              />

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Voucher 10%
                </Typography>
                <p style={{ color: "#757575" }}>
                  Collect enough runes to exchange the voucher and buy shoes.
                </p>
                <div style={styles.bottom}>
                  <div className={classes.divStyle}>
                    <span style={{ color: "#757575" }}> Price:</span>
                    <OpacityIcon /> 200
                  </div>
                  <span>
                    <Button
                      variant="text"
                      size="small"
                      color="secondary"
                      onClick={() => {
                        if (userRunes > 200) {
                          enqueueSnackbar("Exchange successfully", {
                            variant: "success",
                          });
                          setUserRunes(userRunes - 200);
                        } else {
                          enqueueSnackbar("Not enough runes", {
                            variant: "error",
                          });
                        }
                      }}
                    >
                      Exchange
                    </Button>
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card style={styles.rewardCard}>
              <CardMedia
                style={styles.rewardImg}
                component="img"
                image="images\voucher20.jpg"
                title="Voucher 20%"
              />

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Voucher 20%
                </Typography>
                <p style={{ color: "#757575" }}>
                  Collect enough runes to exchange the voucher and buy shoes.
                </p>
                <div style={styles.bottom}>
                  <div className={classes.divStyle}>
                    <span style={{ color: "#757575" }}> Price:</span>
                    <OpacityIcon /> 500
                  </div>
                  <span>
                    <Button
                      variant="text"
                      size="small"
                      color="secondary"
                      onClick={() => {
                        if (userRunes > 500) {
                          enqueueSnackbar("Exchange successfully", {
                            variant: "success",
                          });
                          setUserRunes(userRunes - 200);
                        } else {
                          enqueueSnackbar("Not enough runes", {
                            variant: "error",
                          });
                        }
                      }}
                    >
                      Exchange
                    </Button>
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card style={styles.rewardCard}>
              <CardMedia
                style={styles.rewardImg}
                component="img"
                image="images\voucher30.jpg"
                title="Voucher 30%"
              />

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Voucher 30%
                </Typography>
                <p style={{ color: "#757575" }}>
                  Collect enough runes to exchange the voucher and buy shoes.
                </p>
                <div style={styles.bottom}>
                  <div className={classes.divStyle}>
                    <span style={{ color: "#757575" }}> Price:</span>
                    <OpacityIcon /> 800
                  </div>
                  <span>
                    <Button
                      variant="text"
                      size="small"
                      color="secondary"
                      onClick={() => {
                        if (userRunes > 800) {
                          enqueueSnackbar("Exchange successfully", {
                            variant: "success",
                          });
                          setUserRunes(userRunes - 200);
                        } else {
                          enqueueSnackbar("Not enough runes", {
                            variant: "error",
                          });
                        }
                      }}
                    >
                      Exchange
                    </Button>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
}
