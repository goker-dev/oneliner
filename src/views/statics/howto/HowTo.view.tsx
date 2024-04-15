import { useTranslation } from 'react-i18next';

import { Divider, ErrorBoundary } from '@/components';
export { ErrorBoundary };
export function Component() {
  const { t } = useTranslation();

  return (
    <div className='py-8 px-4 w-full xl:container xl:px-0 mx-auto'>
      <Divider align='left'>
        <h1 className='text-lg font-semibold uppercase'>{t('How To?')}</h1>
      </Divider>
      <div className='flex my-8 h-full'>
        <iframe
          className='w-full h-full'
          src='https://www.youtube.com/embed/hcMGbrByWS8?si=qIF69qZ_RMZFxLeV'
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          referrerPolicy='strict-origin-when-cross-origin'
          allowFullScreen
        />
      </div>
    </div>
  );
}
