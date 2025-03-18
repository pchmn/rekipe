import { Badge } from '@rekipe/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rekipe/ui/card';
import { ChefHat, Clock, Lightbulb, Users } from 'lucide-react';
import type { Recipe } from '~/routes/api+/chat';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
interface RecipeDisplayProps {
  recipe: DeepPartial<Recipe>;
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle className='text-2xl'>{recipe.title}</CardTitle>
              <CardDescription className='mt-2'>
                {recipe.description}
              </CardDescription>
            </div>
            <Badge
              variant={
                recipe.difficulty === 'easy'
                  ? 'outline'
                  : recipe.difficulty === 'medium'
                    ? 'secondary'
                    : 'destructive'
              }
            >
              {recipe.difficulty &&
                recipe.difficulty.charAt(0).toUpperCase() +
                  recipe.difficulty.slice(1)}
            </Badge>
          </div>
          <div className='flex gap-4 mt-2'>
            <div className='flex items-center gap-1 text-sm text-muted-foreground'>
              <Clock className='h-4 w-4' />
              {recipe.cookingTime}
            </div>
            <div className='flex items-center gap-1 text-sm text-muted-foreground'>
              <Users className='h-4 w-4' />
              {recipe.servingSize}
            </div>
          </div>

          <div className='bg-muted p-4 rounded-lg'>
            <p>{recipe.changes}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-medium mb-3'>Ingredients</h3>
              <ul className='space-y-2'>
                {recipe.ingredients?.map((ingredient) => (
                  <li
                    key={JSON.stringify(ingredient)}
                    className='flex items-start'
                  >
                    <span className='mr-2'>•</span>
                    <span>
                      {ingredient?.quantity} {ingredient?.unit}{' '}
                      {ingredient?.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-medium mb-3'>Instructions</h3>
              <ol className='space-y-3 list-decimal list-inside'>
                {recipe.steps?.map((step) => (
                  <li key={JSON.stringify(step)} className='pl-1'>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className='mt-6 space-y-4'>
            <div className='bg-muted p-4 rounded-lg'>
              <div className='flex items-center gap-2 mb-2'>
                <Lightbulb className='h-5 w-5 text-amber-500' />
                <h3 className='font-medium'>Tips</h3>
              </div>
              <p>{recipe.tips}</p>
            </div>

            <div className='bg-muted p-4 rounded-lg'>
              <div className='flex items-center gap-2 mb-2'>
                <ChefHat className='h-5 w-5 text-indigo-500' />
                <h3 className='font-medium'>Variations</h3>
              </div>
              <p>{recipe.variations}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
