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
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type FormValues = Board;

const Persister = () => {
  const { watch } = useFormContext<FormValues>();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  watch((data) => {
    if (Object.keys(data).length === 0) {
      return;
    }

    router.push(`${pathname}?board=${encode(data)}`);
  });

  return null;
};

function Nipples({ parentIndex }: { parentIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    name: `videos.${parentIndex}.nipples`,
  });

  return (
    <div>
      <h3 className="mb-2 text-lg">Sequences</h3>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="-ml-3 grid auto-cols-min grid-flow-col gap-2 rounded-lg p-2 px-3 hover:bg-gray-100"
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

          <div className="flex w-full justify-between place-self-end self-end justify-self-end pb-2">
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
          <div className="absolute z-20 flex h-[200px] w-full items-center justify-center bg-red-400 text-white">
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
              className="absolute z-10 bg-red-400"
              style={{
                left: getWidthInPercentage(progress?.playedSeconds),
                width: (progress?.playedSeconds ?? 0) > 0 ? 1 : 0,
                height: 10 + 12 * nipples.length,
              }}
            />

            <div
              className="absolute z-10 bg-teal-600"
              style={{
                width: getWidthInPercentage(progress?.playedSeconds),
                height: 10,
              }}
            />

            <div
              className="h-3 bg-teal-100"
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
        className="relative block h-3 cursor-pointer bg-yellow-300 hover:bg-yellow-400"
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
    <div className="flex flex-col gap-2 py-2">
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
                        <div className="grid grid-cols-[1fr_400px] gap-2 py-3">
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
  const params = useSearchParams();

  const encodedBoard = params.get("board");

  const methods = useForm<FormValues>({
    defaultValues: async () => {
      if (encodedBoard) {
        return decode(encodedBoard);
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
