import { useSnackbar } from "@/hooks/snackbar";
import { StoryInterface } from "@/models/stories";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { API } from "@/utils/config";
type Props = {
  storyData: StoryInterface;
  mutate: any;
};
const filetypes = /jpeg|jpg|png|gif/;

export const AdminNoCoverStoriesRow = ({ storyData, mutate }: Props) => {
  const { setSnackbar, snackbar } = useSnackbar();
  const [image, setImage] = useState<string | null>();
  const [copied, setCopied] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  const onDragHandle = (event: React.DragEvent<HTMLLIElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const file = event.dataTransfer.files[0];
      const fileTypeCheck = filetypes.test(file.name);
      if (!fileTypeCheck) {
        setSnackbar({
          message: "Chỉ hỗ trợ đuôi jpeg|jpg|png|gif",
          open: true,
          type: "error",
        });
      } else {
        //hiện hình
        const fileReader: FileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          const img = fileReader?.result as string;
          setImage(img);
          setFile(file);
        };
      }
    }
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  });
  return (
    <>
      {snackbar}
      <Stack
        onDrop={onDragHandle}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        component={"li"}
        bgcolor={image ? "#eee" : "#fff"}
        p={1}
        sx={{
          border: "1px dashed #7986cba6",
          height: "100px",
        }}
        direction={"row"}
        spacing={1}
        alignItems={"center"}
        mb={1}
        key={storyData.story_code}
        maxHeight={{
          xs: "100px",
        }}
        borderRadius={"15px"}
        overflow={"hidden"}
      >
        <Stack
          width={{
            md: "20%",
            xs: "30%",
          }}
          height={"100%"}
          direction={"row"}
          alignItems={"center"}
        >
          <Box
            component={Link}
            href={`/admin/stories/${storyData.story_code}?goAround=true`}
            width={"100%"}
            height={"100%"}
          >
            <Box
              component={"img"}
              src={image ? image : storyData.story_cover}
              maxHeight={"90px"}
              width={"100%"}
              height={"100%"}
              sx={{
                objectFit: "cover",
              }}
              borderRadius={"15px"}
            />
          </Box>
        </Stack>
        <Box sx={{ flexGrow: "1" }} width={"60%"}>
          <Box
            fontSize={18}
            color={"#283593"}
            sx={{
              textDecoration: "none",
              fontSize: {
                md: "1.3em",
                xs: "1em",
              },
              userSelect: "all",
            }}
            fontWeight={"bold"}
          >
            {storyData.story_title}
            {!copied && (
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(storyData.story_title);
                  setCopied(true);
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            )}
          </Box>
          <Typography
            display={"flex"}
            alignItems={"center"}
            fontSize={14}
            color={"#616161"}
            sx={{
              textDecoration: "none",
              fontSize: {
                md: "1em",
                xs: ".9em",
              },
              "& svg": {
                mr: 1,
                fontSize: "20px",
              },
            }}
          >
            {storyData.story_author}
          </Typography>
        </Box>
        <IconButton
          onClick={async () => {
            const formData = new FormData();
            if (file) formData.append("cover_img", file);
            try {
              await API({
                url: `/stories/update/${storyData?.story_code}`,
                data: formData,
                method: "PUT",
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });
              await setTimeout(async () => {
                await mutate();
              }, 1500);
              setSnackbar({
                message: "Update truyện thành công",
                open: true,
              });
            } catch (error: any) {
              setSnackbar({
                message: error.response?.data.message,
                open: true,
                type: "error",
              });
            }
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Stack>
    </>
  );
};
