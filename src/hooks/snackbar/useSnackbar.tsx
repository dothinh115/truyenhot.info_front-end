import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { useState } from "react";

export const useSnackbar = () => {
  const [snackbarOpen, setSnackbarOpen] = useState<{
    open: boolean;
    message: string;
    type?: AlertColor | undefined;
  }>({
    open: false,
    message: "success",
    type: undefined,
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen({
      open: false,
      message: "",
      type: "success",
    });
  };

  const snackbar = (
    <Snackbar
      autoHideDuration={6000}
      open={snackbarOpen.open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Alert onClose={handleClose} severity={snackbarOpen.type}>
        {snackbarOpen.message}
      </Alert>
    </Snackbar>
  );

  return {
    snackbar,
    setSnackbar: setSnackbarOpen,
  };
};
