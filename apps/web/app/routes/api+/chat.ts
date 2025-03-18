import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import type { ActionFunctionArgs } from 'react-router';
import { z } from 'zod';

export const recipeSchema = z.object({
  title: z.string().describe('The title of the recipe'),
  description: z
    .string()
    .describe('A short (1-2 sentences) description of the recipe'),
  servingSize: z.string().describe('The serving size of the recipe'),
  cookingTime: z.string().describe('The cooking time of the recipe'),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      unit: z.string().optional().describe('Use metric system'),
    }),
  ),
  steps: z
    .array(z.string())
    .describe(
      'The steps to prepare the recipe. Include clear indications (exact temperature, time, etc.) if relevant',
    ),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the recipe'),
  tips: z.string().optional().describe('Any relevant tips (1-2 sentences)'),
  variations: z
    .string()
    .optional()
    .describe('Any relevant variations (1-2 sentences)'),
  changes: z
    .string()
    .optional()
    .describe(
      'Any changes to the recipe compared with previous recipes. Include the changes in the recipe',
    ),
});

export type Recipe = z.infer<typeof recipeSchema>;

export async function action({ request }: ActionFunctionArgs) {
  const { previousMessages, prompt } = await request.json();
  // const prompt = formData.get('prompt');
  console.log('previousMessages', previousMessages);
  console.log('prompt', prompt);

  const result = streamObject({
    model: google('gemini-2.0-flash-exp'),
    messages: [
      {
        role: 'system',
        content:
          'You are an expert chef and culinary instructor. Your role is to create detailed, easy-to-follow recipes based on user requests. Each recipe should include:\n\n' +
          '1. A list of ingredients with precise measurements using the metric system\n' +
          '2. Step-by-step cooking instructions with clear timing and technique descriptions\n' +
          '3. Cooking time and difficulty level (easy, medium, or hard)\n' +
          '4. Serving size information\n' +
          '5. Optional tips for best results and potential variations to accommodate dietary needs\n' +
          '6. Any changes from previous recipe versions, highlighting improvements\n\n' +
          'Focus on clarity, precision, and accessibility for cooks of all skill levels. Include specific temperatures (in both Celsius and Fahrenheit), preparation techniques, and visual cues for doneness. Consider health, sustainability, and seasonal ingredients when appropriate. Adapt to dietary restrictions mentioned in the prompt (vegetarian, vegan, gluten-free, etc.).\n\n' +
          'IMPORTANT: Always analyze previous messages to identify and document any changes between recipe versions. The "changes" field must explicitly list all modifications from previous versions, including ingredient adjustments, technique refinements, or timing changes. Be specific about what was improved or altered and why.\n\n' +
          'Reference previous messages to maintain consistency and incorporate feedback. Always answer in the language used by the user.',
      },
      ...previousMessages,
      {
        role: 'user',
        content: prompt,
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
