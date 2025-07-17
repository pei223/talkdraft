"use client";

import {
  Card,
  Field,
  Input,
  Stack,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { LLMModel, LLMProvider } from "@/services/llm";
import {
  DEFAULT_MODEL,
  DEFAULT_MODEL_SETTING,
  ModelConfig,
  PROVIDER_MODELS_MAP,
  getModelConfig,
  saveModelConfig,
} from "@/services/modelConfig";
import AppHeading from "../common/AppHeading";
import Description from "../common/Description";
import AppButton from "../common/AppButton";
import { toaster, Toaster } from "@/snippet-components/ui/toaster";

export default function ModelSettingsPage() {
  const [config, setConfig] = useState<ModelConfig>(DEFAULT_MODEL_SETTING);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedConfig = getModelConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    }
  }, []);

  const handleProviderChange = (provider: LLMProvider) => {
    setConfig({
      ...config,
      provider,
      modelName: DEFAULT_MODEL[provider],
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      saveModelConfig(config);
      toaster.create({
        description: "モデル設定が保存されました",
        type: "success",
        closable: true,
      });
    } catch {
      alert("モデル設定の保存に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const testModel = new LLMModel(
        config.modelName,
        config.apiKey,
        config.provider
      );

      await testModel.sendForConnectionTest();

      toaster.create({
        description: "モデルとの接続が確認できました",
        type: "success",
        closable: true,
      });
    } catch {
      alert(
        "モデルとの接続に失敗しました。APIキーとモデル名を確認してください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card.Root>
      <Toaster />
      <Card.Header>
        <AppHeading level="sub">モデル設定</AppHeading>
        <Description>
          使用するLLMプロバイダーとモデルを設定してください
        </Description>
      </Card.Header>
      <Card.Body>
        <Stack gap={6}>
          <Field.Root>
            <Field.Label>プロバイダー</Field.Label>
            <Select.Root
              value={[config.provider]}
              collection={createListCollection<LLMProvider>({
                items: ["openai", "gemini"],
              })}
              onValueChange={(e) =>
                handleProviderChange(e.value[0] as LLMProvider)
              }
            >
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="プロバイダーを選択" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item item="openai">OpenAI</Select.Item>
                  <Select.Item item="gemini">Google Gemini</Select.Item>
                </Select.Content>
              </Select.Control>
            </Select.Root>
          </Field.Root>

          <Field.Root>
            <Field.Label>モデル</Field.Label>
            <Select.Root
              value={[config.modelName]}
              collection={createListCollection<string>({
                items: PROVIDER_MODELS_MAP[config.provider],
              })}
              onValueChange={(e) =>
                setConfig({ ...config, modelName: e.value[0] })
              }
            >
              <Select.Trigger>
                <Select.ValueText placeholder="モデルを選択" />
              </Select.Trigger>
              <Select.Content>
                {PROVIDER_MODELS_MAP[config.provider].map((model) => (
                  <Select.Item key={model} item={model}>
                    {model}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Field.Root>

          <Field.Root>
            <Field.Label>APIキー</Field.Label>
            <Input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder={
                config.provider === "openai" ? "sk-proj-..." : "AIza..."
              }
            />
            <Field.HelperText>
              {config.provider === "openai"
                ? "OpenAI APIキーを入力してください"
                : "Google AI Studio APIキーを入力してください"}
            </Field.HelperText>
          </Field.Root>

          <Stack direction="row" gap={4}>
            <AppButton
              level="secondary"
              loading={isLoading}
              disabled={!config.apiKey.trim()}
              onClick={handleTest}
            >
              接続テスト
            </AppButton>
            <AppButton
              loading={isLoading}
              disabled={!config.apiKey.trim()}
              onClick={handleSave}
            >
              保存
            </AppButton>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
