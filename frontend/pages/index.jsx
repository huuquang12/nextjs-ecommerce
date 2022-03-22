import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";

export default function Home(props) {
  const router = useRouter();

  const { state, dispatch } = useContext(Store);

  const { products } = props;

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:8000/api/products/${product._id}`
    );

    if (data.countInStock < quantity) {
      window.alert("Sorry. This product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
  };

  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      width={200}
                      height={300}
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
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
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch("http://localhost:8000/api/products/");
  const products = await res.json();
  return {
    props: {
      products: products,
    },
  };
}
