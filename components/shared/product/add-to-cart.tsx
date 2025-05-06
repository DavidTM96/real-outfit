"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    // Handle unsuccessful addition to cart
    if (!res.success) {
      toast.error(res.message);

      return;
    }

    // Handle successful addition to cart
    toast.success(`${res.message}`, {
      action: (
        <Button
          className="bg-primary text-white hover:bg-gray-800 cursor-pointer"
          onClick={() => router.push("/cart")}
        >
          Go to Cart
        </Button>
      ),
    });
  };

  return (
    <Button
      className="w-full cursor-pointer"
      type="button"
      onClick={handleAddToCart}
    >
      <Plus />
      Add To Cart
    </Button>
  );
};

export default AddToCart;
