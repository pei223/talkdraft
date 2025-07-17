import { Button, Dialog, Portal } from "@chakra-ui/react";

type Props = {
  open: boolean;
  sessionName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function DeleteSessionDialog({
  open,
  sessionName,
  onOpenChange,
  onConfirm,
}: Props) {
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
              <Dialog.Title>セッション削除の確認</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                セッション「<strong>{sessionName}</strong>
                」を削除してもよろしいですか？
              </p>
              <p>セッションの履歴・記事は全て削除されます。</p>
              <Button
                onClick={onConfirm}
                colorPalette="red"
                mt="4"
                width="full"
              >
                削除する
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="ghost"
                mt="2"
                width="full"
              >
                キャンセル
              </Button>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
