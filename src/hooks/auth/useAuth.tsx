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
    dedupingInterval: 1000 * 60 * 60,
    ...option,
  });

  const firstLoading = profile === undefined && error === undefined;

  const login = async (payload: LoginPayloadInterface) => {
    const a = await API.post("/signIn", payload);
    mutate();
    console.log(a);
  };

  const logout = async () => {
    await API.get("/signOut");
    mutate({}, false);
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
