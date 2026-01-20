import React from "react";
import { Button } from "../ui/Button";
import { trpcClientReact } from "@/utils/api";
import { toast } from "sonner";
import { Copy, Eye, Trash2 } from "lucide-react";
import copyToClipboard from 'copy-to-clipboard'

interface FileItemActionProps {
    fileId: string;
    onDeleteSuccess: (fileId: string) => void;
}

const DeleteFileAction: React.FC<FileItemActionProps> = (props) => {
    const { fileId, onDeleteSuccess } = props;
    const {mutate: deleteFile, isPending: isDeleting} = trpcClientReact.file.deleteFile.useMutation({
        onSuccess: () => {
            onDeleteSuccess(fileId);
        }
    });

    const handleRemoveFile = () => {
        deleteFile(fileId);
        toast('Delete Success!')
    }
    return (
        <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={handleRemoveFile}
            disabled={isDeleting}
        >
            <Trash2 />
        </Button>
    )
}

const CopyUrlAction: React.FC<{url: string}> = (props) => {
    const {url} = props;
    return (
        <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={() => {
                copyToClipboard(url);
                toast('Copy Success!')
            }}
        >
            <Copy />
        </Button>
    )
}

type PreviewProps = {
    onClick: () => void;
}
const PreviewAction: React.FC<PreviewProps> = (props) => {
    const { onClick } = props;

    return (
        <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={onClick}
        >
            <Eye />
        </Button>
    )
}


export { CopyUrlAction, DeleteFileAction, PreviewAction }
