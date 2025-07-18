import { Card } from "@chakra-ui/react";
import { BaseMessage } from "@langchain/core/messages";
import MarkdownWrapper from "./common/MarkdownWrapper";

type Props = {
  message: BaseMessage;
};

export default function ChatMessage({ message }: Props) {
  const isAI = message.getType() === "ai";

  return (
    <Card.Root
      maxWidth="3/4"
      marginRight={isAI ? "auto" : "0"}
      marginLeft={isAI ? "0" : "auto"}
      backgroundColor={isAI ? "gray.100" : "blue.600"}
      color={isAI ? "black" : "white"}
    >
      <Card.Body m={0} p={3}>
        {isAI ? (
          <MarkdownWrapper content={message.content as string} />
        ) : (
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {message.content as string}
          </pre>
        )}
      </Card.Body>
    </Card.Root>
  );
}
