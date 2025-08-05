"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createTalkDraftSession,
  deleteTalkDraftSession,
  getAllTalkDraftSessions,
  updateTalkDraftSession,
  MAX_TALK_DRAFT_SESSION,
  TalkDraftSessionInfo,
} from "@/services/session";
import { deleteSessionHistories } from "@/services/llm";
import { PiPlus } from "react-icons/pi";
import { Box, Spinner } from "@chakra-ui/react";
import SessionFormDialog from "../SessionFormDialog";
import SessionListItem from "../SessionListItem";
import AppButton from "../common/AppButton";
import Description from "../common/Description";
import { sendClickEvent } from "@/utils/gaUtils";

export default function SessionListPage() {
  const [dialogState, setDialogState] = useState<"none" | "create" | "edit">(
    "none"
  );
  const [editTarget, setEditTarget] = useState<TalkDraftSessionInfo | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [talkDraftSessions, setTalkDraftSessions] = useState<
    TalkDraftSessionInfo[]
  >([]);

  useEffect(() => {
    setLoading(true);
    setTalkDraftSessions(getAllTalkDraftSessions());
    setLoading(false);
  }, []);

  const onSubmit = useCallback(
    (sessionName: string) => {
      if (editTarget == null) {
        sendClickEvent("setting", "create_session");
        createTalkDraftSession(sessionName);
        setTalkDraftSessions(getAllTalkDraftSessions());
      } else {
        sendClickEvent("setting", "update_session");
        updateTalkDraftSession(editTarget.sessionId, {
          sessionName: sessionName,
        });
        setTalkDraftSessions(getAllTalkDraftSessions());
      }
      setDialogState("none");
    },
    [editTarget]
  );

  const onDeleteSession = useCallback((sessionId: string) => {
    sendClickEvent("setting", "delete_session");
    deleteTalkDraftSession(sessionId);
    deleteSessionHistories(sessionId);
    setTalkDraftSessions(getAllTalkDraftSessions());
  }, []);

  return (
    <Box
      mb={4}
      mt={4}
      width={{
        base: "full",
        sm: "1/2",
      }}
    >
      {loading && (
        <Box display="flex" justifyContent="start" my={4}>
          <Spinner size="lg" />
        </Box>
      )}
      {!loading && talkDraftSessions.length === 0 && (
        <Description my={6}>セッションを作成してください。</Description>
      )}
      {talkDraftSessions.length > 0 &&
        talkDraftSessions.map((session) => {
          return (
            <SessionListItem
              session={session}
              key={session.sessionId}
              onDelete={onDeleteSession}
              onEditClicked={(session: TalkDraftSessionInfo) => {
                setEditTarget(session);
                setDialogState("edit");
              }}
              mb={4}
            />
          );
        })}
      <AppButton
        disabled={talkDraftSessions.length >= MAX_TALK_DRAFT_SESSION}
        onClick={() => {
          setEditTarget(null);
          setDialogState("create");
        }}
      >
        <PiPlus /> セッションを作成する
      </AppButton>
      <SessionFormDialog
        open={dialogState !== "none"}
        operation={dialogState === "none" ? "create" : dialogState}
        defaultValue={editTarget?.sessionName || ""}
        onOpenChange={(v) => {
          if (!v) {
            setDialogState("none");
          }
        }}
        onSubmit={onSubmit}
      />
    </Box>
  );
}
