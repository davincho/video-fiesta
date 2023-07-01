"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import Header from "./Header";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { encode, decode } from "@/lib/url";
import { Board, Nipple } from "@/lib/types";

import {
  useFieldArray,
  useForm,
  useController,
  FormProvider,
  useFormContext,
  FieldPath,
  FieldPathByValue,
  useWatch,
} from "react-hook-form";

import ReactPlayer from "react-player";
import { ComponentProps, useRef, useState } from "react";
import { OnProgressProps } from "react-player/base";
import Link from "next/link";

type FormValues = Board;

const Persister = () => {
  const { watch } = useFormContext<FormValues>();

  watch((data) => {
    if (Object.keys(data).length === 0) {
      return;
    }

    window.location.replace(`#${encode(data)}`);
  });

  return null;
};

function Nipples({ parentIndex }: { parentIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    name: `videos.${parentIndex}.nipples`,
  });

  return (
    <div>
      <h3 className="text-lg mb-2">Sequences</h3>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-flow-col auto-cols-min gap-2 hover:bg-gray-100 -ml-3 p-2 px-3 rounded-lg"
        >
          <FormField
            name={`videos.${parentIndex}.nipples.${index}.label`}
            label="Label"
            className="w-[200px]"
          />

          <FormField
            name={`videos.${parentIndex}.nipples.${index}.start`}
            label="Start"
            type="number"
            placeholder="sec"
            min={0}
            className="w-20"
          />

          <FormField
            name={`videos.${parentIndex}.nipples.${index}.end`}
            label="End"
            placeholder="sec"
            type="number"
            className="w-20"
          />

          <div className="flex justify-self-end place-self-end self-end pb-2 w-full justify-between">
            <Button variant="outline" type="button">
              ▶️
            </Button>

            <Button
              variant="outline"
              type="button"
              onClick={() => {
                remove(index);
              }}
            >
              🗑️
            </Button>
          </div>
        </div>
      ))}
      <Button
        className="mt-2"
        type="button"
        onClick={() => {
          append({});
        }}
      >
        Add sequence
      </Button>
    </div>
  );
}

function VideoScrubber({
  name,
  nipplesFieldName,
}: {
  name: FieldPath<FormValues>;
  nipplesFieldName: FieldPathByValue<FormValues, Nipple[]>;
}) {
  const [progress, setProgress] = useState<OnProgressProps>();
  const [duration, setDuration] = useState<number>();

  const [hasError, setHasError] = useState(true);

  const playerRef = useRef<any>();

  const { field } = useController({
    name,
  });

  const [currentNipple, setCurrentNipple] = useState<Nipple>();
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    field: { value: nipples },
  } = useController<FormValues, typeof nipplesFieldName>({
    name: nipplesFieldName,
  });

  const getWidthInPercentage = (seconds?: string | number) => {
    if (!duration || !seconds) {
      return "0%";
    }

    const convertedSeconds =
      typeof seconds === "string" ? Number.parseInt(seconds) : seconds;

    return `${(100 / duration) * convertedSeconds}%`;
  };

  return (
    <>
      <div className="relative">
        {hasError && (
          <div className="absolute bg-red-400 h-[200px] z-20 w-full flex justify-center text-white items-center">
            There is something wrong with your video 😢
          </div>
        )}
        <ReactPlayer
          playing={isPlaying}
          onProgress={setProgress}
          onDuration={setDuration}
          onReady={() => setHasError(false)}
          onError={() => setHasError(true)}
          url={`https://www.youtube.com/watch?v=${field.value}`}
          controls
          progressInterval={500}
          width="100%"
          height={200}
          ref={playerRef as any}
        />
        {!hasError && (
          <div className="bg-yellow-100">
            <div
              className="bg-red-400 absolute z-10"
              style={{
                left: getWidthInPercentage(progress?.playedSeconds),
                width: (progress?.playedSeconds ?? 0) > 0 ? 1 : 0,
                height: 10 + 12 * nipples.length,
              }}
            />

            <div
              className="bg-teal-600 absolute z-10"
              style={{
                width: getWidthInPercentage(progress?.playedSeconds),
                height: 10,
              }}
            />

            <div
              className="bg-teal-100 h-3"
              style={{
                width: getWidthInPercentage(duration),
                height: 10,
              }}
            />

            {nipples.map((nipple, index) => (
              <Sequence
                key={nipple.label + nipple.start}
                nipple={nipple}
                getWidthInPercentage={getWidthInPercentage}
                nippleFormName={`${nipplesFieldName}.${index}`}
                onClick={() => {
                  playerRef.current.seekTo(nipple.start);

                  setCurrentNipple(nipple);
                  setIsPlaying(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
      {!hasError && (
        <div className="font-mono">
          Elapsed <span>{progress?.playedSeconds.toFixed(2)} (s)</span> - Total{" "}
          <span>{duration} (s)</span>
        </div>
      )}
    </>
  );
}

function Sequence({
  onClick,
  nipple,
  nippleFormName,
  getWidthInPercentage,
}: {
  onClick: () => void;
  nipple: Nipple;
  nippleFormName: string;
  getWidthInPercentage: (seconds?: string | number) => string;
}) {
  useWatch({
    name: nippleFormName,
  });

  return (
    <div key={nipple.label + nipple.start}>
      <label
        onClick={onClick}
        title={nipple.label}
        htmlFor={`${nippleFormName}.label`}
        className="bg-yellow-300 h-3 relative cursor-pointer hover:bg-yellow-400 block"
        style={{
          left: getWidthInPercentage(nipple.start),
          width: getWidthInPercentage(nipple.end - nipple.start),
        }}
      />
    </div>
  );
}

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

function Videos() {
  const { fields, append, remove } = useFieldArray({
    name: "videos",
  });

  return (
    <>
      {fields.length > 0 && (
        <Accordion
          type="single"
          collapsible
          data-id={fields[0]?.id}
          value={fields[0]?.id}
          className="mb-3"
        >
          {fields.map((field, index) => {
            return (
              <AccordionItem data-id={field.id} value={field.id} key={field.id}>
                <AccordionTrigger>Video #{index + 1}</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent>
                      <>
                        <div className="grid gap-2 grid-cols-[1fr_400px] py-3">
                          <Nipples parentIndex={index} />
                          <div>
                            <FormField
                              label="YouTube VideoId"
                              name={`videos.${index}.videoId`}
                            />
                            <div>
                              <VideoScrubber
                                nipplesFieldName={`videos.${index}.nipples`}
                                name={`videos.${index}.videoId`}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-2">
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      <Button
        type="button"
        block
        onClick={() => {
          append({
            videoId: "",
            nipples: [],
          });
        }}
      >
        Add video
      </Button>
    </>
  );
}

export default function Create() {
  const methods = useForm<FormValues>({
    defaultValues: async () => {
      const hash = window.location.hash.substring(1);

      if (hash) {
        return decode(hash);
      }

      return {};
    },
  });

  return (
    <div className="container p-5">
      <Link href="/" className="text-lg">
        Video Fiesta 🎉
      </Link>
      <FormProvider {...methods}>
        <form>
          <Persister />
          <Card>
            <Header />
            <CardContent>
              <Videos />
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}
