import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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
