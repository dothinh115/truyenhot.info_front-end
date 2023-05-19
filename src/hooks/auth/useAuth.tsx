import { LoginPayloadInterface } from "@/models/auth";
import { API } from "@/utils/config";
import useSWR, { SWRConfiguration } from "swr";

export const useAuth = (option?: SWRConfiguration) => {
  const {
    data: profile,
    error,
    isValidating,
    mutate,
  } = useSWR("/users/profile", {
    revalidateOnFocus: false,
    dedupingInterval: 1000 * 60 * 60, //1 giờ mới đi call lại
    ...option,
  });

  const firstLoading = profile === undefined && error === undefined;

  const login = async (payload: LoginPayloadInterface) => {
    await API.post("/signIn", payload);
    mutate();
  };

  const logout = async () => {
    await API.get("/signOut");
    window.location.reload();
  };

  return {
    profile,
    error,
    isValidating,
    mutate,
    login,
    logout,
    firstLoading,
  };
};
