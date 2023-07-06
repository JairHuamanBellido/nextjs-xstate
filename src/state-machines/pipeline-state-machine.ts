import { assign, createMachine } from "xstate";

const RandomResult = () =>
  new Promise((resolve, reject) => {
    const TIMEOUT = 2000;
    const randomNumber = Math.random() * 100;

    return setTimeout(() => {
      if (randomNumber < 5) {
        reject();
      }
      resolve(true);
    }, TIMEOUT);
  });

export const pipelineMachine = createMachine(
  {
    id: "pipeline",
    initial: "Install Dependencies",
    context: {
      dependenciesDone: false,
      lintDone: false,
      testingDone: false,
      isError: false,
      errorMessage: undefined || "",
    },
    states: {
      "Install Dependencies": {
        id: "Install",
        after: {
          1500: {
            actions: assign((context, event) => ({
              ...context,
              dependenciesDone: true,
            })),
            target: "Lint",
          },
        },
      },
      Lint: {
        id: "Lint",

        invoke: {
          id: "Lint",
          src: RandomResult,
          onDone: {
            target: "Unit Testing",
            actions: assign((context, event) => ({
              ...context,
              lintDone: true,
            })),
          },
          onError: {
            target: "finish",
            actions: assign((context, event) => ({
              ...context,
              isError: true,
              errorMessage: "Some typescript are not correctly formatted!",
            })),
          },
        },
      },
      "Unit Testing": {
        after: {
          3000: {
            target: "finish",
            actions: assign((context, event) => ({
              ...context,
              testingDone: true,
            })),
          },
        },
      },
      finish: {
        type: "final",
      },
    },
    predictableActionArguments: true,
  },
  {
    actions: {
      finishStepOne: (context, event) => {
        context.dependenciesDone = true;
      },
      finishStepTwo: (context, event) => {
        context.lintDone = true;
      },
      finishStepThree: (context, event) => {
        context.testingDone = true;
      },
    },
  }
);
