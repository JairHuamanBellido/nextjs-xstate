"use client";
import {  useMachine } from "@xstate/react";

import { createMachine } from "xstate";



const lightMachine = createMachine({
  on: {},
  id: "light",
  initial: "red",
  states: {
    green: {
      on: { TURN_RED: "red" },
    },
    red: {
      after: {
        2000: {
          target: "green",
        },
      },
      on: { TURN_GREEN: "green" },
    },
  },
});


export default function Home() {
  const [current, send] = useMachine(lightMachine);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <p>Current state {current.value.toString()}</p>
    </div>
  );
}
