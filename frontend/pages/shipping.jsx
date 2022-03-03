import React from "react";
import { useRouter } from "next/router";

export default function ShippingScreen() {
  const router = useRouter();

  router.push("/login");
  return <div>shipping</div>;
}
