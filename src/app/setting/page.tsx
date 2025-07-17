"use client";

import { Box } from "@chakra-ui/react";
import ModelSettingsPage from "@/components/compositions/ModelSettingsPage";
import AppHeading from "@/components/common/AppHeading";

export default function SettingPage() {
  return (
    <Box p={6} maxWidth="800px" mx="auto">
      <AppHeading level="main" mb={6}>
        設定
      </AppHeading>
      <ModelSettingsPage />
    </Box>
  );
}
