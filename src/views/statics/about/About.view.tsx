import { useTranslation } from 'react-i18next';

import { Divider, ErrorBoundary } from '@/components';
export { ErrorBoundary };
export function Component() {
  const { t } = useTranslation();
  return (
    <div className='py-8 px-4 w-full xl:container xl:px-0 mx-auto'>
      <Divider align='left'>
        <h1 className='text-lg font-semibold uppercase'>{t('About')}</h1>
      </Divider>
      <div className='flex my-8'>
        <p>
          Hi, I&apos;m goker the developer. I develop this app for my{' '}
          <a href='https://www.etsy.com/shop/goker'>one line posters on etsy</a>. You can check the{' '}
          <a href='https://www.etsy.com/shop/goker'>shop</a> and over your cursor on the
          &ldquo;Featured items&rdquo;.
        </p>
      </div>
    </div>
  );
}
