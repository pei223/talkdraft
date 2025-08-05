import {
  Box,
  Select,
  createListCollection,
  Stack,
  Tabs,
  Textarea,
  Spinner,
  StackProps,
} from "@chakra-ui/react";
import { useState, useEffect, useRef, useCallback } from "react";
import MarkdownWrapper from "./common/MarkdownWrapper";
import { DraftHistory } from "@/services/llm";
import { LuCopy } from "react-icons/lu";
import { Toaster, toaster } from "@/snippet-components/ui/toaster";
import AppButton from "./common/AppButton";
import AppHeading from "./common/AppHeading";
import { sendClickEvent } from "@/utils/gaUtils";

interface Props extends StackProps {
  draftHistories: DraftHistory[];
  streamingDraft: string;
  isLoading: boolean;
  onSave: (content: string, done: (success: boolean) => void) => void;
}

type TabValue = "preview" | "write";

export default function DraftView({
  draftHistories,
  streamingDraft,
  isLoading,
  onSave,
  ...props
}: Props) {
  const [selectedDraftIndex, setSelectedDraftIndex] = useState<number>(
    draftHistories.length - 1
  );
  const [editContent, setEditContent] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabValue>("preview");
  const [displayDraft, setDisplayDraft] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveTab("preview");
    setSelectedDraftIndex(draftHistories.length - 1);
  }, [draftHistories.length]);

  useEffect(() => {
    setActiveTab("preview");
    setDisplayDraft(streamingDraft);
    setEditContent(streamingDraft);
    previewRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [streamingDraft]);

  useEffect(() => {
    if (selectedDraftIndex < 0) {
      return;
    }
    sendClickEvent("session", "select_article_version");
    setDisplayDraft(draftHistories[selectedDraftIndex].content);
    setEditContent(draftHistories[selectedDraftIndex].content);
  }, [selectedDraftIndex, draftHistories]);

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(displayDraft);
    toaster.create({
      description: "クリップボードにコピーしました",
      type: "info",
      closable: true,
    });
  }, [displayDraft]);

  const onSaveClicked = useCallback(() => {
    setActiveTab("preview");
    onSave(editContent, (success: boolean) => {
      toaster.create({
        description: success
          ? "記事を保存しました"
          : "記事の保存に失敗しました",
        type: success ? "info" : "error",
        closable: true,
      });
    });
  }, [editContent, onSave]);

  const draftOptions = createListCollection({
    items: draftHistories.map((_, index) => ({
      label: `記事 ${index + 1} (${
        draftHistories[index].createdBy === "AI" ? "自動生成" : "ユーザー保存"
      })`,
      value: index.toString(),
    })),
  });

  const isSelectedLastDraftIndex =
    selectedDraftIndex === draftHistories.length - 1;

  return (
    <Stack
      gap={4}
      width="full"
      height="full"
      display="flex"
      flexDirection="column"
      {...props}
    >
      <Toaster />
      <AppHeading level="sub">記事プレビュー</AppHeading>
      {!isLoading && draftHistories.length > 0 && (
        <Select.Root
          disabled={isLoading}
          collection={draftOptions}
          value={[selectedDraftIndex.toString()]}
          onValueChange={(e) => {
            setActiveTab("preview");
            setSelectedDraftIndex(parseInt(e.value[0]));
          }}
        >
          <Select.Trigger>
            <Select.ValueText placeholder="記事を選択" />
          </Select.Trigger>
          <Select.Content>
            {draftOptions.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      )}
      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <Spinner size="lg" />
        </Box>
      )}
      <Tabs.Root
        value={activeTab}
        flex={1}
        border="1px solid #e2e8f0"
        borderRadius="md"
        backgroundColor="white"
        overflowY="hidden"
        display="flex"
        flexDirection="column"
        onValueChange={(e) => setActiveTab(e.value as TabValue)}
      >
        <Tabs.List bg="gray.50" px={4} py={2}>
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
          <Tabs.Trigger value="write" disabled={isLoading}>
            Write
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          value="preview"
          flex={1}
          overflowY="hidden"
          display="flex"
          flexDirection="column"
        >
          <Box
            borderBottom="1px solid gainsboro"
            p={4}
            flex={1}
            overflowY="scroll"
          >
            <MarkdownWrapper content={displayDraft.replaceAll('"', "")} />
            <div ref={previewRef}></div>
          </Box>
          <Box p={4}>
            <AppButton level="secondary" onClick={onCopy}>
              <LuCopy />
              コピー
            </AppButton>
          </Box>
        </Tabs.Content>

        <Tabs.Content
          value="write"
          flex={1}
          display="flex"
          flexDirection="column"
          p={4}
          pb={0}
        >
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="記事を編集..."
            flex={1}
            resize="none"
            fontFamily="monospace"
            fontSize="sm"
            disabled={!isSelectedLastDraftIndex}
          />
          <Box p={4}>
            <AppButton
              disabled={isLoading || !isSelectedLastDraftIndex}
              onClick={onSaveClicked}
            >
              保存
            </AppButton>
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
}
