import { Stack, Box } from "@mui/material";

export default function Loading() {
  return (
    <Stack
      sx={{
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
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
}
