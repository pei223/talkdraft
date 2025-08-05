"use client";

import { sendGAEvent } from "@next/third-parties/google";

type GACategories = "lp" | "setting" | "sessions" | "session" | "common";

type ClickAction =
  // Common
  | "click_warning_popover"
  // header
  | "click_session_list_link"
  // LP
  | "click_start"
  // Model
  | "click_model_setting_link"
  | "save_model_setting"
  | "test_model_setting"
  // Sessions
  | "select_session"
  | "create_session"
  | "delete_session"
  | "update_session"
  // Session
  | "send_message"
  | "copy_article"
  | "save_fixed_article"
  | "select_article_version"
  | "click_unset_model_setting_link";

type ExecAction =
  // model
  | "finished_test_model_setting"
  | "failed_to_test_model_setting"
  // Session
  | "finished_generate_article";

export const sendClickEvent = (
  category: GACategories,
  action: ClickAction,
  label?: string
) => {
  sendGAEvent({ event: "click", value: { category, action, label } });
};

export const sendExecEvent = (
  category: GACategories,
  action: ExecAction,
  label?: string
) => {
  sendGAEvent({ event: "exec", value: { category, action, label } });
};
