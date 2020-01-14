import React from 'react';
import { Box, Toast } from 'gestalt';

export const ToastMessage = ({ show, message }) =>
  show && (
    <Box>
      <Toast color="orange" text={message} />
    </Box>
  );
