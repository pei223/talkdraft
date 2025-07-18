import { Box, Textarea, Spinner, BoxProps } from "@chakra-ui/react";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { useState, useEffect, useRef, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import AppButton from "./common/AppButton";

interface Props extends BoxProps {
  histories: BaseMessage[];
  isLoading: boolean;
  streamingMessage: string;
  onChat: (input: string) => void;
}

export default function ChatView({
  histories,
  isLoading,
  streamingMessage,
  onChat,
  ...props
}: Props) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesEndRef]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSubmit = useCallback(() => {
    if (message.trim() && !isLoading) {
      onChat(message);
      setMessage("");
    }
  }, [message, isLoading, onChat]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.nativeEvent.isComposing && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <Box
      width="full"
      height="full"
      display="flex"
      flexDirection="column"
      backgroundColor="white"
      {...props}
    >
      <Box flex="1" py={6} overflowY="scroll">
        {histories.map((v, i) => {
          return (
            <Box key={i} mb={6}>
              <ChatMessage message={v} />
            </Box>
          );
        })}
        {streamingMessage && (
          <ChatMessage message={new AIMessage(streamingMessage)} />
        )}
        {isLoading && (
          <Box display="flex" justifyContent="center" my={4}>
            <Spinner size="lg" />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box
        position="sticky"
        bottom="0"
        backgroundColor="white"
        pt="4"
        borderTop="1px solid #e2e8f0"
      >
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="メッセージを入力... (Shift+Enterで改行、Enterで送信)"
          rows={3}
          resize="vertical"
        />
        <AppButton
          onClick={handleSubmit}
          mt="4"
          width="full"
          disabled={isLoading || !message.trim()}
          loading={isLoading}
        >
          {isLoading ? "送信中..." : "送信"}
        </AppButton>
      </Box>
    </Box>
  );
}
