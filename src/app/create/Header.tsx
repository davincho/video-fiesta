"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Board } from "@/lib/types";

import { useController, useFormContext, FieldPath } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import { ComponentProps } from "react";

type FormValues = Board;

function FormField({
  label,
  name,
  ...props
}: { label: string; name: FieldPath<FormValues> } & ComponentProps<
  typeof Input
>) {
  const { register } = useFormContext<FormValues>();

  return (
    <div className="flex gap-2 flex-col py-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} {...props} {...register(name)} />
    </div>
  );
}

export default function Header() {
  const router = useRouter();

  const { reset } = useFormContext();
  const searchParams = useSearchParams();

  const { field } = useController<FormValues, "title">({
    name: "title",
  });

  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>
          {field.value && field.value !== ""
            ? field.value
            : "Create your own Video Fiesta Board"}
        </CardTitle>
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
        </div>
      </div>
      <CardDescription>
        Add multiple Youtube videos and the sequences you want to extract
      </CardDescription>

      <FormField label="Board title" name="title" />
    </CardHeader>
  );
}
