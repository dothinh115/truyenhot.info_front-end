import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { useState } from "react";

export const useSnackbar = () => {
  const [snackbarOpen, setSnackbarOpen] = useState<{
    open: boolean;
    message: string;
    type: AlertColor | undefined;
  }>({
    open: false,
    message: "",
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
      type: "info",
    });
  };

  const snackbar = (
    <Snackbar
      autoHideDuration={6000}
      open={snackbarOpen.open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
