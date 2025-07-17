"use client";

import { LLMProvider } from "./llm";

export interface ModelConfig {
  provider: LLMProvider;
  modelName: string;
  apiKey: string;
}

export const OPENAI_MODELS = [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-3.5-turbo",
] as const;

export const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
] as const;

type GeminiModel = (typeof GEMINI_MODELS)[number];
type OpenAIModel = (typeof OPENAI_MODELS)[number];
type Model = GeminiModel | OpenAIModel;

export const PROVIDER_MODELS_MAP: Record<LLMProvider, Model[]> = {
  openai: [...OPENAI_MODELS],
  gemini: [...GEMINI_MODELS],
};

export const DEFAULT_MODEL: Record<LLMProvider, Model> = {
  openai: "gpt-4o-mini",
  gemini: "gemini-2.5-flash",
};

export const DEFAULT_MODEL_SETTING: ModelConfig = {
  provider: "openai",
  modelName: "gpt-4o-mini",
  apiKey: "",
};

const MODEL_CONFIG_STORAGE_KEY = "model-config";

export function getModelConfig(): ModelConfig | null {
  const savedConfig = localStorage.getItem(MODEL_CONFIG_STORAGE_KEY);
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig) as ModelConfig;
    } catch (error) {
      console.error("Failed to parse model config:", error);
    }
  }
  return null;
}

export function saveModelConfig(config: ModelConfig): void {
  localStorage.setItem(MODEL_CONFIG_STORAGE_KEY, JSON.stringify(config));
}
