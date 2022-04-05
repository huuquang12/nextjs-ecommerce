import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import React from "react";
import NextLink from "next/link";
import Rating from "@material-ui/lab/Rating";
import useStyles from "../utils/styles";

export default function ProductItem({ product, addToCartHandler }) {
  const classes = useStyles();
  return (
    <Card>
      <NextLink href={`/product/${product.slug}`} passHref>
        <CardActionArea>
          <CardMedia
            component="img"
            image={product.image}
            title={product.name}
          ></CardMedia>
          <CardContent>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>{product.name}</Typography>
              <Typography>${product.price}</Typography>
            </div>
            <Typography className={classes.description}>
              {product.category}
            </Typography>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Rating value={product.rating} readOnly precision={0.5}></Rating>
              <span style={{ lineHeight: "24px", margin: "0 5px" }}>|</span>
              <Typography>{product.numReviews} reviews</Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
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
  );
}
