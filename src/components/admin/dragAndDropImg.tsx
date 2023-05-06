import { useSnackbar } from "@/hooks/snackbar";
import { Stack, Box, Button } from "@mui/material";
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
    }
  };

  const deleteHandle = () => {
    setImage(null);
    onChange(null);
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
            <Box component={"img"} maxHeight={"100px"} src={image} />
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
    </>
  );
};
