/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { Send, StateGraph } from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";
import { CodeEvaluationSchema, StateAnnotation } from "./state.js";
import * as hub from "langchain/hub";
import { ChatOpenAI, convertPromptToOpenAI } from "@langchain/openai";
import { loadDiff } from "./utils.js";

export const gpt_4o_model = new ChatOpenAI({
  model: "gpt-4o-2024-08-06",
  maxConcurrency: 10,
  maxRetries: 1,
  temperature: 0,
});

export const gpt_4o_mini_model = new ChatOpenAI({
  model: "gpt-4o-mini",
  maxConcurrency: 10,
  maxRetries: 1,
  temperature: 0,
});

const getCurrentModel = () => {
  return gpt_4o_model;
};

const identifyLevels = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm identifying levels!`,
      },
    ],
  };
};
const identifyJobFunction = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm identifying Job Functions!`,
      },
    ],
  };
};

const join1 = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm joining!`,
      },
    ],
  };
};
const sumarizeCommits = async (data: {
  hash: string;
  repo: string;
  state: typeof StateAnnotation.State;
}): Promise<Partial<typeof StateAnnotation.Update>> => {
  console.log("Current state:", data.state);
  console.log("Data:", data);

  const diff = loadDiff(`src/agent/${data.hash}.txt`);

  const prompt_message = await hub.pull("commit-prompt");
  const promptMessageText = await prompt_message.invoke({
    diff: diff,
    message: "Summarize the commit",
  });

  const { messages } = convertPromptToOpenAI(promptMessageText);
  const prompt: any = messages[1]?.content ? messages[1].content : "";
  try {
    const response = await getCurrentModel()
      .withStructuredOutput(CodeEvaluationSchema, {
        name: "code_evaluation",
      })
      .invoke(prompt);
    return { code_evaluation: [response] };
  } catch (e) {
    console.error(e);
  }

  return {};
};
const weeklySummaries = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm summarizing weekly!`,
      },
    ],
  };
};

const join2 = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm joining 2!`,
      },
    ],
  };
};
const generateWorklogSummary = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm generating worklog summary!`,
      },
    ],
  };
};

const generateCrafsmanshipSummary = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm generating craftsmanship summary!`,
      },
    ],
  };
};

const generateExecutionSummary = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm generating execution summary!`,
      },
    ],
  };
};
const join3 = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm joining 3!`,
      },
    ],
  };
};

const combineWorkLogSummaries = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm combining worklog summaries!`,
      },
    ],
  };
};

const combineExecutionSummaries = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm combining execution summaries!`,
      },
    ],
  };
};

const combineCrafsmanshipSummaries = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm combining craftsmanship summaries!`,
      },
    ],
  };
};

const join4 = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm joining 4!`,
      },
    ],
  };
};

const finalReview = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", state);
  return {
    messages: [
      {
        role: "assistant",
        content: `I'm reviewing!`,
      },
    ],
  };
};
const routeToSumarizeCommits = (_state: typeof StateAnnotation.State) => {
  let sends: any[] = [];

  // const hashes = config?.configurable?.hashes
  //   ? config.configurable.hashes
  //   : ["testhash1", "testhash2"];
  //const hashes = ["hash1", "hash2"];
  const hashes = [
    { hash: "hash1", repo: "My First Repo" },
    { hash: "hash2", repo: "My Second Repo" },
  ];

  hashes?.map((aHash: { hash: string; repo: string }) => {
    sends = sends.concat(
      new Send("sumarizeCommits", { hash: aHash.hash, repo: aHash.repo }),
    );
  });
  return sends;
};

const routeToWeeklySummaries = (state: typeof StateAnnotation.State) => {
  let sends: any[] = [];
  const evaluations = state.code_evaluation;
  const groupedByProject = evaluations.reduce(
    (acc, evaluation) => {
      const { project } = evaluation;
      if (!acc[project]) {
        acc[project] = [];
      }
      acc[project].push(evaluation);
      return acc;
    },
    {} as Record<string, typeof state.code_evaluation>,
  );

  Object.entries(groupedByProject).forEach(([project, evaluations]) => {
    console.log(`Project: ${project}`);
    console.log(`Evaluations: ${evaluations}`);
    sends = sends.concat(new Send("weeklySummary", { project, evaluations }));
  });

  return sends;
};
const weeklySummary = async (
  data: {
    project: string;
    evaluations: any[];
    state: typeof StateAnnotation.State;
  },
  _config?: RunnableConfig,
): Promise<typeof StateAnnotation.Update> => {
  console.log("Current state:", data.state);

  // Combine summaries from the batch
  const weeklySummaries = data.evaluations.map((e) => e.evaluation).join("\n");

  const prompt_message = await hub.pull("weekly-summary-prompt");
  const promptMessageText = await prompt_message.invoke({
    weeklySummaries,
  });

  const { messages } = convertPromptToOpenAI(promptMessageText);
  const prompt: any = messages[1]?.content ? messages[1].content : "";
  try {
    const response = await getCurrentModel()
      .withStructuredOutput(CodeEvaluationSchema, {
        name: "weekly_summary",
      })
      .invoke(prompt);
    return { weekly_summaries: [response] };
  } catch (e) {
    console.error(e);
  }

  return {};
};

// Finally, create the graph itself.
const builder = new StateGraph(StateAnnotation)
  .addNode("identifyLevels", identifyLevels)
  .addNode("identifyJobFunction", identifyJobFunction)
  .addNode("join1", join1)
  .addNode("sumarizeCommits", sumarizeCommits)
  .addNode("weeklySummaries", weeklySummaries)
  .addNode("weeklySummary", weeklySummary)
  .addNode("join2", join2)
  .addNode("generateWorklogSummary", generateWorklogSummary)
  .addNode("generateExecutionSummary", generateExecutionSummary)
  .addNode("generateCrafsmanshipSummary", generateCrafsmanshipSummary)
  .addNode("join3", join3)
  .addNode("combineWorkLogSummaries", combineWorkLogSummaries)
  .addNode("combineExecutionSummaries", combineExecutionSummaries)
  .addNode("combineCrafsmanshipSummaries", combineCrafsmanshipSummaries)
  .addNode("join4", join4)
  .addNode("finalReview", finalReview)
  .addEdge("__start__", "identifyLevels")
  .addEdge("__start__", "identifyJobFunction")
  .addEdge("identifyLevels", "join1")
  .addEdge("identifyJobFunction", "join1")
  .addConditionalEdges("join1", routeToSumarizeCommits, ["sumarizeCommits"])
  .addEdge("sumarizeCommits", "weeklySummaries")
  .addConditionalEdges("weeklySummaries", routeToWeeklySummaries, [
    "weeklySummary",
  ])
  .addEdge("weeklySummary", "join2")
  .addEdge("join2", "generateWorklogSummary")
  .addEdge("join2", "generateExecutionSummary")
  .addEdge("join2", "generateCrafsmanshipSummary")
  .addEdge("generateWorklogSummary", "join3")
  .addEdge("generateExecutionSummary", "join3")
  .addEdge("generateCrafsmanshipSummary", "join3")
  .addEdge("join3", "combineWorkLogSummaries")
  .addEdge("join3", "combineExecutionSummaries")
  .addEdge("join3", "combineCrafsmanshipSummaries")
  .addEdge("combineWorkLogSummaries", "join4")
  .addEdge("combineExecutionSummaries", "join4")
  .addEdge("combineCrafsmanshipSummaries", "join4")
  .addEdge("join4", "finalReview")
  .addEdge("finalReview", "__end__");

export const graph = builder.compile();

graph.name = "Review Writer";
