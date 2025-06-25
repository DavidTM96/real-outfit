"use client";

import { Order } from "@/types";

const OrderDetailsTable = ({
  order,
}: {
  order: Omit<Order, "paymentResult">;
}) => {
  return <>Order details table</>;
};

export default OrderDetailsTable;
