import { apiSignOut } from "@/services/apiAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: signOut,
    isPending: isLoading,
    mutateAsync: signOutAsync,
  } = useMutation({
    mutationKey: ["signOut"],
    mutationFn: apiSignOut,
    onSuccess: () => {
      // queryClient.setQueryData(["member"], null);
      queryClient.removeQueries();
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      toast.success(`您已登出`);

      navigate(`/`, { replace: true });
    },

    onError: (error) => {
      console.error(error);
      toast.error(`登出時發生錯誤`);
    },
  });

  return { signOut, isLoading, signOutAsync };
}
