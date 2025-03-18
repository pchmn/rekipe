import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import type { ActionFunctionArgs } from 'react-router';
import { z } from 'zod';

export const recipeSchema = z.object({
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      unit: z.string().describe('Use metric system'),
    }),
  ),
  description: z
    .string()
    .describe('A short (1-2 sentences) description of the recipe'),
  steps: z.array(z.string()).describe('The steps to prepare the recipe'),
  cookingTime: z.string().describe('The cooking time of the recipe'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the recipe'),
  servingSize: z.string().describe('The serving size of the recipe'),
  tips: z.string().describe('Any relevant tips or variations'),
  variations: z.string().describe('Any relevant tips or variations'),
  recipe: z.string().describe('The recipe'),
});

export async function action({ request }: ActionFunctionArgs) {
  const prompt = await request.json();
  // const prompt = formData.get('prompt');
  console.log('prompt', prompt);

  const result = streamObject({
    model: google('gemini-2.0-flash-exp'),
    messages: [
      {
        role: 'system',
        content:
          'You are an expert chef and culinary instructor. Your role is to create detailed, easy-to-follow recipes based on user requests. Each recipe should include:\n\n' +
          '1. A list of ingredients with precise measurements\n' +
          '2. Step-by-step cooking instructions\n' +
          '3. Cooking time and difficulty level\n' +
          '4. Serving size\n' +
          '5. Any relevant tips or variations\n\n' +
          'Keep instructions clear and concise. Include important cooking techniques and temperatures where necessary. Consider dietary restrictions when mentioned in the prompt.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt as string,
          },
        ],
      },
    ],
    schema: recipeSchema,
    output: 'object',
    onFinish: ({ object }) => {
      const res = recipeSchema.safeParse(object);
      if (res.error) {
        console.error(JSON.stringify(res.error.errors, null, 2));
        throw new Error(res.error.errors.map((e) => e.message).join('\n'));
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return result.toTextStreamResponse();
}
