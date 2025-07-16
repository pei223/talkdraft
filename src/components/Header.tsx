"use client";

import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { MdEditNote } from "react-icons/md";

export default function Header() {
  const router = useRouter();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      background="white"
      color="gray.700"
      width="full"
      paddingX="4"
      paddingY="1"
      top="0"
      zIndex="10"
      position="sticky"
      borderBottom="1px solid"
      borderColor="gray.400"
    >
      <Box display="flex" alignItems="center">
        <MdEditNote size="1.8em" />
        <Heading
          size="lg"
          onClick={() => router.push("/")}
          cursor="pointer"
          marginLeft="2"
        >
          Talkdraft
        </Heading>
      </Box>

      <Box>
        <Link
          variant="plain"
          color="gray.700"
          marginRight="4"
          onClick={() => router.push("/")}
        >
          <Text fontWeight="medium" fontSize="sm">
            セッション一覧
          </Text>
        </Link>

        <Link
          variant="plain"
          color="gray.700"
          onClick={() => router.push("/setting")}
        >
          <Text fontWeight="medium" fontSize="sm">
            設定
          </Text>
        </Link>
      </Box>
    </Flex>
  );
}
