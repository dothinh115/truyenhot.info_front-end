import { BaseStatsInterface } from "@/models/home";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type Props = {
  stats?: BaseStatsInterface;
};

export const BaseStats = ({ stats }: Props) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead
            sx={{
              bgcolor: "primary.main",
              "& th": {
                color: "primary.contrastText",
              },
            }}
          >
            <TableRow>
              <TableCell>Thống kê</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell scope="row">Tổng số truyện:</TableCell>
              <TableCell align="right">{stats?.totalStories}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">Số chương truyện:</TableCell>
              <TableCell align="right">{stats?.totalChapters}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">Số lượt xem:</TableCell>
              <TableCell align="right">{stats?.totalViews}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
