import SessionPage from "@/components/compositions/SessionPage";
import { Box } from "@chakra-ui/react";
import AppHeading from "@/components/common/AppHeading";

export default async function Session({
  params,
}: {
  params: Promise<{ sessionName: string }>;
}) {
  const { sessionName } = await params;
  const sessionNameDecoded = decodeURIComponent(sessionName);
  return (
    <Box
      width="full"
      height={{
        base: "auto",
        sm: "calc(100% - 85px)",
      }}
    >
      <AppHeading
        px={4}
        py={2}
        m={0}
        borderBottom="1px solid gainsboro"
        position="sticky"
      >
        {sessionNameDecoded}
      </AppHeading>
      <SessionPage sessionName={sessionNameDecoded} />
    </Box>
  );
}
