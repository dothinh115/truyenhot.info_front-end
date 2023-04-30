import React from "react";
import { AdminLayout } from "@/layouts";
import { StoryInterface } from "@/models/stories";
import CachedIcon from "@mui/icons-material/Cached";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Button, Container, Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Link from "next/link";
import useSWR from "swr";
type Props = {};

export const AdminBaseStats = (props: Props) => {
  const {
    data: dataStatsData,
    mutate: dataStatsMutate,
    isValidating: dataStatsIsValidating,
    isLoading: dataStatsIsLoading,
  } = useSWR(`/admin/getDataStats`);
  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Thông tin cơ bản</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell scope="row">Tổng số truyện</TableCell>
              <TableCell align="right">
                {dataStatsData?.result.totalStories}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">Tổng số chương truyện</TableCell>
              <TableCell align="right">
                {dataStatsData?.result.totalChapters}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">Tổng số lượt xem</TableCell>
              <TableCell align="right">
                {dataStatsData?.result.totalViews}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
