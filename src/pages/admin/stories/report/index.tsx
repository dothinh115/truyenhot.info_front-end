import { useSnackbar } from "@/hooks/snackbar";
import { AdminLayout } from "@/layouts/admin";
import { ReportInterface } from "@/models/stories";
import { API } from "@/utils/config";
import { timeSince } from "@/utils/function";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CachedIcon from "@mui/icons-material/Cached";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import useSWR from "swr";

type Props = {};

const modalStyled = {
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "6px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    md: "20%",
    xs: "90%",
  },
  p: 2,
  "& > div": {
    pb: 1,
    mb: 1,
  },
};

const AdminReport = (props: Props) => {
  const { snackbar, setSnackbar } = useSnackbar();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const reportDataById = useRef<string | null>(null);
  const {
    data: reportData,
    mutate: reportMutate,
    isValidating: reportIsValidating,
  } = useSWR(`/stories/errorReport/getAll`);

  const router = useRouter();
  const { data: getReportData, mutate: getReportMutate } = useSWR(
    `/stories/errorReport/get/${reportDataById?.current}`,
    {
      revalidateOnMount: false,
    }
  );

  const deleteHandle = async (_id: string) => {
    try {
      await API.delete(`/stories/errorReport/delete/${_id}`);
      setSnackbar({
        open: true,
        message: "Xóa report thành công!",
      });
      reportMutate();
    } catch (error: any) {
      setSnackbar({
        message: error.response?.data.message,
        open: true,
        type: "error",
      });
    }
  };

  const modalOpenHandle = () => {
    if (!modalOpen) reportDataById.current = null;
    setModalOpen(!modalOpen);
  };

  return (
    <>
      {snackbar}
      <Modal open={modalOpen} onClose={modalOpenHandle}>
        <Box sx={modalStyled}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            borderBottom={"1px dashed #ccc"}
          >
            <Box>Loại lỗi:</Box>
            <Box>{getReportData?.result?.report_title}</Box>
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            borderBottom={"1px dashed #ccc"}
          >
            <Box>Mô tả lỗi:</Box>
            <Box>{getReportData?.result?.report_description}</Box>
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box>Truyện lỗi:</Box>
            <IconButton
              onClick={() =>
                router.push({
                  pathname: `/admin/stories/[story_code]`,
                  query: {
                    story_code: getReportData?.result?.story_code,
                    goAround: true,
                  },
                })
              }
            >
              <ArrowForwardIcon />
            </IconButton>
          </Stack>
          <Box className="hr" my={1} />
          <Box textAlign={"right"}>
            <IconButton
              sx={{
                width: "40px",
                height: "40px",
                "& svg": {
                  color: "rgba(255, 0, 0, .8)",
                },
                p: 0,
              }}
              onClick={modalOpenHandle}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
      <Stack direction={"row"} justifyContent={"center"}>
        <Container maxWidth={"md"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            component={"h2"}
            mb={0}
          >
            Danh sách lỗi được báo cáo
            <Button
              size="small"
              variant="contained"
              type="button"
              disabled={reportIsValidating ? true : false}
              onClick={() => reportMutate()}
            >
              <CachedIcon />
            </Button>
          </Stack>
          <Box className={"hr"} mt={2} />
          <Stack direction={"row"} spacing={1} mt={4}>
            {reportData?.result.length === 0
              ? "Chưa có lỗi nào dc báo cáo"
              : reportData?.result.map((report: ReportInterface) => {
                  return (
                    <Chip
                      key={report._id}
                      label={`${report.report_title} [${
                        report.created_at &&
                        timeSince(
                          Math.abs(
                            new Date().valueOf() -
                              new Date(report?.created_at).valueOf()
                          )
                        )
                      } trước]`}
                      variant="outlined"
                      onDelete={() => deleteHandle(report._id)}
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={async () => {
                        if (reportDataById.current !== report._id) {
                          reportDataById.current = report._id;
                          getReportMutate();
                        }
                        setModalOpen(true);
                      }}
                    />
                  );
                })}
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

AdminReport.Layout = AdminLayout;
export default AdminReport;
