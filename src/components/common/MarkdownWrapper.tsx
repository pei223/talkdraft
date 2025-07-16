import { Text } from "@chakra-ui/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

export default function MarkdownWrapper({ content }: Props) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <Text as="h1" fontSize="xl" fontWeight="bold" mb={2}>
            {children}
          </Text>
        ),
        h2: ({ children }) => (
          <Text as="h2" fontSize="lg" fontWeight="bold" mb={2}>
            {children}
          </Text>
        ),
        h3: ({ children }) => (
          <Text as="h3" fontSize="md" fontWeight="bold" mb={2}>
            {children}
          </Text>
        ),
        p: ({ children }) => (
          <Text mb={2} lineHeight="1.5">
            {children}
          </Text>
        ),
        ul: ({ children }) => (
          <ul style={{ marginLeft: "20px", marginBottom: "8px" }}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol style={{ marginLeft: "20px", marginBottom: "8px" }}>
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li style={{ marginBottom: "4px" }}>{children}</li>
        ),
        strong: ({ children }) => (
          <Text as="strong" fontWeight="bold">
            {children}
          </Text>
        ),
        code: ({ children }) => (
          <Text
            as="code"
            bg="gray.200"
            px={1}
            py={0.5}
            rounded="sm"
            fontSize="sm"
            fontFamily="mono"
          >
            {children}
          </Text>
        ),
        pre: ({ children }) => (
          <pre
            style={{
              backgroundColor: "#f8f9fa",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "8px",
              overflowX: "auto",
              fontSize: "14px",
              fontFamily: "monospace",
            }}
          >
            {children}
          </pre>
        ),
      }}
    >
      {content as string}
    </Markdown>
  );
}
