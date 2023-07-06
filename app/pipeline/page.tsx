"use client";

import { pipelineMachine } from "@/src/state-machines/pipeline-state-machine";
import { useMachine } from "@xstate/react";
import clsx from "clsx";
import {
  AiFillCheckCircle,
  AiOutlineLoading3Quarters,
  AiFillWarning,
} from "react-icons/ai";

interface TrackDoneVariables {
  dependenciesDone: boolean;
  lintDone: boolean;
  testingDone: boolean;
}
const StepPipelines: {
  key: string;
  trackDoneVariable: keyof TrackDoneVariables;
}[] = [
  {
    key: "Install Dependencies",
    trackDoneVariable: "dependenciesDone",
  },
  {
    key: "Lint",
    trackDoneVariable: "lintDone",
  },
  {
    key: "Unit Testing",
    trackDoneVariable: "testingDone",
  },
];

export default function Pipeline() {
  const [current, send, service] = useMachine(pipelineMachine);

  return (
    <div className="bg-slate-950 w-screen h-screen gap-x-40 flex items-center justify-center">
      <div>
        <h1 className="text-white text-2xl font-bold mb-2">Pipeline</h1>
        <p className="text-white opacity-60">
          Demo state machine with a Pipeline example
        </p>
      </div>

      <div>
        <div className="mb-8">
          <div
            className={clsx(
              {
                "bg-blue-500": !current.done,
                "bg-green-500": current.done && !current.context.isError,
                "bg-red-500": current.context.isError,
              },
              "w-[360px] rounded px-4 py-2 text-white mb-4  flex items-center"
            )}
          >
            {!current.done && (
              <AiOutlineLoading3Quarters
                className="mr-2 animate-spin"
                fill={"#fff"}
              />
            )}
            {current.done && !current.context.isError && (
              <AiFillCheckCircle className="mr-2" fill={"#ffffff"} />
            )}
            {current.done && current.context.isError && (
              <AiFillWarning className="mr-2" fill={"#ffffff"} />
            )}

            <p className="text-base">
              {current.done ? "Finish" : "In Progress"}
            </p>
          </div>
          {current.context.isError && (
            <div className="text-white">
              <p className="opacity-60">{current.context.errorMessage}</p>
            </div>
          )}
        </div>
        {current.nextEvents.map((e) => (
          <p className="text-white">{e}</p>
        ))}
        {StepPipelines.map((pipeline) => {
          const isCurrent = current.matches(pipeline.key);
          const isDone = current.context[pipeline.trackDoneVariable];
          const isNotLoading =
            current.value.toString() !== pipeline.key &&
            !current.context[pipeline.trackDoneVariable];
          return (
            <div
              key={pipeline.key}
              className={clsx(
                "transition-all outline-none opacity-100 text-white p-4 rounded mb-2",
                "flex items-center",
                "hover:bg-[#ffffff0f]",
                { "opacity-50": isNotLoading }
              )}
            >
              {isDone && (
                <AiFillCheckCircle className="mr-2" fill={"#4bde84"} />
              )}
              {isCurrent && !isDone && (
                <AiOutlineLoading3Quarters
                  className="mr-2 animate-spin"
                  fill={"#fff"}
                />
              )}
              <p className="text-xl"> {pipeline.key}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
