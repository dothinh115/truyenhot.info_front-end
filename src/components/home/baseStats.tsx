import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled, alpha } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import useSWR from "swr";

type Props = {};

const Wrapper = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.2)}`,
  marginBottom: theme.spacing(2),
}));

const Heading = styled("h2")(({ theme }) => ({
  margin: "0",
  padding: "8px",
  borderBottomWidth: "1px",
  borderBottomStyle: "dashed",
  borderBottomColor: theme.palette.mySecondary.main,
  color: theme.palette.myText.main,
  fontWeight: 600,
  backgroundColor: theme.palette.myBackground.main,
  borderColor: theme.palette.myBackground.main,
  textTransform: "uppercase",
  fontSize: "14px",
}));

const UList = styled("ul")(() => ({
  padding: "0",
  margin: 0,
}));

const ListItem = styled("li")(({ theme }) => ({
  padding: "0 4px",
  display: "flex",
  justifyContent: "space-between",
  height: "30px",
  borderBottomWidth: "1px",
  borderBottomStyle: "dashed",
  borderBottomColor: theme.palette.mySecondary.main,
  lineHeight: "30px",
  "&:last-of-type": {
    borderRadius: "0 0 10px 10px",
    borderBottom: "none",
  },
  color: theme.palette.myText.primary,
  backgroundColor: theme.palette.myBackground.secondary,
}));

const BaseStats = (props: Props) => {
  const { data: baseStatsData, isValidating: baseStatsIsValidating } =
    useSWR(`/stats/getBaseStats`);
  return (
    <>
      <Stack spacing={2}>
        <Wrapper>
          <Heading>Thống kê</Heading>

          <UList>
            <ListItem>
              <Box>Tổng số truyện:</Box>
              <Box>
                {baseStatsIsValidating ? (
                  <CircularProgress size={"1em"} />
                ) : (
                  baseStatsData?.result.totalStories
                )}
              </Box>
            </ListItem>

            <ListItem>
              <Box>Số chương truyện:</Box>
              <Box>
                {baseStatsIsValidating ? (
                  <CircularProgress size={"1em"} />
                ) : (
                  baseStatsData?.result.totalChapters
                )}
              </Box>
            </ListItem>

            <ListItem>
              <Box>Lượt xem:</Box>
              <Box>
                {baseStatsIsValidating ? (
                  <CircularProgress size={"1em"} />
                ) : (
                  baseStatsData?.result.totalViews
                )}
              </Box>
            </ListItem>
          </UList>
        </Wrapper>
      </Stack>
    </>
  );
};

export default BaseStats;
