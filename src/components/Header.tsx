"use client";

import { Box, Flex, Link, Popover, Portal, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LuCircleAlert } from "react-icons/lu";
import { MdEditNote } from "react-icons/md";
import AppHeading from "./common/AppHeading";

export default function Header() {
  const router = useRouter();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      flexWrap="wrap"
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
        <AppHeading
          size="lg"
          cursor="pointer"
          marginLeft="2"
          onClick={() => router.push("/")}
        >
          Talkdraft
        </AppHeading>
        <Box ml="4" display="flex" alignItems="center">
          <AppHeading level="sub">Beta版</AppHeading>
          <Popover.Root>
            <Popover.Trigger asChild ml="2">
              <LuCircleAlert size="1.2rem" cursor="pointer" color="red" />
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content>
                  <Popover.Arrow />
                  <Popover.Body>
                    <Popover.Title fontWeight="medium">
                      ⚠️ご注意ください
                    </Popover.Title>
                    <Text my="4">
                      本サービスはベータ版のため、会話履歴や設定情報をブラウザの
                      キャッシュに保存しています。
                      <br />
                      ブラウザのキャッシュやストレージを削除すると、過去の履歴とモデル設定が消えてしまいますのでご注意ください。
                    </Text>
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        </Box>
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
