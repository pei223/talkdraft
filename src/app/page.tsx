import { Metadata } from "next";
import SessionListPage from "../components/compositions/SessionListPage";
import AppHeading from "@/components/common/AppHeading";
import { Box } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "セッション一覧 | Talkdraft",
};

export default function Home() {
  return (
    <Box p="4" width="full">
      <AppHeading>セッション一覧</AppHeading>
      <SessionListPage />
    </Box>
  );
}
