"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WishlistService } from "@/services/wishlist.service";
import { CustomerSession } from "@/lib/session";
const key = ["wishlist"];
export const useWishlist = () => {
  const enabled = CustomerSession.has();
  return useQuery({ queryKey: key, queryFn: WishlistService.get, enabled, retry: false });
};
export const useWishlistActions = () => { const client = useQueryClient(); const refresh = () => client.invalidateQueries({ queryKey: key }); return { add: useMutation({ mutationFn: WishlistService.add, onSuccess: refresh }), remove: useMutation({ mutationFn: WishlistService.remove, onSuccess: refresh }) }; };
