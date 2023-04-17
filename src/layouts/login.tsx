import { AdminLoading } from "@/components/loading";
import { useAuth } from "@/hooks/auth";
import { LoginLayoutInterface } from "@/models";
import { Stack } from "@mui/material";
import { Container } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const LoginLayout = ({ children }: LoginLayoutInterface) => {
  const { profile, isLoading, firstLoading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && profile) router.push("/");
  }, [profile, isLoading]);

  if (!firstLoading && profile) {
    return (
      <AdminLoading
        style={{
          opacity: isLoading ? 1 : 0,
          transition: "all .2s linear",
          visibility: isLoading ? "visible" : "hidden",
        }}
      />
    );
  } else {
    return (
      <Stack alignItems={"center"}>
        <Container maxWidth="xs">
          <Stack minHeight={"100vh"}>
            <Stack my={3} flexGrow={1} justifyContent={"center"}>
              <Stack
                justifyContent={"center"}
                p={2}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              >
                {children}
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Stack>
    );
  }
};
