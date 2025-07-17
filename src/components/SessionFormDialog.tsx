import { Dialog, Field, Input, Portal } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AppButton from "./common/AppButton";

type Props = {
  open: boolean;
  defaultValue: string;
  operation: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  onSubmit: (sessionName: string) => void;
};

export default function SessionFormDialog({
  open,
  defaultValue,
  operation = "create",
  onOpenChange,
  onSubmit,
}: Props) {
  const [sessionName, setSessionName] = useState(defaultValue);

  useEffect(() => {
    setSessionName(defaultValue);
  }, [defaultValue]);

  return (
    <Dialog.Root
      open={open}
      lazyMount
      onOpenChange={(e) => onOpenChange(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>セッション作成</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root>
                <Field.Label>セッション名</Field.Label>
                <Input
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="ビジネス記事"
                />
              </Field.Root>
              <AppButton
                disabled={sessionName === ""}
                mt="4"
                width="full"
                onClick={() => onSubmit(sessionName)}
              >
                {operation === "create" ? "作成する" : "更新する"}
              </AppButton>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
