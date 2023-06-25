"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import lzString from "lz-string";
import { useEffect } from "react";
import {
  UseFormReturn,
  useFieldArray,
  useForm,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";

function encode(input: object) {
  return lzString.compressToEncodedURIComponent(JSON.stringify(input));
}

function decode(input: string) {
  if (!input) {
    return {};
  }

  return JSON.parse(lzString.decompressFromEncodedURIComponent(input));
}

const Persister = ({ watch }: { watch: UseFormReturn["watch"] }) => {
  watch((data) => {
    window.location.hash = encode(data);
  });

  return null;
};

function Nipples({
  control,
  register,
  index,
}: Pick<UseFormReturn, "control" | "register"> & { index: number }) {
  const { fields, append } = useFieldArray({
    control,
    name: `videos.${index}.nipples`,
  });

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          append({});
        }}
      >
        Add nipple
      </Button>
      {fields.map((field, nestedIndex) => (
        <>
          <Label>
            Sequence label
            <Input
              {...register(`videos.${index}.nipples.${nestedIndex}.label`)}
            />
          </Label>

          <Label>
            Start (sec)
            <Input
              {...register(`videos.${index}.nipples.${nestedIndex}.start`)}
              type="number"
            />
          </Label>

          <Label>
            End (sec)
            <Input
              {...register(`videos.${index}.nipples.${nestedIndex}.end`)}
              type="number"
            />
          </Label>
        </>
      ))}
    </>
  );
}

function Videos({
  control,
  register,
}: Pick<UseFormReturn, "control" | "register">) {
  const { fields, append } = useFieldArray({
    control,
    name: "videos",
  });

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          append({
            videoId: "",
            nipples: [],
          });
        }}
      >
        Add Video
      </Button>
      {fields.map((field, index) => {
        return (
          <>
            <Label>
              YouTube VideoId
              <Input {...register(`videos.${index}.videoId`)} />
            </Label>

            <Nipples index={index} register={register} control={control} />
          </>
        );
      })}
    </>
  );
}

export default function Create() {
  const { register, watch, control } = useForm({
    defaultValues: decode(window.location.hash.substring(1)),
  });

  return (
    <form className="m-auto">
      <Persister watch={watch} />
      <Label>
        Nipple Board Title
        <Input {...register("title")} />
      </Label>
      <Videos control={control} register={register} />
    </form>
  );
}
