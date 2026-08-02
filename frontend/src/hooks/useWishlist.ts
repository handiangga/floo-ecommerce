"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WishlistService } from "@/services/wishlist.service";
const key = ["wishlist"];
export const useWishlist = () => useQuery({ queryKey: key, queryFn: WishlistService.get });
export const useWishlistActions = () => { const client = useQueryClient(); const refresh = () => client.invalidateQueries({ queryKey: key }); return { add: useMutation({ mutationFn: WishlistService.add, onSuccess: refresh }), remove: useMutation({ mutationFn: WishlistService.remove, onSuccess: refresh }) }; };
