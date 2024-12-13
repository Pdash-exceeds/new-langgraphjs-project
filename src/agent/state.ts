/* eslint-disable import/no-extraneous-dependencies */
import { BaseMessage, BaseMessageLike } from "@langchain/core/messages";
import { Annotation, messagesStateReducer } from "@langchain/langgraph";
import { z } from "zod";

export const CodeEvaluationSchema = z.object({
  project: z.string(),
  hash: z.string(),
  evaluation: z.string(),
});
export type CodeEvaluationType = z.infer<typeof CodeEvaluationSchema>;

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
  weekly_summaries: Annotation<CodeEvaluationType[]>({
    reducer: (state, update) => {
      return state.concat(update);
    },
  }),

  overall_evaluation: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "The overall evaluation is good.",
  }),
});
