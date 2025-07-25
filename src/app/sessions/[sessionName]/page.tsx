import SessionPage from "@/components/compositions/SessionPage";
import { Box } from "@chakra-ui/react";
import AppHeading from "@/components/common/AppHeading";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    sessionName: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sessionName } = await params;
  const sessionNameDecoded = decodeURIComponent(sessionName);
  return {
    title: `${sessionNameDecoded} | Talkdraft`,
    description: "対話するだけでAIがブログを作ってくれる",
    robots: {
      index: false,
    },
  };
}

export default async function Session({ params }: Props) {
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
