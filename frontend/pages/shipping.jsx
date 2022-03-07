import React, {useContext} from "react";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";

export default function ShippingScreen() {
  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  if(!userInfo) {
    router.push('/login?redirect=/shipping');
  }

  return <div>shipping page</div>;
}
