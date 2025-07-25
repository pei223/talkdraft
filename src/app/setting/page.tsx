import { Box } from "@chakra-ui/react";
import ModelSettingsPage from "@/components/compositions/ModelSettingsPage";
import AppHeading from "@/components/common/AppHeading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "モデル設定 | Talkdraft",
  robots: {
    index: false,
  },
};

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
