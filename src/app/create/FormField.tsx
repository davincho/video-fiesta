"use client";

import { stringToPath, pathOr } from "remeda";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FormValues } from "@/lib/schema";

import { useFormContext, FieldPath, RegisterOptions } from "react-hook-form";

import { ComponentProps } from "react";

export default function FormField({
  label,
  name,
  registerProps = {},
  ...props
}: {
  label: string;
  name: FieldPath<FormValues>;
  registerProps?: RegisterOptions<FormValues, typeof name>;
} & ComponentProps<typeof Input>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();


  const getError = (name: string) => pathOr(errors, stringToPath(name) as any, {
    message: ''
  });

  const fieldError = getError(name)?.message;

  return (
    <div className="flex flex-col gap-2 py-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        {...props}
        {...register(name, registerProps)}
        hasError={!!fieldError}
      />
      {fieldError && <span className="text-sm text-red-600">{fieldError}</span>}
    </div>
  );
}


