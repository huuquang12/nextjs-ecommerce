import { Divider, Grid, Link, Typography } from "@material-ui/core";
import axios from "axios";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Carousel from "react-material-ui-carousel";
import useStyles from "../utils/styles";
import { useSnackbar } from "notistack";


export default function Home(props) {
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);

  const { topRatedProducts, featuredProducts } = props;
  const { userInfo } = state;

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:8000/api/products/${product._id}`
    );

    if (data.countInStock < quantity) {
      enqueueSnackbar("Sorry. This product is out of stock", {
        variant: "error",
      });
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
  };

  return (
    <Layout>
      {/* <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      width={150}
                      height={200}
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography className={classes.text}>
                        {product.name}
                      </Typography>
                    </CardContent>

                    <Typography style={{ textAlign: "center" }}>
                      ${product.price}
                    </Typography>
                  </CardActionArea>
                </NextLink>

                <CardActions
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => addToCartHandler(product)}
                    disabled={product.countInStock <= 0}
                  >
                    {product.countInStock > 0 ? "Add to cart" : "Sold Out"}
                  </Button>
                </CardActions>
              </Card> */}
      <Carousel className={classes.mt1} animation="slide">
        {featuredProducts.map((product) => (
          <NextLink
            key={product._id}
            href={`/search?brand=${product.brand}`}
            passHref
          >
            <Link>
              <img
                width="100%"
                height={300}
                src={product.featuredImage}
                alt={product.name}
                className={classes.featuredImage}
              ></img>
            </Link>
          </NextLink>
        ))}
      </Carousel>
      <Typography variant="h2">Popular Products</Typography>
      <Grid container spacing={3}>
        {topRatedProducts.map((product) => (
          <Grid item md={4} key={product.name}>
            <ProductItem
              product={product}
              addToCartHandler={addToCartHandler}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch("http://localhost:8000/api/products/");
  const data = await res.json();
  return {
    props: {
      featuredProducts: data.featuredProducts,
      topRatedProducts: data.topRatedProducts,
    },
  };
}
