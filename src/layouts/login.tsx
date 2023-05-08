import { AdminLoading } from "@/components/loading/index";
import { useAuth } from "@/hooks/auth";
import { LoginLayoutInterface } from "@/models";
import { PermissionVariables } from "@/utils/config";
import { Stack } from "@mui/material";
import { Container } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const LoginLayout = ({ children }: LoginLayoutInterface) => {
  const { profile, isValidating, firstLoading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (
      !isValidating &&
      profile &&
      profile?.result.permission > PermissionVariables.Editors
    )
      router.push("/admin");
    else if (!isValidating && profile) router.push("/");
  }, [profile, isValidating]);

  if (!firstLoading && profile) {
    return <AdminLoading open={isValidating} />;
  } else {
    return (
      <Stack alignItems={"center"}>
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
  }
};
