"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { encode, decode } from "@/lib/url";

import {
  UseFormReturn,
  useFieldArray,
  useForm,
  useController,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import { ComponentProps, useState } from "react";
import { OnProgressProps } from "react-player/base";

const Persister = ({ watch }: { watch: UseFormReturn["watch"] }) => {
  watch((data) => {
    if (Object.keys(data).length === 0) {
      return;
    }

    window.location.replace(`#${encode(data)}`);
  });

  return null;
};

function Nipples({
  register,
  index,
}: Pick<UseFormReturn, "register"> & { index: number }) {
  const { fields, append } = useFieldArray({
    name: `videos.${index}.nipples`,
  });

  return (
    <>
      <div className="flex justify-between">
        Nipples
        <Button
          type="button"
          onClick={() => {
            append({});
          }}
        >
          Add nipple
        </Button>
      </div>

      {fields.map((field, nestedIndex) => (
        <>
          <FormField
            name={`videos.${index}.nipples.${nestedIndex}.label`}
            label="Sequence label"
          />

          <div className="flex">
            <FormField
              name={`videos.${index}.nipples.${nestedIndex}.start`}
              label="Start (sec)"
              type="number"
              className="w-16"
            />

            <FormField
              name={`videos.${index}.nipples.${nestedIndex}.end`}
              label="End (sec)"
              type="number"
              className="w-16"
            />
          </div>
        </>
      ))}
    </>
  );
}

function VideoScrubber({
  name,
  nipplesFieldName,
}: {
  name: string;
  nipplesFieldName: string;
}) {
  const [progress, setProgress] = useState<OnProgressProps>();
  const [duration, setDuration] = useState<number>();

  const { field } = useController({
    name,
  });

  const {
    field: { value: nipples },
  } = useController({
    name: nipplesFieldName,
  });

  const getWidthInPercentage = (seconds: string) => {
    return duration ? `${(100 / duration) * Number.parseInt(seconds)}%` : "0%";
  };

  return (
    <>
      <ReactPlayer
        onProgress={setProgress}
        onDuration={setDuration}
        url={`https://www.youtube.com/watch?v=${field.value}`}
        controls
        width="100%"
        height="100%"
      />
      <div>
        Elapsed <span>{Math.round(progress?.playedSeconds)}</span>
        Total <span>{duration}</span>
      </div>
      <div className="relative">
        <div
          className="bg-teal-600 h-3 absolute"
          style={{
            width: getWidthInPercentage(progress?.playedSeconds),
          }}
        />
        <div
          className="bg-teal-100 h-3"
          style={{
            width: getWidthInPercentage(duration),
          }}
        />

        {nipples.map((nipple, index) => (
          <div key={nipple.label + nipple.start}>
            <label
              title={nipple.label}
              htmlFor={`${nipplesFieldName}.${index}.label`}
              className="bg-yellow-200 h-3 relative cursor-pointer hover:bg-yellow-300 block"
              style={{
                left: nipple.start + "px",
                width: getWidthInPercentage(nipple.end - nipple.start),
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function FormField({
  label,
  name,
  ...props
}: { label: string; name: string } & ComponentProps<typeof Input>) {
  const { register } = useFormContext();

  return (
    <div>
      <Label>{label}</Label>
      <Input id={name} {...props} {...register(name)} />
    </div>
  );
}

function Videos({ register }: Pick<UseFormReturn, "register">) {
  const { fields, append } = useFieldArray({
    name: "videos",
  });

  return (
    <>
      {fields.map((field, index) => {
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Video #{index + 1}</CardTitle>
                <Button
                  type="button"
                  onClick={() => {
                    append({
                      videoId: "",
                      nipples: [],
                    });
                  }}
                >
                  +
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <>
                <div className="grid gap-2 grid-cols-[1fr_400px]">
                  <FormField
                    label="YouTube VideoId"
                    name={`videos.${index}.videoId`}
                  />

                  <div className="h-[200px]">
                    <VideoScrubber
                      nipplesFieldName={`videos.${index}.nipples`}
                      name={`videos.${index}.videoId`}
                    />
                  </div>
                </div>

                <Nipples index={index} register={register} />
              </>
            </CardContent>

            <CardFooter></CardFooter>
          </Card>
        );
      })}
    </>
  );
}

export default function Create() {
  const methods = useForm({
    defaultValues: async () => decode(window.location.hash.substring(1)),
  });

  const { register, watch } = methods;

  const router = useRouter();

  return (
    <div className="container p-2">
      <FormProvider {...methods}>
        <form>
          <Persister watch={watch} />
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Create your own Audio Nipple Board</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push(`/${window.location.hash}`);
                  }}
                >
                  Share 🪄
                </Button>
              </div>
              <CardDescription>
                Add multiple Youtube videos and the sequences you want to
                extract
              </CardDescription>

              <FormField label="Board title" name="title" />
            </CardHeader>
            <CardContent>
              <Videos register={register} />
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}
