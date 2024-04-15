import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@/components';
import { Link } from 'react-router-dom';
export { ErrorBoundary };
export function Component() {
  const { t } = useTranslation();
  return (
    <div className='p-4 w-full max-w-full xl:container mx-auto flex lg:flex-row flex-col items-stretch lg:items-center lg:justify-center'>
      <h1 className='grow flex items-center font-extrabold text-[10vw] leading-[.92em] dark:text-amber-50'>
        {t('ONELINER')}
      </h1>
      <div className='w-full lg:w-auto lg:ml-8 min-w-[300px]'>
        <div className='lg:mt-0 mt-4'>
          <h2 className='font-semibold text-xl mb-4'>{t('ONELINER')}</h2>
          <div className='font-light text-lg'>
            <p>This is a web based SVG path drawing animation application.</p>
            <p>Also, You can export the animation as a video.</p>
          </div>
          <div className='my-8 lg:text-left text-center'>
            <Link to='/app' className='button button-red w-full'>
              {t('GO TO APP!')}
            </Link>
          </div>
          <div className='font-light text-sm'>
            <p>
              Hi, I&apos;m goker the developer. I develop this app for my{' '}
              <a href='https://www.etsy.com/shop/goker'>one line posters on etsy</a>. You can check
              the <a href='https://www.etsy.com/shop/goker'>shop</a> and over your cursor on the
              &ldquo;Featured items&rdquo;.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Component.displayName = 'Landing.view';
