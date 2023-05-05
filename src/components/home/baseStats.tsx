import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useSWR from "swr";

type Props = {
  stats?: StatsType;
};

type StatsType = {
  totalStories: number;
  totalViews: number;
  totalChapters: number;
};

export const BaseStats = ({ stats }: Props) => {
  const { data: dataStatsData, isValidating: dataStatsIsValidating } = useSWR(
    `/stats/getBaseStats`,
    {
      dedupingInterval: 1000 * 60 * 60,
      revalidateOnMount: stats ? false : true,
    }
  );
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
                {stats ? (
                  stats?.totalStories
                ) : (
                  <>
                    {dataStatsData?.result.totalStories}
                    {dataStatsIsValidating && <CircularProgress size={"1em"} />}
                  </>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">Số chương truyện:</TableCell>
              <TableCell align="right">
                {stats ? (
                  stats?.totalChapters
                ) : (
                  <>
                    {dataStatsData?.result.totalChapters}
                    {dataStatsIsValidating && <CircularProgress size={"1em"} />}
                  </>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">Số lượt xem:</TableCell>
              <TableCell align="right">
                {stats ? (
                  stats?.totalViews
                ) : (
                  <>
                    {dataStatsData?.result.totalViews}
                    {dataStatsIsValidating && <CircularProgress size={"1em"} />}
                  </>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
