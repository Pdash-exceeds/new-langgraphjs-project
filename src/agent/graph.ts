/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { RunnableConfig } from "@langchain/core/runnables";
import { MemorySaver, Send, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI, convertPromptToOpenAI } from "@langchain/openai";
import * as hub from "langchain/hub";
import {
  CodeEvaluationSchema,
  StateAnnotation,
  WeeklyEvaluationSchema,
} from "./state.js";
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
    role: "Software Engineer",
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
) => {
  console.log("Current state:", state);
  const prompt_message = await hub.pull("worklog-summaries-prompt");
  const weeklySummaries = state.weekly_summaries
    .map((e) => e.evaluation)
    .join("\n <Next Summary> \n");

  const promptMessageText = await prompt_message.invoke({
    weekly_project_summaries: weeklySummaries,
    role: state.role,
  });

  const { messages } = convertPromptToOpenAI(promptMessageText);
  const prompt: any = messages[1]?.content ? messages[1].content : "";
  try {
    const response = await getCurrentModel().invoke(prompt);

    return { worklog_summary: response.content };
  } catch (e) {
    console.error(e);
  }
  return {};
};

const generateCrafsmanshipSummary = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
) => {
  const prompt_message = await hub.pull("craftsmanship-summaries-prompt");
  const weeklySummaries = state.weekly_summaries
    .map((e) => e.evaluation)
    .join("\n <Next Summary> \n");

  const promptMessageText = await prompt_message.invoke({
    weekly_project_summaries: weeklySummaries,
    role: state.role,
  });

  const { messages } = convertPromptToOpenAI(promptMessageText);
  const prompt: any = messages[1]?.content ? messages[1].content : "";
  try {
    const response = await getCurrentModel().invoke(prompt);

    return { crafsmanship_summary: response.content };
  } catch (e) {
    console.error(e);
  }
  return {};
};

const generateExecutionSummary = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
) => {
  console.log("Current state:", state);
  const prompt_message = await hub.pull("execution-summaries-prompt");
  const weeklySummaries = state.weekly_summaries
    .map((e) => e.evaluation)
    .join("\n <Next Summary> \n");

  const promptMessageText = await prompt_message.invoke({
    weekly_project_summaries: weeklySummaries,
    role: state.role,
  });

  const { messages } = convertPromptToOpenAI(promptMessageText);
  const prompt: any = messages[1]?.content ? messages[1].content : "";
  try {
    const response = await getCurrentModel().invoke(prompt);

    return { execution_summary: response.content };
  } catch (e) {
    console.error(e);
  }
  return {};
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
) => {
  console.log("Current state:", state);
  const prompt_message = await hub.pull("combined-summaries-prompt");
  const facet = "the worklog that I did in various projects";
  const combinedSummary = state.worklog_summary;

  const promptMessageText = await prompt_message.invoke({
    project_summaries: combinedSummary,
    role: state.role,
    facet,
    artifacts: "No documents available",
  });

  const { messages } = convertPromptToOpenAI(promptMessageText);
  const prompt: any = messages[1]?.content ? messages[1].content : "";
  try {
    const response = await getCurrentModel().invoke(prompt);

    return { combined_worklog_summary: response.content };
  } catch (e) {
    console.error(e);
  }
  return {};
};

const combineExecutionSummaries = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
) => {
  console.log("Current state:", state);
  const prompt_message = await hub.pull("combined-summaries-prompt");
  const facet = "the execution that I did in various projects";
  const combinedSummary = state.execution_summary;

  const promptMessageText = await prompt_message.invoke({
    project_summaries: combinedSummary,
    role: state.role,
    facet,
    artifacts: "No documents available",
  });

  const { messages } = convertPromptToOpenAI(promptMessageText);
  const prompt: any = messages[1]?.content ? messages[1].content : "";
  try {
    const response = await getCurrentModel().invoke(prompt);

    return { combined_execution_summary: response.content };
  } catch (e) {
    console.error(e);
  }
  return {};
};

const combineCrafsmanshipSummaries = async (
  state: typeof StateAnnotation.State,
  _config: RunnableConfig,
) => {
  console.log("Current state:", state);
  const prompt_message = await hub.pull("combined-summaries-prompt");
  const facet = "the craftsmanship that I did in various projects";
  const combinedSummary = state.crafsmanship_summary;

  const promptMessageText = await prompt_message.invoke({
    project_summaries: combinedSummary,
    role: state.role,
    facet,
    artifacts: "No documents available",
  });

  const { messages } = convertPromptToOpenAI(promptMessageText);
  const prompt: any = messages[1]?.content ? messages[1].content : "";
  try {
    const response = await getCurrentModel().invoke(prompt);

    return { combined_crafsmanship_summary: response.content };
  } catch (e) {
    console.error(e);
  }
  return {};
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
) => {
  console.log("Current state:", state);
  const prompt_message = await hub.pull("exceeds-review-prompt");

  const promptMessageText = await prompt_message.invoke({
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    organization: "Example Inc.",
    job_title: state.role,
    review_period_start_date: "2022-01-01",
    review_period_end_date: "2022-01-07",
    worklog_summary: state.combined_worklog_summary,
    execution_summary: state.combined_execution_summary,
    craftsmanship_summary: state.combined_crafsmanship_summary,
  });

  const { messages } = convertPromptToOpenAI(promptMessageText);
  const prompt: any = messages[1]?.content ? messages[1].content : "";
  try {
    const response = await getCurrentModel().invoke(prompt);

    return { final_review: response.content };
  } catch (e) {
    console.error(e);
  }
  return {};
};
const routeToSumarizeCommits = (_state: typeof StateAnnotation.State) => {
  let sends: any[] = [];

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
  const weeklySummaries = data.evaluations
    .map((e) => e.evaluation)
    .join("\n <Next Summary> \n");

  console.log(weeklySummaries);

  const prompt_message = await hub.pull("weekly-summary-prompt");
  const promptMessageText = await prompt_message.invoke({
    weeklySummaries,
  });

  const { messages } = convertPromptToOpenAI(promptMessageText);
  const prompt: any = messages[1]?.content ? messages[1].content : "";
  try {
    let response = await getCurrentModel()
      .withStructuredOutput(WeeklyEvaluationSchema, {
        name: "weekly_summary",
      })
      .invoke(prompt);
    response.project = data.project;
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

let memory = new MemorySaver();

export const graph = builder.compile({ checkpointer: memory });

graph.name = "Review Writer";
