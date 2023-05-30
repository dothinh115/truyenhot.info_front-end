import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

type Props = {
  open: boolean;
};

export const AdminLoading = ({ open }: Props) => {
  return (
    <Stack
      sx={{
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "primary.dark",
        opacity: open ? ".7" : "0",
        visibility: open ? "visible" : "hidden",
        transition: ".5s all ease",
        zIndex: "100",
      }}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box className="lds-facebook">
        <Box></Box>
        <Box></Box>
        <Box></Box>
      </Box>
    </Stack>
  );
};
