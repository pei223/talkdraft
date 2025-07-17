"use client"; // localStorageはクライアントサイドでのみ利用可能

import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  CHAT_PROMPT,
  SYSTEM_PROMPT,
  WRITE_DRAFT_PROMPT,
  WRITE_FIRST_DRAFT_PROMPT,
} from "./prompts";

export type LLMProvider = "openai" | "gemini";

export interface DraftHistory {
  content: string;
  createdBy: "user" | "AI";
}

export class LLMModel {
  private model: ChatOpenAI | ChatGoogleGenerativeAI;
  private internalHistories: BaseMessage[] = [new SystemMessage(SYSTEM_PROMPT)];
  private chatHistories: BaseMessage[] = [];
  private draftHistories: DraftHistory[] = [];

  constructor(
    modelName: string,
    apiKey: string,
    provider: LLMProvider = "openai"
  ) {
    if (provider === "openai") {
      this.model = new ChatOpenAI({
        modelName: modelName,
        openAIApiKey: apiKey,
      });
    } else if (provider === "gemini") {
      this.model = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey: apiKey,
      });
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  async sendForConnectionTest() {
    await this.model.invoke([new HumanMessage("テスト接続")]);
  }

  async *chatStream(
    session: string,
    input: string
  ): AsyncGenerator<{
    content: string;
    isComplete: boolean;
  }> {
    this.chatHistories.push(new HumanMessage(input));

    // TODO 最初だったらプロンプト変える
    const newMessage = new HumanMessage(
      CHAT_PROMPT.replace("{input}", input)
        .replace("{draft}", this.getLatestDraft()?.content || "")
        .replace("{session}", session)
    );

    let chatContent = "";

    const chatStream = await this.model.stream([
      ...this.internalHistories,
      newMessage,
    ]);

    for await (const chunk of chatStream) {
      const chunkContent = chunk.content as string;
      chatContent += chunkContent;
      yield {
        content: chatContent,
        isComplete: false,
      };
    }

    this.chatHistories.push(new AIMessage(chatContent));
    this.internalHistories.push(newMessage, new AIMessage(chatContent));

    yield {
      content: chatContent,
      isComplete: true,
    };
  }

  async *draftStream(): AsyncGenerator<{
    content: string;
    isComplete: boolean;
  }> {
    let draftContent = "";

    console.log(this.draftHistories);
    const draftStream = await this.model.stream([
      ...this.internalHistories,
      new HumanMessage(
        this.draftHistories.length === 0
          ? WRITE_FIRST_DRAFT_PROMPT
          : WRITE_DRAFT_PROMPT
      ),
    ]);

    for await (const chunk of draftStream) {
      const chunkContent = chunk.content as string;
      draftContent += chunkContent;
      yield {
        content: draftContent,
        isComplete: false,
      };
    }

    this.draftHistories.push({
      content: draftContent,
      createdBy: "AI",
    });

    yield {
      content: draftContent,
      isComplete: true,
    };
  }

  getChatHistories(): BaseMessage[] {
    return this.chatHistories.filter((v) => v.getType() !== "system");
  }

  getSystemHistories(): BaseMessage[] {
    return this.internalHistories;
  }

  getLatestDraft(): DraftHistory | null {
    return this.draftHistories[this.draftHistories.length - 1] || null;
  }

  getAllDraftHistories(): DraftHistory[] {
    return [...this.draftHistories];
  }

  saveDraft(content: string, createdBy: DraftHistory["createdBy"]) {
    this.draftHistories.push({
      content,
      createdBy,
    });
  }

  generateHistoriesForSave(): SerializedLlmHistories {
    return {
      systemHistories: this.serializeMessages(this.internalHistories),
      chatHistories: this.serializeMessages(this.chatHistories),
      draftHistories: this.draftHistories,
    };
  }

  restore(historiesRawText: string | null) {
    if (historiesRawText === "" || historiesRawText == null) return;
    const histories = JSON.parse(historiesRawText) as SerializedLlmHistories;
    this.internalHistories = this.convertToMessages(
      histories.systemHistories || []
    );
    this.chatHistories = this.convertToMessages(histories.chatHistories || []);
    this.draftHistories = histories.draftHistories || [];
  }

  private convertToMessages(messages: SerializedMessage[]): BaseMessage[] {
    return messages.map((msg) => {
      switch (msg.type) {
        case "human":
          return new HumanMessage(msg.content);
        case "ai":
          return new AIMessage(msg.content);
        case "system":
          return new SystemMessage(msg.content);
        default:
          return new HumanMessage(msg.content);
      }
    });
  }

  private serializeMessages(messages: BaseMessage[]): SerializedMessage[] {
    return messages.map((msg) => ({
      type: msg.getType() as "human" | "ai" | "system",
      content: msg.content as string,
    }));
  }
}

type SerializedMessage = {
  type: "human" | "ai" | "system";
  content: string;
};

type SerializedLlmHistories = {
  systemHistories: SerializedMessage[];
  chatHistories: SerializedMessage[];
  draftHistories: DraftHistory[];
};

const LLM_HISTORIES_STORAGE_PREFIX = "llm-histories";

export function getRawLlmHistoriesFromStorage(
  sessionId: string
): string | null {
  return localStorage.getItem(`${LLM_HISTORIES_STORAGE_PREFIX}_${sessionId}`);
}

export function saveRawLlmHistoriesToStorage(
  histories: SerializedLlmHistories,
  sessionId: string
) {
  localStorage.setItem(
    `${LLM_HISTORIES_STORAGE_PREFIX}_${sessionId}`,
    JSON.stringify(histories)
  );
}

export function deleteSessionHistories(sessionId: string): void {
  localStorage.removeItem(`${LLM_HISTORIES_STORAGE_PREFIX}_${sessionId}`);
}
