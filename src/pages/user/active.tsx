import { LoginLayout } from "@/layouts";
import { API } from "@/utils/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
type Props = {};

const UserActive = (props: Props) => {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState<string>("");
  const activeRequest = async () => {
    try {
      const response: any = await API.get(`/userActive/${token}`);
      setMessage(response.result);
    } catch (error: any) {
      setMessage(error.response?.data.message);
    }
  };
  useEffect(() => {
    if (token) {
      activeRequest();
    } else {
      setMessage("Token không hợp lệ hoặc đã hết hạn!");
    }
  }, [token]);
  if (!message) return null;
  return (
    <>
      {message}
      <br />
      <Divider />
      <Button
        LinkComponent={Link}
        href="/"
        variant="contained"
        sx={{ mt: 1 }}
        startIcon={<ArrowBackIcon color="inherit" />}
        size="small"
      >
        Về trang chủ
      </Button>
    </>
  );
};

UserActive.Layout = LoginLayout;

export default UserActive;
