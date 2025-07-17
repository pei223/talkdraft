"use client";

export type TalkDraftSessionInfo = {
  sessionName: string;
  sessionId: string;
  updatedAt: string;
};

export const MAX_TALK_DRAFT_SESSION = 5;

const TALK_DRAFT_SESSIONS_STORAGE_KEY = "talk-draft-sessions";

/**
 * localStorageからすべてのセッションを取得する内部関数
 * @returns TalkDraftSessionInfo[]
 */
const getTalkDraftSessionsFromStorage = (): TalkDraftSessionInfo[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const storedTalkDraftSessions = window.localStorage.getItem(
      TALK_DRAFT_SESSIONS_STORAGE_KEY
    );
    if (storedTalkDraftSessions) {
      return JSON.parse(storedTalkDraftSessions) as TalkDraftSessionInfo[];
    }
  } catch (error) {
    console.error("Failed to parse sessions from localStorage", error);
  }
  return [];
};

/**
 * セッションリストをlocalStorageに保存する内部関数
 * @param sessions 保存するセッションの配列
 */
const saveTalkDraftSessionsToStorage = (
  talkDraftSessionInfo: TalkDraftSessionInfo[]
): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(
      TALK_DRAFT_SESSIONS_STORAGE_KEY,
      JSON.stringify(talkDraftSessionInfo)
    );
  } catch (error) {
    console.error("Failed to save sessions to localStorage", error);
  }
};

// --- Public API ---

/**
 * すべての会話セッションのリストを取得します。
 * @returns TalkDraftSessionInfoの配列
 */
export const getAllTalkDraftSessions = (): TalkDraftSessionInfo[] => {
  const talkDraftSessionInfo = getTalkDraftSessionsFromStorage();
  // 更新日の降順でソートして返す
  return talkDraftSessionInfo.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};

/**
 * 指定されたIDの会話セッションを取得します。
 * @param sessionId 取得したいセッションのID
 * @returns TalkDraftSessionInfo | undefined
 */
export const getTalkDraftSessionFromName = (
  sessionName: string
): TalkDraftSessionInfo | undefined => {
  const talkDraftSessionInfo = getTalkDraftSessionsFromStorage();
  return talkDraftSessionInfo.find(
    (session) => session.sessionName === sessionName
  );
};

/**
 * 新しい会話セッションを作成します。
 * @param sessionName 新しいセッションの名前
 * @returns 作成されたTalkDraftSessionInfo
 */
export const createTalkDraftSession = (
  sessionName: string
): TalkDraftSessionInfo => {
  const talkDraftSessionInfo = getTalkDraftSessionsFromStorage();
  const newSession: TalkDraftSessionInfo = {
    sessionId: crypto.randomUUID(),
    sessionName,
    updatedAt: new Date().toISOString(),
  };
  const updatedSessions = [...talkDraftSessionInfo, newSession];
  saveTalkDraftSessionsToStorage(updatedSessions);
  return newSession;
};

/**
 * 既存の会話セッションを更新します。
 * @param sessionId 更新したいセッションのID
 * @param data 更新するデータ (現在はsessionNameのみ)
 * @returns 更新されたTalkDraftSessionInfo | null (セッションが見つからない場合)
 */
export const updateTalkDraftSession = (
  sessionId: string,
  data: { sessionName: string }
): TalkDraftSessionInfo | null => {
  const talkDraftSessionInfo = getTalkDraftSessionsFromStorage();
  const sessionIndex = talkDraftSessionInfo.findIndex(
    (s) => s.sessionId === sessionId
  );

  if (sessionIndex === -1) {
    return null;
  }

  const updatedSession = {
    ...talkDraftSessionInfo[sessionIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const updatedSessions = [
    ...talkDraftSessionInfo.slice(0, sessionIndex),
    updatedSession,
    ...talkDraftSessionInfo.slice(sessionIndex + 1),
  ];

  saveTalkDraftSessionsToStorage(updatedSessions);
  return updatedSession;
};

/**
 * 指定されたIDの会話セッションを削除します。
 * @param sessionId 削除したいセッションのID
 */
export const deleteTalkDraftSession = (sessionId: string): void => {
  const talkDraftSessionInfo = getTalkDraftSessionsFromStorage();
  const updatedSessions = talkDraftSessionInfo.filter(
    (s) => s.sessionId !== sessionId
  );
  saveTalkDraftSessionsToStorage(updatedSessions);
};
