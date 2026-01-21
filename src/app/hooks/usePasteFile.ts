import React from "react";

const usePasteFile = ({
  onFilePaste,
}: {
  onFilePaste: (files: File[]) => void;
}) => {
  React.useEffect(() => {
    const pasteHandler = (e: ClipboardEvent) => {
      const files: File[] = [];
      if (e.clipboardData == null) return;

      Array.from(e.clipboardData.items).forEach((item) => {
        const f = item.getAsFile();
        if (f) {
          files.push(f);
        }
      });

      if (files.length) {
        onFilePaste(files);
      }
    };
    document.addEventListener("paste", pasteHandler);
    return () => {
      document.removeEventListener("paste", pasteHandler);
    };
  }, [onFilePaste]);
};

export { usePasteFile };
