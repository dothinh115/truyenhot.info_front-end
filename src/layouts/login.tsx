import { useAuth } from "@/hooks/auth";
import { LoginLayoutInterface } from "@/models";
import { Stack } from "@mui/material";
import { Container } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const LoginLayout = ({ children }: LoginLayoutInterface) => {
  const { profile } = useAuth();

  const router = useRouter();

  const { backTo } = router.query;

  useEffect(() => {
    if (profile)
      router.push(backTo && typeof backTo === "string" ? backTo : "/");
  }, [profile]);

  if (profile) return null;
  else
    return (
      <Stack
        alignItems={"center"}
        sx={{
          backgroundColor: "#424242",
        }}
      >
        <Container maxWidth="xs">
          <Stack minHeight={"100vh"}>
            <Stack my={3} flexGrow={1} justifyContent={"center"}>
              <Stack
                bgcolor={"#fff"}
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
};
