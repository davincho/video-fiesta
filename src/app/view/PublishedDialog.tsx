"use client";

import * as React from "react";

import confetti from "canvas-confetti";
import CopyButton from "@/components/CopyButton";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useSearchParams } from "next/navigation";

export default function PublishedDialog({}: {}) {
  const searchParams = useSearchParams();

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  if (!isMounted) {
    return;
  }

  const publicLink = `https://video-fiesta.vercel.app/view?b_id=${searchParams.get(
    "b_id"
  )}`;

  return (
    <Dialog defaultOpen>
      <DialogContent className="overflow-clip sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Your Video Fiesta board has been published 🎉
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 pt-6">
          <div className="items-center">
            <div className="mr-2 flex-1">
              <input
                type="text"
                value="Public Link"
                className="w-full rounded-md bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mr-2 flex-1">
              <input
                type="text"
                value="Admin Link"
                className="w-full rounded-md bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex-shrink-0 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Copy
            </button>
          </div>
          <CopyButton label="Public link:" content={publicLink} />
          <CopyButton
            label="Admin link:"
            content={`${publicLink}&admin_token=${searchParams.get(
              "admin_token"
            )}`}
          />
          <div className="pt-2 text-orange-500">
            Note: Anyone with the admin link can freely edit the board.
          </div>
        </div>
      </DialogContent>
      <DialogFooter>Save changes</DialogFooter>
    </Dialog>
  );
}
