import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useSWR from "swr";
type Props = {};

export const BaseStats = (props: Props) => {
  const {
    data: dataStatsData,
    mutate: dataStatsMutate,
    isValidating: dataStatsIsValidating,
  } = useSWR(`/stats/getBaseStats`, {
    dedupingInterval: 1000 * 60 * 60,
  });
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
              <TableCell align="right">
                {dataStatsData?.result.totalStories}
                {dataStatsIsValidating && <CircularProgress size={"1em"} />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">Tổng số chương truyện:</TableCell>
              <TableCell align="right">
                {dataStatsData?.result.totalChapters}
                {dataStatsIsValidating && <CircularProgress size={"1em"} />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">Tổng số lượt xem:</TableCell>
              <TableCell align="right">
                {dataStatsData?.result.totalViews}
                {dataStatsIsValidating && <CircularProgress size={"1em"} />}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
