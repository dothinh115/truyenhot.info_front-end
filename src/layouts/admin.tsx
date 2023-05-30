import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { AdminMain, AdminSidebar } from "@/components/admin";
import { AdminLoading } from "@/components/loading/index";
import { AdminLayoutInterface } from "@/models";
import { PermissionVariables } from "@/utils/config";

export const AdminLayoutContext = createContext({});

export const AdminLayout = ({ children }: AdminLayoutInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { profile, isValidating } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (
      (!isValidating && !profile) ||
      (!isValidating &&
        profile?.result.permission < PermissionVariables.Moderators)
    )
      router.push("/login");
    setLoading(isValidating);
  }, [profile, isValidating]);

  if (!profile) return null;

  return (
    <AdminLayoutContext.Provider value={{ loading, setLoading, setOpen }}>
      <AdminLoading open={loading} />
      <Container maxWidth={false} sx={{ p: "0!important" }}>
        <Stack direction={"row"} bgcolor={"#fff"}>
          <Box
            onClick={() => setOpen(false)}
            bgcolor={{
              xs: "rgba(0, 0, 0, .85)",
              md: "transparent",
            }}
            position={"fixed"}
            width={"100%"}
            height={"100%"}
            zIndex={50}
            visibility={open ? "visible" : "hidden"}
          ></Box>
          <Box
            minHeight={"100vh"}
            flexGrow={1}
            sx={{
              backgroundColor: "#1a237e",
              transition: ".5s ease 0s",
            }}
            width={{
              md: "280px",
              xs: open ? "85%" : 0,
            }}
            zIndex={100}
            display={"block"}
            position={{
              xs: "fixed",
              md: "static",
            }}
            left={{
              xs: open ? 0 : "-100%",
            }}
          >
            <AdminSidebar />
          </Box>
          <Container maxWidth={false} sx={{ p: "0!important" }}>
            <AdminMain>{children}</AdminMain>
          </Container>
        </Stack>
      </Container>
    </AdminLayoutContext.Provider>
  );
};
