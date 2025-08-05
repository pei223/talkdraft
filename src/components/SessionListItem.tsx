import { TalkDraftSessionInfo } from "@/services/session";
import { Box, IconButton, Link, Card, CardRootProps } from "@chakra-ui/react";
import { PiPencil, PiTrash } from "react-icons/pi";
import { useState } from "react";
import DeleteSessionDialog from "./DeleteSessionDialog";
import Description from "./common/Description";
import { dateStringToDisplayText } from "@/utils/dateUtil";
import { sendClickEvent } from "@/utils/gaUtils";

interface Props extends CardRootProps {
  session: TalkDraftSessionInfo;
  onDelete: (sessionId: string) => void;
  onEditClicked: (session: TalkDraftSessionInfo) => void;
}

export default function SessionListItem({
  session,
  onDelete,
  onEditClicked,
  ...props
}: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(session.sessionId);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card.Root key={session.sessionId} {...props}>
      <Card.Body
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        py={2}
        px={4}
      >
        <Box>
          <Link
            href={`/sessions/${session.sessionName}`}
            onClick={() => {
              sendClickEvent("sessions", "select_session");
            }}
          >
            {session.sessionName}
          </Link>
          <Description level="sub">
            最終更新: {dateStringToDisplayText(session.updatedAt)}
          </Description>
        </Box>
        <Box display="flex" gap={2}>
          <IconButton
            onClick={() => onEditClicked(session)}
            size="sm"
            variant="ghost"
            aria-label="編集"
          >
            <PiPencil />
          </IconButton>
          <IconButton
            onClick={handleDeleteClick}
            size="sm"
            variant="ghost"
            aria-label="削除"
          >
            <PiTrash />
          </IconButton>
        </Box>
      </Card.Body>
      <DeleteSessionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        sessionName={session.sessionName}
      />
    </Card.Root>
  );
}
