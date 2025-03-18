import { experimental_useObject } from '@ai-sdk/react';
import { Button } from '@rekipe/ui/button';
import { Card, CardContent } from '@rekipe/ui/card';
import { Flex } from '@rekipe/ui/flex';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ChatUi } from '~/modules/ai/ChatUi';
import { useCurrentUser } from '~/modules/auth/useCurrentUser';
import { recipeSchema } from '../api+/chat';

export function meta() {
  return [
    { title: 'rekipe' },
    { name: 'description', content: 'Welcome to rekipe!' },
  ];
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const { submit, isLoading, object, stop, error } = experimental_useObject({
    api: '/api/chat',
    schema: recipeSchema,
  });

  console.log('object', { isLoading, object, stop, error });

  const currentUser = useCurrentUser();

  const { t } = useTranslation();

  return (
    <Flex direction='col' gap='md' flex='1'>
      {currentUser.is_anonymous && (
        <Flex justify='center' align='center' flex='1' className='mb-4'>
          <Card className='shadow-none'>
            <CardContent className='p-2 pl-3 inline-flex gap-2 items-center'>
              <p className='text-xs text-muted-foreground'>
                {t('index.dontLoseYourProgress')}
              </p>
              <Link to='/sign-in'>
                <Button size='xs' variant='ghost'>
                  {t('index.signIn')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Flex>
      )}

      <ChatUi />
    </Flex>
  );
}
