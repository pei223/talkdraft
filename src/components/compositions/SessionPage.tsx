"use client";

import {
  getTalkDraftSessionFromName,
  TalkDraftSessionInfo,
  updateTalkDraftSession,
} from "@/services/session";
import { Box, GridItem, SimpleGrid, Spinner } from "@chakra-ui/react";
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

  useEffect(() => {
    const sess = getTalkDraftSessionFromName(sessionName);
    if (sess == null) {
      throw new Error("Session not found: " + sessionName);
    }
    setSession(sess);

    const modelConfig = getModelConfig();
    if (!modelConfig) {
      throw new Error(
        "モデル設定が見つかりません。設定ページでモデルを設定してください。"
      );
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
      {session == null ? (
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
