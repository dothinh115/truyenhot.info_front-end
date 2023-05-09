import { useSnackbar } from "@/hooks/snackbar";
import { Stack, Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
type Props = {
  onChange: (file: File | null) => void;
};

const filetypes = /jpeg|jpg|png|gif/;

export const DragAndDropImg = ({ onChange }: Props) => {
  const [image, setImage] = useState<string | null>();
  const { setSnackbar, snackbar } = useSnackbar();

  const onDragHandle = (event: React.DragEvent<HTMLDivElement>) => {
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
        return;
      }
      //hiện hình
      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        const img = fileReader?.result as string;
        setImage(img);
      };
      onChange(file);
      event.currentTarget.blur();
    }
  };

  const deleteHandle = () => {
    setImage(null);
    onChange(null);
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    let item = e.clipboardData.files[0];

    if (item) {
      const file = item;
      const fileTypeCheck = filetypes.test(file?.name);
      if (!fileTypeCheck) {
        setSnackbar({
          message: "Chỉ hỗ trợ đuôi jpeg|jpg|png|gif",
          open: true,
          type: "error",
        });
        return;
      }
      //hiện hình
      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        const img = fileReader?.result as string;
        setImage(img);
      };
      onChange(file);
    } else {
      e.preventDefault();
      setSnackbar({
        message: "Chỉ được dán hình!",
        open: true,
        type: "error",
      });
    }
  };

  return (
    <>
      {snackbar}
      <Stack
        component={"div"}
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        mb={2}
        border={"1px dashed #ccc"}
        width={"100%"}
        height={"100px"}
        onDrop={onDragHandle}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        position={"relative"}
        p={1}
      >
        {image ? (
          <>
            <Box
              component={"img"}
              height={"80px"}
              width={"80px"}
              sx={{ objectFit: "cover" }}
              src={image}
            />
            <Button
              type="button"
              color="error"
              variant="contained"
              size="small"
              sx={{
                position: "absolute",
                right: "5px",
                top: "5px",
              }}
              onClick={deleteHandle}
            >
              <DeleteForeverIcon />
            </Button>
          </>
        ) : (
          "Kéo thả ảnh vào đây"
        )}
      </Stack>
      <Box
        component={TextField}
        fullWidth
        sx={{ mb: 1 }}
        size="small"
        placeholder="Dán ảnh vào đây"
        onPaste={onPaste}
      />
    </>
  );
};
