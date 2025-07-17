import AppHeading from "@/components/common/AppHeading";
import SessionListPage from "@/components/compositions/SessionListPage";
import { Box } from "@chakra-ui/react";

export default function Sessions() {
  return (
    <Box p="4" width="full">
      <AppHeading>セッション一覧</AppHeading>
      <SessionListPage />
    </Box>
  );
}
