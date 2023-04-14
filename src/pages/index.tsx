import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

type Props = {};

const Index = (props: Props) => {
  return (
    <Box>
      <Button
        color="success"
        variant="contained"
        sx={{
          color: "red",
        }}
      >
        Test
      </Button>
    </Box>
  );
};

export default Index;
