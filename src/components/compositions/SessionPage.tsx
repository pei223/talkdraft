"use client";

import {
  getTalkDraftSessionFromName,
  TalkDraftSessionInfo,
  updateTalkDraftSession,
} from "@/services/session";
import {
  Box,
  Dialog,
  GridItem,
  Portal,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import DraftView from "../DraftView";
import ChatView from "../ChatView";
import {
  DraftHistory,
  getRawLlmHistoriesFromStorage,
  LLMModel,
  saveRawLlmHistoriesToStorage,
} from "@/services/llm";
import { getModelConfig } from "@/services/modelConfig";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import Description from "../common/Description";
import AppButton from "../common/AppButton";
import { useRouter } from "next/navigation";

type Props = {
  sessionName: string;
};

export default function SessionPage({ sessionName }: Props) {
  const [session, setSession] = useState<TalkDraftSessionInfo | null>(null);
  const [model, setModel] = useState<LLMModel | null>(null);
  const [histories, setHistories] = useState<BaseMessage[]>([]);
  const [draftHistories, setDraftHistories] = useState<DraftHistory[]>([]);
  const [streamingDraftContent, setStreamingDraftContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isModelNotFound, setIsModelNotFound] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const sess = getTalkDraftSessionFromName(sessionName);
    if (sess == null) {
      router.push("/sessions");
      return;
    }
    setSession(sess);

    const modelConfig = getModelConfig();
    if (!modelConfig) {
      setIsModelNotFound(true);
      return;
    }

    const newModel = new LLMModel(
      modelConfig.modelName,
      modelConfig.apiKey,
      modelConfig.provider
    );
    setModel(newModel);

    const histories = getRawLlmHistoriesFromStorage(sess.sessionId);
    if (histories != null) {
      newModel.restore(histories);
      setHistories(newModel.getChatHistories());
      setDraftHistories(newModel.getAllDraftHistories());
      setStreamingMessage("");
      setStreamingDraftContent(newModel.getLatestDraft()?.content || "");
    }
  }, [sessionName]);

  const onChat = useCallback(
    async (input: string) => {
      if (model == null) {
        console.warn("model not found");
        return;
      }
      if (session == null) {
        console.warn("session not found");
        return;
      }
      setHistories([...model.getChatHistories(), new HumanMessage(input)]);
      setIsLoading(true);
      try {
        // チャットストリームを開始
        const chatStreamPromise = (async () => {
          for await (const chunk of model.chatStream(sessionName, input)) {
            setStreamingMessage(chunk.content);
            if (chunk.isComplete) {
              setStreamingMessage("");
              setHistories([...model.getChatHistories()]);
            }
          }
        })();
        await chatStreamPromise;

        // 記事作成ストリームを開始
        const draftStreamPromise = (async () => {
          for await (const chunk of model.draftStream()) {
            setStreamingDraftContent(chunk.content);
            if (chunk.isComplete) {
              setStreamingDraftContent("");
              setDraftHistories(model.getAllDraftHistories());
            }
          }
        })();
        await draftStreamPromise;

        saveRawLlmHistoriesToStorage(
          model.generateHistoriesForSave(),
          session.sessionId
        );
        updateTalkDraftSession(session.sessionId, {
          sessionName: session.sessionName,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [model, session, sessionName]
  );

  const onSaveDraft = useCallback(
    (content: string, done: (success: boolean) => void) => {
      if (model == null) {
        console.warn("model not found");
        done(false);
        return;
      }
      if (session == null) {
        console.warn("session not found");
        done(false);
        return;
      }
      setStreamingDraftContent(content);
      model.saveDraft(content, "user");
      setDraftHistories(model.getAllDraftHistories());
      saveRawLlmHistoriesToStorage(
        model.generateHistoriesForSave(),
        session.sessionId
      );
      updateTalkDraftSession(session.sessionId, {
        sessionName: session.sessionName,
      });
      done(true);
    },
    [model, session]
  );

  return (
    <Box height="full" display="flex" flexDirection="column">
      {isModelNotFound ? (
        <Dialog.Root size="sm" open>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>モデルを設定してください</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Description mb="6">
                    記事生成にはAIモデルの設定が必要です。
                  </Description>
                  <AppButton
                    width="full"
                    level="secondary"
                    onClick={() => {
                      window.location.href = "/setting";
                    }}
                  >
                    設定画面に進む
                  </AppButton>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      ) : session == null || model == null ? (
        <Box
          height="full"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mx={4}
          my={4}
        >
          <Spinner size="lg" />
        </Box>
      ) : (
        <SimpleGrid
          width="full"
          height="full"
          columns={{
            base: 12,
          }}
          my={2}
          m={0}
          overflowY="hidden"
        >
          <GridItem
            colSpan={{
              base: 12,
              sm: 6,
            }}
            overflowY="hidden"
            p={6}
            pt={0}
            height={{
              sm: "full",
              base: "80vh",
            }}
          >
            <ChatView
              histories={histories}
              isLoading={isLoading}
              streamingMessage={streamingMessage}
              onChat={onChat}
            />
          </GridItem>
          <GridItem
            colSpan={{
              base: 12,
              sm: 6,
            }}
            overflowY="hidden"
            borderLeft="1px solid #e2e8f0"
            height={{
              sm: "full",
              base: "80vh",
            }}
            p={6}
          >
            <DraftView
              draftHistories={draftHistories}
              streamingDraft={streamingDraftContent}
              isLoading={isLoading}
              onSave={onSaveDraft}
            />
          </GridItem>
        </SimpleGrid>
      )}
    </Box>
  );
}
