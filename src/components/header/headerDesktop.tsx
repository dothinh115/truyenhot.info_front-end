import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Link from "next/link";

type Props = {};

export const HeaderDesktop = (props: Props) => {
  return (
    <>
      <Box
        display={{
          md: "block",
          sm: "none",
        }}
        height={"100%"}
        margin={"auto"}
      >
        <Container
          maxWidth={"md"}
          sx={{
            m: "auto!important",
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            height={"50px"}
          >
            <Box>
              <Box
                component={Link}
                sx={{
                  color: "#fff",
                  display: "flex",
                  alignItem: "center",
                  textDecoration: "none",
                  gap: "8px",
                  "& > svg": {
                    fontSize: "50px",
                    height: "50px",
                  },
                  "& > p": {
                    height: "50px",
                    display: "flex",
                    alignItems: "center!important",
                  },
                  height: "50px",
                }}
                href="/"
              >
                <MenuBookIcon />
                <Typography>TRUYENHOT.INFO</Typography>
              </Box>
            </Box>
            <Box>Right</Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};
