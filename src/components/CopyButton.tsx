"use client";

import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function CopyButton({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  const { toast } = useToast();

  return (
    <div className="inline-flex items-center gap-2">
      <span className="font-bold">{label}</span>
      <span className="inline-block rounded-md bg-slate-500 p-1 px-2 text-white">
        {content}
      </span>
      <Button
        variant="outline"
        onClick={() => {
          navigator.clipboard.writeText(content);
          toast({
            duration: 1000,
            title: "Link copied to clipboard",
          });
        }}
      >
        <CopyIcon />
      </Button>
    </div>
  );
}
