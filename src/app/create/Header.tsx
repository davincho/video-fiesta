"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { FormValues } from "@/lib/schema";

import { useController, useFormContext } from "react-hook-form";
import { useSearchParams } from "next/navigation";

import FormField from "./FormField";

export default function Header() {
  const { handleSubmit } = useFormContext();

  const searchParams = useSearchParams();

  const { field } = useController<FormValues, "title">({
    name: "title",
  });

  const { pending } = useFormStatus();

  return (
    <>
      <CardHeader>
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
                  location.href = `/create`;
                }}
              >
                ↪️ Reset
              </Button>
              <Button
                type="submit"
                variant="outline"
                onClick={handleSubmit((data) => {
                  console.log("datasdfsdfsdf", data);
                })}
                formAction={`/preview?${searchParams.toString()}`}
              >
                Preview 🪄
              </Button>

              <Button variant="outline" type="submit" disabled={pending}>
                Publish 🦄
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
