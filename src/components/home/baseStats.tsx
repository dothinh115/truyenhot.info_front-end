import { BaseStatsInterface } from "@/models/home";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
type Props = {
  stats?: BaseStatsInterface;
};

export const BaseStats = ({ stats }: Props) => {
  return (
    <>
      <Stack spacing={2}>
        <Box
          bgcolor={"#fff"}
          borderRadius={"15px"}
          overflow={"hidden"}
          border={"1px dashed #7986cba6"}
          mb={2}
        >
          <Box
            component={"h3"}
            m={"4px 4px 0 4px"}
            px={2}
            py={1}
            color={"#fff"}
            fontWeight={"500"}
            bgcolor={"#7986cbc2"}
            borderRadius={"10px 10px 0 0"}
          >
            Thống kê
          </Box>

          <Box
            component={"ul"}
            sx={{
              p: 0,
              my: 0,
              mb: 0,
              "& > li": {
                listStyleType: "none",
                px: 1,
                m: 0,
                borderBottom: "1px dashed #7986cba6",
                height: "30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "&:last-of-type": {
                  borderBottom: "none",
                },
                "& > a": {
                  display: "block",
                  height: "100%",
                  lineHeight: "30px",
                  textDecoration: "none",
                  color: "#303f9f",
                  textAlign: "center",
                },
              },
            }}
          >
            <Box component={"li"}>
              <Box>Tổng số truyện:</Box>
              <Box>{stats?.totalStories}</Box>
            </Box>

            <Box component={"li"}>
              <Box>Số chương truyện:</Box>
              <Box>{stats?.totalChapters}</Box>
            </Box>

            <Box component={"li"}>
              <Box>Lượt xem:</Box>
              <Box>{stats?.totalViews}</Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </>
  );
};
