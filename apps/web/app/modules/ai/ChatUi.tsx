import { experimental_useObject } from '@ai-sdk/react';
import { Flex } from '@rekipe/ui/flex';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Form } from 'react-router';
import { type Recipe, recipeSchema } from '~/routes/api+/chat';
import { AiInput } from './AiInput';
import { RecipeDisplay } from './RecipeDisplay';

type UserMessage = {
  role: 'user';
  content: string;
};
type AssistantMessage = {
  role: 'assistant';
  content: Recipe | string;
};
type ChatMessage = UserMessage | AssistantMessage;

function stringifyMessages(messages: ChatMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content:
      typeof message.content === 'object'
        ? JSON.stringify(message.content)
        : message.content,
  }));
}

export function ChatUi() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { submit, isLoading, object, stop, error } =
    experimental_useObject<Recipe>({
      api: '/api/chat',
      schema: recipeSchema,
      onFinish: ({ object }) => {
        if (object) {
          console.log('previousMessages', messages);
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'assistant', content: object },
          ]);
        }
      },
    });

  return (
    <Form
      onSubmit={(e) => {
        console.log('submit', prompt);
        submit({ previousMessages: stringifyMessages(messages), prompt });
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'user', content: prompt },
        ]);
        setPrompt('');
      }}
    >
      <Flex direction='col' gap='xl' justify='center' align='center' flex='1'>
        <AiInput
          name='prompt'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className='max-w-2xl'
        />

        {messages
          .filter((message) => message.role === 'user')
          .map((message) => (
            <div key={JSON.stringify(message)}>{message.content}</div>
          ))}

        {error && (
          <div className='p-4 bg-red-100 text-red-800 rounded-lg'>
            Error: {error.message}
          </div>
        )}

        {isLoading && (
          <div className='flex justify-center items-center h-32'>
            <div className='flex flex-col items-center gap-2'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <p>Cooking up a structured recipe...</p>
            </div>
          </div>
        )}

        {object && <RecipeDisplay recipe={object} />}
      </Flex>
    </Form>
  );
}
