import { Button, Typography } from "@material-ui/core";
import { Tag } from "antd";
import Layout from "../components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useContext, useState } from "react";
import { Store } from "../utils/Store";
import moment from "moment";
import NextLink from "next/link";

export default function Runes() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems },
  } = state;
  const [userRunes, setUserRunes] = useState(0);
  const [daysStreak, setDaysStreak] = useState(-1);
  const [collected, setCollected] = useState(true);

  useEffect(() => {
    if (userInfo) {
      const fetch = async (req, res) => {
        const { data } = await axios.get(
          `http://localhost:8000/api/runes/user/${userInfo._id}`
        );
        setUserRunes(data.runes);
        setDaysStreak(data.daysInARow);
        setCollected(moment(data.lastCollected).isSame(moment.utc(), "day"));
      };

      fetch();
    } else {
      setDaysStreak(-1);
      setCollected(true);
      setUserRunes(0);
    }
  }, []);

  async function addRunes() {
    const { data } = await axios.get(
      `http://localhost:8000/api/runes/add/${userInfo._id}`
    );
    setUserRunes(data.runes);
    setDaysStreak(data.daysInARow);
    setCollected(true);
  }

  function getRuneBtn(i) {
    if (i === daysStreak && !collected) {
      return "runeBtn2";
    } else {
      return "runeBtn";
    }
  }

  const days = [10, 10, 10, 20, 20, 20, 50];

  const styles = {
    content: {
      fontFamily: "Roboto, sans-serif",
      color: "#041836",
      marginTop: "50px",
      marginBottom: "66px",
    },
    collected: {
      marginTop: "20px",
      marginBottom: "40px",
      width: "310px",
      height: "150px",
      background: "#0892d0",
      borderRadius: "20px",
      display: "flex",
      overflow: "hidden",
    },
    colHeading: {
      padding: "27px",
      fontSize: "12px",
      width: "200px",
    },
    count: {
      fontSize: "28px",
      fontWeight: "600",
      marginTop: "5px",
    },
    daily: {
      marginTop: "20px",
      marginBottom: "35px",
      display: "flex",
      justifyContent: "space-between",
    },
    rew: {
      marginTop: "20px",
      marginBottom: "35px",
      display: "flex",
      gap: "35px",
      flexWrap: "wrap",
    },
    collect: {
      background: "#0892d0",
      borderColor: "#0892d0",
      width: "140px",
      height: "40px",
    },
    cantCollect: {
      background: "#808a9d",
      borderColor: "#808a9d",
      width: "140px",
      height: "40px",
      cursor: "default",
    },
    claimrow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "25px",
      marginBottom: "35px",
      flexWrap: "wrap",
    },
    rewardCard: {
      width: "310px",
      height: "400px",
      borderRadius: "15px",
    },
    rewardImg: {
      height: "200px",
      overflow: "hidden",
      borderRadius: "15px 15px 0 0",
    },
    bottom: {
      position: "absolute",
      bottom: "24px",
      left: "24px",
      width: "262px",
      display: "flex",
      justifyContent: "space-between",
    },
  };

  return (
    <Layout
      title="Runes"
      style={{
        height: "100vh",
        overflow: "auto",
        background: "linear-gradient(#172430, #001529)",
      }}
    >
      <div style={styles.content}>
        <Typography component="h1" variant="h1">
          My Runes
        </Typography>

        <div style={styles.collected}>
          <div style={styles.colHeading}>
            <span>My Runes</span>
            <p style={styles.count}>{userRunes}</p>
          </div>
          <div>
            <img src="images/Runes.png" alt="" style={{ width: "100%" }} />
          </div>
        </div>
        <div style={styles.daily}>
          <div>
            <Typography component="h3" style={{ color: "black" }}>
              Daily Runes Collection
            </Typography>
            <p style={{ color: "black" }}>
              If you visit us everyday you will have the opoturnity to receive
              bonus runes
            </p>
          </div>
          <Button
            style={collected ? styles.cantCollect : styles.collect}
            onClick={() => addRunes()}
          >
            Collect Runes
          </Button>
        </div>

        <div style={styles.claimrow}>
          {days.map((e, i) => (
            <>
              <div className={getRuneBtn(i)}>
                <p stle={{ fontSize: "12px" }}>{`Day ${i + 1}`}</p>
                {i > daysStreak - 1 ? (
                  <img
                    src="/images/Runes.png"
                    alt=""
                    style={{ width: "46%", margin: "6px auto" }}
                  />
                ) : (
                  <img
                    src="/images/RunesCollected.png"
                    alt=""
                    style={{ width: "60%", margin: " auto" }}
                  />
                )}
                <p style={{ color: "black", fontSize: "18px" }}>{`+${e}`}</p>
              </div>
            </>
          ))}
        </div>
      </div>
    </Layout>
  );
}
