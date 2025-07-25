import AppHeading from "@/components/common/AppHeading";
import SessionListPage from "@/components/compositions/SessionListPage";
import { Box } from "@chakra-ui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "セッション一覧 | Talkdraft",
  robots: {
    index: false,
  },
};

export default function Sessions() {
  return (
    <Box p="4" width="full">
      <AppHeading>セッション一覧</AppHeading>
      <SessionListPage />
    </Box>
  );
}
