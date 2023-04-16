import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Stack, Container } from "@mui/material";
import { AdminMain, AdminSidebar } from "@/components/admin";
import { AdminLoading } from "@/components/loading";
import { AdminLayoutInterface } from "@/models";

export const AdminLayout = ({ children }: AdminLayoutInterface) => {
  const { profile, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !profile) router.push("/login");
  }, [profile, isLoading]);

  return (
    <>
      <AdminLoading
        style={{
          opacity: isLoading ? 1 : 0,
          transition: "all .2s linear",
          visibility: isLoading ? "visible" : "hidden",
        }}
      />
      <Container maxWidth={false}>
        <Stack direction={"row"}>
          <AdminSidebar />
          <AdminMain children={children} />
        </Stack>
      </Container>
    </>
  );
};
