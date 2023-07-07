"use client";

import { Button } from "@/components/ui/button";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CopyButton from "@/components/CopyButton";

import { FormValues } from "@/lib/schema";

import { useController, useFormContext } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import FormField from "./FormField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Header() {
  const router = useRouter();

  const { reset } = useFormContext();
  const searchParams = useSearchParams();

  const { field } = useController<FormValues, "title">({
    name: "title",
  });

  return (
    <>
      <Dialog open>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Your Video Fiesta board has been published 🎉
            </DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-2 pt-6">
                <CopyButton
                  label="Public link:"
                  content="https://www.google.com"
                />
                <CopyButton label="Admin link:" content="https://orf.at" />
                <div className="pt-2 text-orange-500">
                  Note: Everyone who has the admin link, can edit the board
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <CardHeader>
        <div className="sticky top-0 z-50">sdfdsf</div>
        <div className="flex items-center justify-between">
          <CardTitle>
            {field.value && field.value !== ""
              ? field.value
              : "Create your own Video Fiesta Board"}
          </CardTitle>
          <div className="relative">
            <div className="flex gap-2">
              <Button
                variant="outline"
                type="reset"
                onClick={() => {
                  reset();
                  router.push(`/create`);
                }}
              >
                ↪️ Reset
              </Button>
              <Button variant="outline" asChild>
                <a href={`/?${searchParams.toString()}`}>Share 🪄</a>
              </Button>

              <Button variant="outline" asChild>
                <a href={`/?${searchParams.toString()}`}>Publish 🦄</a>
              </Button>
            </div>
          </div>
        </div>
        <CardDescription>
          Add multiple Youtube videos and the sequences you want to extract
        </CardDescription>

        <FormField label="Board title" name="title" />
      </CardHeader>
    </>
  );
}
