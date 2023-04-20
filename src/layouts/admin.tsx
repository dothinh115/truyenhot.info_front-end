import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import { Stack, Container, Box } from "@mui/material";
import { AdminMain, AdminSidebar } from "@/components/admin";
import { AdminLoading } from "@/components/loading/index";
import { AdminLayoutInterface } from "@/models";
import { PermissionVariables } from "@/utils/config";

export const AdminLayoutContext = createContext({});

export const AdminLayout = ({ children }: AdminLayoutInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { profile, isLoading, firstLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (
      (!isLoading && !profile) ||
      (!isLoading &&
        profile?.result.permission_rules.permission_id <
          PermissionVariables.Editors)
    )
      router.push("/login");
    setLoading(isLoading);
  }, [profile, isLoading]);

  if (
    !firstLoading &&
    profile?.result.permission_rules.permission_id < PermissionVariables.Editors
  )
    return <AdminLoading open={isLoading} />;

  return (
    <AdminLayoutContext.Provider value={{ loading, setLoading }}>
      <AdminLoading open={loading} />
      <Container maxWidth={false}>
        <Stack direction={"row"} bgcolor={"#fff"}>
          <Box
            minHeight={"100vh"}
            flexGrow={1}
            sx={{
              backgroundColor: "#1a237e",
            }}
            minWidth={"230px"}
          >
            <AdminSidebar />
          </Box>
          <Container maxWidth={false}>
            <AdminMain>{children}</AdminMain>
          </Container>
        </Stack>
      </Container>
    </AdminLayoutContext.Provider>
  );
};
