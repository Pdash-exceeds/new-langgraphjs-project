import { BaseMessage, BaseMessageLike } from "@langchain/core/messages";
import { Annotation, messagesStateReducer } from "@langchain/langgraph";
import { z } from "zod";

export const CodeEvaluationSchema = z.object({
  project: z.string(),
  hash: z.string(),
  evaluation: z.string(),
});
export type CodeEvaluationType = z.infer<typeof CodeEvaluationSchema>;

export const WeeklyEvaluationSchema = z.object({
  project: z.string(),
  evaluation: z.string(),
});
export type WeeklyEvaluationType = z.infer<typeof WeeklyEvaluationSchema>;

// This is the primary state of your agent, where you can store any information
export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[], BaseMessageLike[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  code_evaluation: Annotation<CodeEvaluationType[]>({
    reducer: (state, update) => {
      return state.concat(update);
    },
  }),
  weekly_summaries: Annotation<WeeklyEvaluationType[]>({
    reducer: (state, update) => {
      return state.concat(update);
    },
  }),

  overall_evaluation: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "The overall evaluation is good.",
  }),
  role: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "Developer",
  }),
  worklog_summary: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "The worklog summary is good.",
  }),
  execution_summary: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "The execution summary is good.",
  }),
  crafsmanship_summary: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "The craftsmanship summary is good.",
  }),
  combined_worklog_summary: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "The combined worklog summary is good.",
  }),
  combined_execution_summary: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "The combined execution summary is good.",
  }),
  combined_crafsmanship_summary: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "The combined craftsmanship summary is good.",
  }),
  final_review: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "The final review is good.",
  }),
});
