"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartService } from "@/services/cart.service";
import { CustomerSession } from "@/lib/session";
const key = ["cart"];
export const useCart = () => {
  const enabled = CustomerSession.has();
  return useQuery({ queryKey: key, queryFn: CartService.get, enabled, retry: false });
};
export const useCartActions = () => { const client = useQueryClient(); const refresh = () => client.invalidateQueries({ queryKey: key }); return { add: useMutation({ mutationFn: ({ variantId, qty }: { variantId: number; qty: number }) => CartService.add(variantId, qty), onSuccess: refresh }), update: useMutation({ mutationFn: ({ id, qty }: { id: number; qty: number }) => CartService.update(id, qty), onSuccess: refresh }), remove: useMutation({ mutationFn: CartService.remove, onSuccess: refresh }) }; };
