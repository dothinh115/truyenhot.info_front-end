import React from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
type Props = {};

export const IndexRowLoading = (props: Props) => {
  return (
    <>
      <TableRow
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          "& td": { p: "6px" },
          animationDuration: "1s",
          animationFillMode: "forwards",
          animationIterationCount: "infinite",
          animationName: "story-list-loading",
          animationTimingFunction: "linear",
          background: "#f6f7f8",
          backgroundImage:
            "linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)",
          backgroundSize: "200%",
          height: "37px",
          position: "relative",
        }}
      >
        <TableCell
          height={"37px"}
          width={"60%"}
          sx={{
            position: "relative",
            "& > div ": {
              background: "#fff",
              position: "absolute",
            },
          }}
        >
          <Box sx={{ top: 0, left: 0, right: 0, height: "10px" }}></Box>
          <Box sx={{ bottom: 0, left: 0, right: 0, height: "10px" }}></Box>
          <Box sx={{ top: 0, left: 0, bottom: 0, width: "10px" }}></Box>
          <Box
            sx={{
              height: "calc(100% - 10px - 10px)",
              top: "10px",
              width: "15px",
              left: "calc(10px + 18px)",
            }}
          ></Box>
          <Box
            sx={{
              height: "calc(100% - 10px - 10px)",
              top: "10px",
              width: {
                md: "50px",
                xs: 0,
              },
              right: 0,
            }}
          ></Box>
        </TableCell>
        <TableCell
          height={"37px"}
          sx={{
            position: "relative",
            "& > div ": {
              background: "#fff",
              position: "absolute",
            },
            display: {
              md: "table-cell",
              xs: "none",
            },
          }}
        >
          <Box sx={{ top: 0, left: 0, right: 0, height: "10px" }}></Box>
          <Box sx={{ bottom: 0, left: 0, right: 0, height: "10px" }}></Box>
          <Box
            sx={{
              height: "calc(100% - 10px - 10px)",
              top: "10px",
              width: "30px",
              left: 0,
            }}
          ></Box>
          <Box
            sx={{
              height: "calc(100% - 10px - 10px)",
              top: "10px",
              width: "20px",
              right: 0,
            }}
          ></Box>
        </TableCell>
        <TableCell
          height={"37px"}
          sx={{
            position: "relative",
            "& > div ": {
              background: "#fff",
              position: "absolute",
            },
          }}
        >
          <Box sx={{ top: 0, left: 0, right: 0, height: "10px" }}></Box>
          <Box sx={{ bottom: 0, left: 0, right: 0, height: "10px" }}></Box>
          <Box sx={{ top: 0, right: 0, bottom: 0, width: "10px" }}></Box>
          <Box
            sx={{
              height: "calc(100% - 10px - 10px)",
              top: "10px",
              width: "30px",
              left: 0,
            }}
          ></Box>
          <Box
            sx={{
              height: "calc(100% - 10px - 10px)",
              top: "10px",
              width: "60px",
              left: 0,
              display: {
                md: "none",
                xs: "table-cell",
              },
            }}
          ></Box>
        </TableCell>
      </TableRow>
    </>
  );
};
