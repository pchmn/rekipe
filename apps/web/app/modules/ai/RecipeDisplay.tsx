import { Badge } from '@rekipe/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rekipe/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@rekipe/ui/tabs';
import {
  ChefHat,
  Clock,
  HistoryIcon,
  LightbulbIcon,
  SparklesIcon,
  Users,
} from 'lucide-react';
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
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className='max-w-3xl mx-auto'>
      <CardHeader className='pb-4'>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle className='text-2xl md:text-3xl font-bold'>
              {recipe.title}
            </CardTitle>
            <CardDescription className='mt-2 text-base'>
              {recipe.description}
            </CardDescription>
          </div>
          <Badge
            className={`${getDifficultyColor(recipe.difficulty)} text-white capitalize`}
          >
            {recipe.difficulty}
          </Badge>
        </div>

        <div className='flex flex-wrap gap-4 mt-4'>
          <div className='flex items-center gap-2'>
            <Clock className='h-5 w-5 text-muted-foreground' />
            <span>{recipe.cookingTime}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Users className='h-5 w-5 text-muted-foreground' />
            <div className='flex items-center'>
              <span className='mx-2'>{recipe.servingSize}</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <ChefHat className='h-5 w-5 text-muted-foreground' />
            <span className='capitalize'>{recipe.difficulty}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue='ingredients' className='mt-2'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='ingredients'>Ingredients</TabsTrigger>
            <TabsTrigger value='instructions'>Instructions</TabsTrigger>
          </TabsList>

          <TabsContent value='ingredients' className='pt-4'>
            <ul className='space-y-3'>
              {recipe.ingredients?.map((ingredient, index) => (
                <li
                  key={index}
                  className='flex items-center gap-2 pb-2 border-b'
                >
                  <span className='font-medium min-w-[80px]'>
                    {ingredient?.quantity} {ingredient?.unit || ''}
                  </span>
                  <span>{ingredient?.name}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value='instructions' className='pt-4'>
            <ol className='space-y-5'>
              {recipe.steps?.map((step, index) => (
                <li
                  key={index}
                  className='relative pl-8 pb-2 flex items-center gap-2'
                >
                  <div className='absolute left-0 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-sm font-medium'>
                    {index + 1}
                  </div>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </TabsContent>
        </Tabs>

        {(recipe.tips || recipe.variations || recipe.changes) && (
          <div className='mt-8 space-y-4 border-t pt-4'>
            {recipe.tips && (
              <div className='flex gap-2'>
                <LightbulbIcon className='h-5 w-5 text-amber-500 flex-shrink-0 mt-1' />
                <div>
                  <h3 className='font-medium'>Tips</h3>
                  <p className='text-muted-foreground'>{recipe.tips}</p>
                </div>
              </div>
            )}

            {recipe.variations && (
              <div className='flex gap-2'>
                <SparklesIcon className='h-5 w-5 text-purple-500 flex-shrink-0 mt-1' />
                <div>
                  <h3 className='font-medium'>Variations</h3>
                  <p className='text-muted-foreground'>{recipe.variations}</p>
                </div>
              </div>
            )}

            {recipe.changes && (
              <div className='flex gap-2'>
                <HistoryIcon className='h-5 w-5 text-blue-500 flex-shrink-0 mt-1' />
                <div>
                  <h3 className='font-medium'>Changes</h3>
                  <p className='text-muted-foreground'>{recipe.changes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
