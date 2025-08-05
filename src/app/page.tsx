import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { MdEditNote } from "react-icons/md";

export default function LandingPage() {
  return (
    <Box
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      bg="linear-gradient(135deg, #f0f9ff 0%, #f0fdfa 50%, #f0fdf4 100%);"
      width="full"
      height="100vh"
    >
      <Container pt="12" px="6" maxW="5xl">
        <SimpleGrid
          columns={{
            sm: 1,
            md: 2,
          }}
          gap="6"
          alignItems="center"
        >
          <VStack align="start" mb="6">
            <Box display="flex" fontWeight="medium" mb="8" alignItems="center">
              <MdEditNote size="2.4em" />
              <VStack align="start" gap="0">
                <Heading as="h1" marginLeft="2" fontSize="1.8em">
                  Talkdraft
                </Heading>
                <Badge colorPalette="blue" fontSize="xs" ml="2" variant="solid">
                  Beta版
                </Badge>
              </VStack>
            </Box>
            <Heading
              as="h1"
              size="2xl"
              lineHeight="1.2"
              mb="8"
              fontSize="3.0em"
              fontWeight="bold"
            >
              <Text color="#3b82f6" as="span">
                会話するだけ
              </Text>
              で、
              <br />
              <Text
                background="linear-gradient(to right, #3b82f6, #1e40af)"
                backgroundClip="text"
                as="span"
              >
                ブログ記事が完成
              </Text>
              <br />
              する。
            </Heading>
            <Heading
              fontSize="1.4em"
              color="gray.600"
              mb="6"
              lineHeight="1.6"
              as="h2"
            >
              AIとの対話で構成を考え、文章を生成。
              <Text color="#3b82f6" as="span" fontWeight="600">
                あなたの思考をそのまま記事
              </Text>
              に。
            </Heading>
            <VStack gap="2" align="start" mb="6">
              <Text>
                <Box as="span" mr="2">
                  💬
                </Box>
                自然な会話形式で記事作成
              </Text>
              <Text>
                <Box as="span" mr="2">
                  ✨
                </Box>
                AI が構成から文章まで自動生成
              </Text>
            </VStack>
            <Link href="/sessions">
              <Button
                size="2xl"
                bg="linear-gradient(to right, #3b82f6, #1e40af)"
                fontWeight="bold"
                transition="all 0.3s ease"
                mb="2"
                shadow="xl"
              >
                今すぐはじめる
              </Button>
            </Link>
            <Text fontSize="sm" color="gray.500">
              ※
              Beta版のため会話履歴はブラウザに保存されます。キャッシュを削除しないようご注意ください。
            </Text>
          </VStack>
          <Box
            overflow="hidden"
            position="relative"
            width="fit-content"
            height="fit-content"
            shadow="lg"
            transform="rotate(2deg)"
          >
            <Image
              src="/session-screen.png"
              alt="session-screen"
              width={1200}
              height={900}
              objectFit="contain"
              priority
            />
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
