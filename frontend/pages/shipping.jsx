import {
  List,
  ListItem,
  Typography,
  TextField,
  Button,
  Avatar,Modal
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";

import { Store } from "../utils/Store";
import useStyles from "../utils/styles";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import CheckoutStep from "../components/CheckoutStep";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import dynamic from "next/dynamic";
import { makeStyles } from '@material-ui/core/styles';
import GoogleMap from '../components/GoogleMap';
import MapboxMap from '../components/mapbox-map';
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";
import axios from "axios";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const Layout = dynamic(() => import("../components/Layout"), { ssr: false });


export default function Shipping(props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
    }
    setValue("fullName", shippingAddress.fullName);
    setValue("address", userInfo?.coordinate?.lng ? JSON.stringify(userInfo?.coordinate) : "");
    setValue("city", shippingAddress.city); 
    setValue("postalCode", shippingAddress.postalCode);
    setValue("phone", shippingAddress.phone);
  }, [userInfo]);
  const classes = useStyles();
  const submitHandler = ({ fullName, address, city, postalCode, phone }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, phone },
    });
    Cookies.set("shippingAddress", {
      fullName,
      address,
      city,
      postalCode,
      phone,
    });
    router.push("/payment");
  };
  const  handleUpdateAddress = async (value) => {
    closeSnackbar();
    try {
      const { data } = await axios.put(
        "http://localhost:8000/api/users/update-address",
        {
         address: value
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "USER_UPDATE_ADDRESS", payload: data });
      enqueueSnackbar("Address user updated successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  }
  return (
    <Layout title="Shipping Address">
      <CheckoutStep activeStep={1} />
      
      <Modal style={{display:"flex",alignItems:"center", justifyContent:"center"}}
        open={open}
        onClose={handleClose}
        // aria-labelledby="simple-modal-title"
        // aria-describedby="simple-modal-description"
      >  
        <div style={{margin:"auto", width:"600px",  height:"600px"}}><GoogleMap
        setValue = {(value) => handleUpdateAddress(value)}
        ></GoogleMap>
        </div>
      </Modal>


      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <div className={classes.divStyle}>
          <Avatar className={classes.avatarStyle}>
            <LocalShippingIcon />
          </Avatar>
          <Typography component="h1" variant="h1" align="center">
            Shipping Address
          </Typography>
        </div>

        <List>
          <ListItem color="secondary">
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === "minLength"
                        ? "Full Name must be at least 2 characters"
                        : "Full Name is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 4,
              }}
              render={({ field }) => (
                <TextField
                onClick={()=> 
                  handleOpen()
                }
                
                  variant="outlined"
                  fullWidth
                  id="address"
                  label="Address"
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === "minLength"
                        ? "Address must be at least 4 characters"
                        : "Address is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
  
          <ListItem>
            <Controller
              name="city"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="city"
                  label="City"
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === "minLength"
                        ? "City must be at least 4 characters"
                        : "City is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="postalCode"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 4,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="postalCode"
                  label="Postal Code"
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === "minLength"
                        ? "Postal Code must be at least 4 characters"
                        : "Postal Code is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  error={Boolean(errors.phone)}
                  helperText={
                    errors.phone
                      ? errors.phone.type === "pattern"
                        ? "Phone number is incorrect"
                        : "Phone is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
