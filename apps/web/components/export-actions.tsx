import { Button } from "@workspace/ui/components/button";
import { IconLoader2, IconArrowDownToArc, IconCopy } from "@tabler/icons-react";

interface ExportActionsControlsProps {
  handleExport: () => void;
  isExporting: boolean;
  handleCopyToClipboard: () => void;
  isCopying: boolean;
}

export function ExportActionsControls({
  handleExport,
  isExporting,
  handleCopyToClipboard,
  isCopying,
}: ExportActionsControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Actions</span>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 text-xs h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-medium cursor-pointer"
          >
            {isExporting ? (
              <IconLoader2 className="size-4 animate-spin mr-1" />
            ) : (
              <IconArrowDownToArc className="size-4 mr-1" />
            )}
            Export PNG
          </Button>
          
          <Button
            onClick={handleCopyToClipboard}
            disabled={isCopying}
            variant="outline"
            className="h-9 px-3 text-xs cursor-pointer"
            title="Copy to clipboard"
          >
            {isCopying ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              <IconCopy className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
