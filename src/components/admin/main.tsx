import { AdminLayoutContext } from "@/layouts";
import MenuIcon from "@mui/icons-material/Menu";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { ReactNode, useContext } from "react";
interface AdminMainInterface {
  children: ReactNode;
}

export const AdminMain = ({ children }: AdminMainInterface) => {
  const { setOpen } = useContext<any>(AdminLayoutContext);
  return (
    <>
      <Stack
        component={"div"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{
          bgcolor: "#03a9f4",
        }}
      >
        <Box
          component={Button}
          size="small"
          sx={{
            "& svg": {
              color: "primary.contrastText",
            },
          }}
          display={{
            xs: "inline-block",
            md: "none",
          }}
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </Box>
        <Box
          sx={{
            p: 1,
            pr: 2,
            color: "primary.contrastText",
          }}
        >
          <Avatar>F</Avatar>
        </Box>
      </Stack>
      <Box
        sx={{
          height: "calc(100vh - 56px)",
          overflow: "auto",
        }}
        p={0}
      >
        {children}
      </Box>
    </>
  );
};
