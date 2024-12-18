import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

import React from "react";

const useCustomToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (title: string, description: string, status: "success" | "error") => {
      toast({
        title,
        description,
        status,
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    },
    [toast]
  );
  return showToast;
};

export default useCustomToast;
