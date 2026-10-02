"use client";

import { useSession } from "next-auth/react";
import { addToCart } from "../../../cartActions/addToCart.action"; 
import { toast } from "sonner";

export default function MyAddToCart({ productId }: { productId: string }) {
  const { data: session } = useSession();

  const handleAdd = async () => {
    const userToken = (session as any)?.token || (session as any)?.user?.token;

    if (!userToken) {
      toast.error("Please log in first");
      return;
    }

  
    const res = await addToCart(productId, userToken);
    
    if (res?.status === "success" || res?.message === "success") {
      toast.success("Added to cart successfully!");
    } else {
      toast.error(res?.message || "Failed to add to cart");
    }
  };

  return (
    <button onClick={handleAdd} className="bg-emerald-700 text-white px-4 py-2 rounded-lg">
      Add To Cart
    </button>
  );
}