import { BaseStatsInterface } from "@/models/home";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
type Props = {
  stats?: BaseStatsInterface;
};

const Wrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.myBackground.default,
  borderRadius: "15px",
  overflow: "hidden",
  borderWidth: "1px",
  borderStyle: "dashed",
  borderColor: theme.palette.mySecondary.main,
  marginBottom: theme.spacing(2),
  padding: "4px",
}));

const Heading = styled("h3")(({ theme }) => ({
  margin: "0",
  padding: theme.spacing(1),
  borderBottomWidth: "1px",
  borderBottomStyle: "dashed",
  borderBottomColor: theme.palette.mySecondary.main,
  color: theme.palette.myText.main,
  fontWeight: 500,
  backgroundColor: theme.palette.myBackground.main,
  borderRadius: "10px 10px 0 0",
}));

const UList = styled("ul")(({ theme }) => ({
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

export const BaseStats = ({ stats }: Props) => {
  return (
    <>
      <Stack spacing={2}>
        <Wrapper>
          <Heading>Thống kê</Heading>

          <UList>
            <ListItem>
              <Box>Tổng số truyện:</Box>
              <Box>{stats?.totalStories}</Box>
            </ListItem>

            <ListItem>
              <Box>Số chương truyện:</Box>
              <Box>{stats?.totalChapters}</Box>
            </ListItem>

            <ListItem>
              <Box>Lượt xem:</Box>
              <Box>{stats?.totalViews}</Box>
            </ListItem>
          </UList>
        </Wrapper>
      </Stack>
    </>
  );
};
