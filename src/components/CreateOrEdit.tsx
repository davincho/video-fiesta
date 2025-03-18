"use client";

import { Button } from "@/components/ui/button";

import { saveBoard } from "../app/actions";

import { zodResolver } from "@hookform/resolvers/zod";

import { Toaster } from "@/components/ui/toaster";

import Header from "../app/create/Header";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { encode, decode } from "@/lib/url";

import { boardSchema, FormValues, Sequence } from "@/lib/schema";
import Logo from "@/components/Logo";

import {
  useFieldArray,
  useForm,
  useController,
  FormProvider,
  useFormContext,
  FieldPath,
  FieldPathByValue,
  useWatch,
  useFormState,
  SubmitHandler,
} from "react-hook-form";

import ReactPlayer from "react-player";
import { useEffect, useRef, useState } from "react";
import { OnProgressProps } from "react-player/base";
import Link from "next/link";


import FormField from "../app/create/FormField";
import { pathOr, stringToPath } from "remeda";
import { useToast } from "./ui/use-toast";
import { ZodError } from "zod";
import { useHash } from "@/app/useHash";
import { SequenceComponent } from "./SequenceComponent";
import { useRouter } from "next/navigation";


function Nipples({ parentIndex }: { parentIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    name: `videos.${parentIndex}.sequences`,
  });

  return (
    <div>
      <h3 className="mb-2 text-lg">Sequences</h3>

      <FormError name={`videos.${parentIndex}.sequences`} />
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="-ml-3 grid auto-cols-min grid-flow-col gap-2 rounded-lg p-2 px-3 hover:bg-gray-100"
        >
          <FormField
            name={`videos.${parentIndex}.sequences.${index}.label`}
            label="Label"
            className="w-[200px]"
          />

          <FormField
            name={`videos.${parentIndex}.sequences.${index}.start`}
            label="Start"
            type="number"
            placeholder="sec"
            min={0}
            className="w-20"
            registerProps={{
              valueAsNumber: true,
            }}
          />

          <FormField
            name={`videos.${parentIndex}.sequences.${index}.end`}
            label="End"
            placeholder="sec"
            type="number"
            className="w-20"
            registerProps={{
              valueAsNumber: true,
            }}
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
  sequencesFieldName,
}: {
  name: FieldPath<FormValues>;
  sequencesFieldName: FieldPathByValue<FormValues, Sequence[]>;
}) {
  const [progress, setProgress] = useState<OnProgressProps>();
  const [duration, setDuration] = useState<number>();

  const { setError } = useFormContext();

  const [hasError, setHasError] = useState(true);

  const playerRef = useRef<any>();

  const { field } = useController({
    name,
  });

  const [currentNipple, setCurrentNipple] = useState<Sequence>();
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    field: { value: sequences },
  } = useController<FormValues, typeof sequencesFieldName>({
    name: sequencesFieldName,
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
        {!field.value && hasError && (
          <div className="absolute z-20 flex h-[200px] w-full items-center justify-center bg-red-400 text-white">
            There is something wrong with your video 😢
          </div>
        )}

        <ReactPlayer
          playing={isPlaying}
          onProgress={setProgress}
          onDuration={setDuration}
          onReady={() => setHasError(false)}
          onError={() => {
            setHasError(true);

            setError(name, {
              message: `The videoId doesn't seem to be correct`,
            });
          }}
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
                height: 10 + 12 * sequences.length,
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

            {sequences.map((sequence, index) => (
              <SequenceComponent
                key={sequence.label + sequence.start}
                nipple={sequence}
                getWidthInPercentage={getWidthInPercentage}
                nippleFormName={`${sequencesFieldName}.${index}`}
                onClick={() => {
                  console.log("nipple", sequence);

                  playerRef.current.seekTo(sequence.start);

                  setCurrentNipple(sequence);
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

function FormError({ name }: { name: FieldPath<FormValues> }) {


  const g = name;

  const { errors } = useFormState<FormValues>({
    name: g,
    exact: true,
  });













  
  const hui = stringToPath(name)

  const fieldError = pathOr(errors, hui as any, undefined as any);


  



  return (
    <>
      {fieldError && (
        <div className="py-2 text-sm text-red-600">{fieldError.message}</div>
      )}
    </>
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
          defaultValue={fields[0]?.id}
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
                                sequencesFieldName={`videos.${index}.sequences`}
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
                        Delete video
                      </Button>
                    </CardFooter>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
      <FormError name="videos" />

      <Button
        type="button"
        block
        onClick={() => {
          append({
            videoId: "",
            sequences: [],
          });
        }}
      >
        Add video
      </Button>
    </>
  );
}

const DEFAULT_INITIAL_VALUES = {
  title: "Wiener Nipple Board",
  videos: [
    {
      videoId: "P59kknO1wQY",
      sequences: [
        {
          label: "HAZUNG",
          start: 12,
          end: 16,
        },
        {
          label: "MÜTE",
          start: 8,
          end: 12,
        },
        {
          label: "HERR MINISTER",
          start: 67,
          end: 74,
        },
      ],
    },
    {
      videoId: "Q8hnPWbKFPc",
      sequences: [
        {
          label: "Bringta bringta",
          start: 51,
          end: 55,
        },
        {
          label: "Hat Angst die Usterreicher",
          start: 107,
          end: 120,
        },
      ],
    },
    {
      videoId: "eSJgyCpXYYA",
      sequences: [
        {
          label: "Raketenraucher",
          start: 55,
          end: 59,
        },
        {
          label: "Streicheln",
          start: 61,
          end: 71,
        },
      ],
    },
    {
      videoId: "sQPnzG8n-Xg",
      sequences: [
        {
          label: "Nächste deppate Frog",
          start: 34,
          end: 50,
        },
      ],
    },
    {
      videoId: "Ft__88zQG9I",
      sequences: [
        {
          label: "Vegetarier",
          start: 45,
          end: 49,
        },
      ],
    },
    {
      videoId: "4d7-p_F5JsM",
      sequences: [
        {
          label: "Katze Fischhandlung",
          start: 338,
          end: 347,
        },
      ],
    },
  ],
} satisfies FormValues;

export default function Create({
  admin_token,
  b_id,
}: {
  b_id?: string;
  
  admin_token?: string;
}) {
  const { toast } = useToast();

  const isEditMode = !!b_id;

  const router = useRouter();

  const [hash, setHash] = useHash();

  const methods = useForm<FormValues>({
    mode: "onTouched",
    resolver: zodResolver(boardSchema),
    defaultValues: async () => {
      return hash ? decode(hash.substring(1)) : DEFAULT_INITIAL_VALUES;
    },
    resetOptions: {
      keepDirty: true,
    },
  });

  const watch = methods.watch;

  useEffect(() => {
    const subscription = watch((data, params) => {
      if (Object.keys(data).length === 0) {
        return;
      }

      if (!params.name) {
        return;
      }

      console.log("SETTING HASH", data, params);

      setHash(data);
    }, {});

    return () => {
      console.log("UNSUBSCRIBING - setHash");
      subscription.unsubscribe();
    };
  }, [watch, setHash]);

  const { setError } = methods;

  const submitHandler: SubmitHandler<FormValues> = async (formData, event) => {
    console.log("test");

    if (!event) {
      return;
    }

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const formAction = submitter.formAction;

    console.log("SUBMITTER", submitter, formAction);

    try {
      const isPreview = formAction.indexOf("preview") > -1;

      if (isPreview) {
        router.push(`/preview${window.location.hash}`);

        console.log("HUHUHUHUH");
      } else {
        // Check if operation is CREATE or UPDATE action

        if (b_id) {
          const { success, errors, data } = await saveBoard(formData, {
            id: b_id,
            adminToken: admin_token,
          });

          console.log("server errors:", errors);

          if (!success) {
            if (errors) {


              

              

              Object.entries(errors).forEach(([path, error]) => {
                

                


                setError(path as any, {
                  message: error.message,
                });
              });
            }
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
            });
          } else {
            toast({
              variant: "success",
              title: "Board saved",
            });

            if(data) {
              methods.reset(data.board);
            }

            
          }
        } else {
          console.log("CREATING NEW BOARD");

          const result = await saveBoard(formData, {});

          console.log("result", result);
        }
      }
    } catch {}
  };

  console.log("ERRORS", methods.formState.errors);

  return (
    <div className="container p-5">
      <Toaster />

      <Link href="/" className="block pb-2 font-mono text-lg">
        <Logo />
      </Link>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitHandler)}>
          <Card>
            <Header isEditMode={isEditMode} />
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

/**
 * 
 * 
 * {
    "title": "Wiener Nipple Board",
    "videos": [
        {
            "videoId": "P59kknO1wQY",
            "nipples": [
                {
                    "label": "HAZUNG",
                    "start": "12",
                    "end": "16"
                },
                {
                    "label": "MÜTE",
                    "start": "8",
                    "end": "12"
                },
                {
                    "label": "HERR MINISTER",
                    "start": "67",
                    "end": "74"
                }
            ]
        },
        {
            "videoId": "Q8hnPWbKFPc",
            "nipples": [
                {
                    "label": "Bringta bringta",
                    "start": "51",
                    "end": "55"
                },
                {
                    "label": "Hat Angst die Usterreicher",
                    "start": "107",
                    "end": "120"
                }
            ]
        },
        {
            "videoId": "eSJgyCpXYYA",
            "nipples": [
                {
                    "label": "Raketenraucher",
                    "start": "55",
                    "end": "59"
                },
                {
                    "label": "Streicheln",
                    "start": "61",
                    "end": "71"
                }
            ]
        },
        {
            "videoId": "sQPnzG8n-Xg",
            "nipples": [
                {
                    "label": "Nächste deppate Frog",
                    "start": "34",
                    "end": "50"
                }
            ]
        },
        {
            "videoId": "Ft__88zQG9I",
            "nipples": [
                {
                    "label": "Vegetarier",
                    "start": "45",
                    "end": "49"
                }
            ]
        },
        {
            "videoId": "4d7-p_F5JsM",
            "nipples": [
                {
                    "label": "Katze Fischhandlung",
                    "start": "338",
                    "end": "347"
                }
            ]
        }
    ]
}
 */
