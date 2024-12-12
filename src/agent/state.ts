import { BaseMessage, BaseMessageLike } from "@langchain/core/messages";
import { Annotation, messagesStateReducer } from "@langchain/langgraph";

// This is the primary state of your agent, where you can store any information
export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[], BaseMessageLike[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  code_evaluation: Annotation<string[]>({
    reducer: (state, update) => {
      return state.concat(update);
    },
  }),

  overall_evaluation: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "The overall evaluation is good.",
  }),
});
