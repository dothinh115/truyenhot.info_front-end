import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import React from "react";
import { Block } from "../block";
import VisibilityIcon from "@mui/icons-material/Visibility";

type Props = {};

export const StorySidebar = (props: Props) => {
  return (
    <Block>
      <Box
        component={"h1"}
        color={"#616161"}
        my={0}
        p={1}
        sx={{
          borderBottom: "1px solid #eee",
        }}
      >
        Thể loại
      </Box>
      <Box
        component={"ul"}
        sx={{
          p: 1,
          listStyleType: "none",
          counterReset: "li",
          "& > li > a": {
            textDecoration: "none",
            color: "#000",
            display: "flex",
            flexWrap: "wrap",
            "& > div": {
              width: "calc(100% - 100px)",
            },
            "&::before": {
              content: "counter(li)",
              counterIncrement: "li",
              marginRight: "5px",
              display: "inline-block",
              width: "50px",
              height: "50px",
              backgroundColor: "#ff7043",
              color: "#fff",
              textAlign: "center",
              lineHeight: "50px",
              fontSize: "20px",
              borderRadius: "50%",
            },
          },
          "&>li": {
            my: 1,
          },
        }}
      >
        <Box component={"li"}>
          <Box component={Link} href="/">
            <Box component={"div"}>
              Thể loại 1
              <Box
                component={"div"}
                sx={{
                  height: "30px",
                  lineHeight: "30px",
                  display: "flex",
                  alignItem: "center",
                  "& > svg": {
                    lineHeight: "30px",
                    height: "30px",
                  },
                }}
              >
                <VisibilityIcon />
                <Box
                  component={"span"}
                  sx={{
                    display: "block",
                    height: "30px",
                    lineHeight: "30px",
                    fontSize: "14px",
                    fontWeight: "600",
                    ml: 2,
                  }}
                >
                  3,212,343
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box component={"li"}>
          <Box component={Link} href="/">
            <Box component={"div"}>
              Thể loại 2
              <Box
                component={"div"}
                sx={{
                  height: "30px",
                  lineHeight: "30px",
                  display: "flex",
                  alignItem: "center",
                  "& > svg": {
                    lineHeight: "30px",
                    height: "30px",
                  },
                }}
              >
                <VisibilityIcon />
                <Box
                  component={"span"}
                  sx={{
                    display: "block",
                    height: "30px",
                    lineHeight: "30px",
                    fontSize: "14px",
                    fontWeight: "600",
                    ml: 2,
                  }}
                >
                  3,212,343
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Block>
  );
};
