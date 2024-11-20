"use client";

import { Button } from "@/components/ui/button";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { FormValues } from "@/lib/schema";

import { useController, useFormContext, useFormState } from "react-hook-form";
import { useSearchParams } from "next/navigation";

import FormField from "./FormField";

export default function Header({ isEditMode }: { isEditMode: boolean }) {
  const searchParams = useSearchParams();

  const { field } = useController<FormValues, "title">({
    name: "title",
  });

  const {
    formState: { errors, isSubmitting },
  } = useFormContext();

  const { isDirty } = useFormState();

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
              {isEditMode && (
                <>
                  <Button
                    variant="outline"
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                  >
                    Save 💾
                  </Button>
                </>
              )}

              {!isEditMode && (
                <>
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
                    formAction={`/preview?${searchParams.toString()}`}
                  >
                    Preview 🪄
                  </Button>

                  <Button
                    variant="outline"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Publish 🦄
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        {errors.root?.serverError.type === 401 && (
          <div className="rounded-md bg-orange-300 p-3 text-orange-800">
            Looks like you don not have permissions editing this board
          </div>
        )}

        <CardDescription>
          Add multiple Youtube videos and the sequences you want to extract
        </CardDescription>

        <FormField label="Board title" name="title" />
      </CardHeader>
    </>
  );
}
