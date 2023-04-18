import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Stack, Container } from "@mui/material";
import { AdminMain, AdminSidebar } from "@/components/admin";
import { AdminLoading } from "@/components/loading";
import { AdminLayoutInterface } from "@/models";
import { PermissionVariables } from "@/utils/config";

export const AdminLayout = ({ children }: AdminLayoutInterface) => {
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
  }, [profile, isLoading]);

  if (
    !firstLoading &&
    profile?.result.permission_rules.permission_id < PermissionVariables.Editors
  )
    return (
      <AdminLoading
        style={{
          opacity: isLoading ? 1 : 0,
          transition: "all .2s linear",
          visibility: isLoading ? "visible" : "hidden",
        }}
      />
    );

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
