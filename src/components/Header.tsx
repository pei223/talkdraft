"use client";

import {
  Badge,
  Box,
  Flex,
  Link,
  Popover,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LuCircleAlert } from "react-icons/lu";
import { MdEditNote } from "react-icons/md";
import AppHeading from "./common/AppHeading";
import { sendClickEvent } from "@/utils/gaUtils";

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
        <AppHeading size="lg" cursor="pointer" onClick={() => router.push("/")}>
          Talkdraft
        </AppHeading>
        <Box ml="1" display="flex" alignItems="center">
          <Badge colorPalette="blue" fontSize="xs" variant="solid">
            Beta版
          </Badge>
          <Popover.Root>
            <Popover.Trigger
              asChild
              ml="3"
              onClick={() => {
                sendClickEvent("common", "click_warning_popover");
              }}
            >
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
          onClick={() => {
            sendClickEvent("common", "click_session_list_link");
            router.push("/sessions");
          }}
        >
          <Text fontWeight="medium" fontSize="sm">
            セッション一覧
          </Text>
        </Link>

        <Link
          variant="plain"
          color="gray.700"
          onClick={() => {
            sendClickEvent("common", "click_model_setting_link");
            router.push("/setting");
          }}
        >
          <Text fontWeight="medium" fontSize="sm">
            設定
          </Text>
        </Link>
      </Box>
    </Flex>
  );
}
