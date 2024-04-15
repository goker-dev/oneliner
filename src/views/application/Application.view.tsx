import { useTranslation } from 'react-i18next';

import { ErrorBoundary } from '@/components';
import { useEffect, useRef, useState } from 'react';
import { Application } from './Application.lib.ts';
export { ErrorBoundary };

const app = new Application();
export function Component() {
  const { t } = useTranslation();
  const container = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const ref = useRef<HTMLTextAreaElement>(null);
  const refTime = useRef<HTMLInputElement>(null);
  const refBackground = useRef<HTMLInputElement>(null);
  const refColor = useRef<HTMLInputElement>(null);
  const refLineWidth = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!container.current) return;
    app.init(
      container.current,
      1250, //container.current?.clientWidth || innerWidth,
      1000, //container.current?.clientHeight || innerHeight,
    );
    app.set({
      path: ref.current?.value || '',
      time: Number(refTime.current?.value) || 6,
      background: refBackground.current?.value || '#000000',
      color: refColor.current?.value || '#000000',
      lineWidth: Number(refLineWidth.current?.value) || 2,
    });
    app.draw();
    // app.addListeners();
    return () => {
      app.remove();
    };
  }, []);

  const handleUpdate = () => {
    app.set({
      path: ref.current?.value || '',
      time: Number(refTime.current?.value) || 6,
      background: refBackground.current?.value || '#000000',
      color: refColor.current?.value || '#000000',
      lineWidth: Number(refLineWidth.current?.value) || 2,
    });
    app.draw();
  };
  const handleVideo = () => {
    setLoading(true);
    app?.exportVideo(() => setLoading(false));
  };

  return (
    <div className='w-full h-full flex items-stretch'>
      {/*<div className='grow-0 dark:bg-zinc-800/50 px-4 py-2 text-sm '>*/}
      {/*  <span className='text-gray-400 mr-4'>{t('TOOL BOX:')}</span>*/}
      {/*  /!*<button onClick={handleSave} className={''}>*!/*/}
      {/*  /!*  {loading && <i className='icon-spin animate-spin' />}*!/*/}
      {/*  /!*  {t('IMAGE EXPORT')}*!/*/}
      {/*  /!*</button>*!/*/}
      {/*  <button onClick={handleVideo} className={''}>*/}
      {/*    {loading && <i className='icon-spin animate-spin' />}*/}
      {/*    {t('VIDEO EXPORT')}*/}
      {/*  </button>*/}
      {/*</div>*/}
      <div
        ref={container}
        className='grow p-4 w-full flex items-center justify-center overflow-hidden'
      />
      <div className='grow-0 w-1/6 dark:bg-zinc-800/50 p-4 text-sm space-y-4'>
        <div>
          <label className='block mb-1'>PATH:</label>
          <textarea
            ref={ref}
            name='path'
            defaultValue='M125.58,227.33c1.9-4.6,2.1-8.9-.9-12.2s-7.8-4.5-12.2-4.5-8.9,1-13.3,1.4c-7.7.7-15.7-.3-22.6-3.9-16.2-8.4-20.9-30-9.7-44.6,6-7.8,15.1-12.6,24.6-15.1s19.4-2.7,29.2-2.7c11.1,0,30-1.8,28.8-17.4-1.1-15.3-20.3-17.2-31.4-12.8-13.1,5.3-22.6,16.6-30.6,28.2-8,11.6-15.1,24.1-25.5,33.5s-25.3,14.7-38.6,10.1c-14.5-5-23.1-21.2-21-36.5,2.1-15.3,13.1-28.2,26.5-35.7,13.4-7.5,29-10.2,44.4-10.9,7-.3,14-.3,20.9-1.7,6.9-1.4,13.7-4.3,18.2-9.6,4.5-5.3,6.5-13.2,3.4-19.5-3.1-6.3-10-13.1-21.5-11.7-3.2.4-9.5,3.2-12.5,6.7-6,7-6.3,11.1-9.4,19.2-4.3,11.2-11.2,21.7-20.4,29.4-9.1,7.6-22.1,10.8-33.3,6.7S-.62,107.73.78,96.03c1.1-9.5,6.8-19.7,15-24.6,8.2-4.9,20.3-8.7,29.7-10.4,6.2-1.1,9.4-6.4,4.8-9.5-4.2-2.7-8.3-2.6-12.1-7-3.1-3.6-4.3-9.6-4.6-14.2-.3-4.9-.1-9.6-.5-14.3-.2-3.7-1.2-8.3,1.5-11.4,1.1-1.3,7.3-4,9.2-4,3.4,0,6.14,4.26,8.34,6.46,4.8,4.7,7.76,7.54,11.86,12.74,9.9,12.6,2.6,18.9,4.9,26.5,1.5,4.8,2.8,7.49,2.1,12.59-.5,3.7-3,6.9-5.9,9.2-5.37,5.55-24.7,9.51-30.2,11.41-4.8,1.7-9.7,3.8-13.2,7.4-3.6,3.7-5.5,9.3-3.7,14,2.3,5.9,9.8,8.5,16,7.1,6.2-1.5,11.2-6,15.2-10.8,4.1-4.9,7.6-10.2,10-16.1,2.6-6.2,4-13,7.7-18.6,12.1-18.5,41.6-20.7,56.1-4.4,13.6,15.4,10.4,40.3-6.8,51.8-10.4,6.9-23.5,7.7-35.8,9.5-12.1,1.8-24.5,3.1-36,7.3-8.5,3.1-16.6,8.8-21.9,16.1s-5.9,18.8,1,24.6c3.6,3.1,8.6,4.1,13.3,3.5,4.7-.6,9-2.8,12.8-5.5,15.7-11.3,22.2-31.4,35-45.9,8.8-10,20.7-17,33.5-20.4,20.8-5.4,46.6,2.8,46.7,28.4.1,25.7-26.2,33.7-47.5,32.4-8.5-.5-17.3-.9-25.4,1.6-8.2,2.5-15.7,8.5-17.8,16.8-1.4,5.5,0,11.7,3.8,15.8,3.7,4,9.3,5.7,14.8,6.3,5.5.5,11,0,16.4.3s11.1,1.5,15.4,5c4.2,3.5,7.1,9.4,5.4,15.7'
            className='p-2 text-black rounded w-full min-h-36'
          />
        </div>
        <div>
          <label className='block mb-1'>TIME:</label>
          <input
            ref={refTime}
            type='number'
            min='6'
            max='13'
            defaultValue='6'
            step='1'
            className='p-2 text-black rounded w-full'
          />
        </div>
        <div>
          <label className='block mb-1'>BACKGROUND:</label>
          <input
            ref={refBackground}
            type='text'
            defaultValue='#000000'
            className='p-2 text-black rounded w-full'
          />
        </div>
        <div>
          <label className='block mb-1'>COLOR:</label>
          <input
            ref={refColor}
            type='text'
            defaultValue='#ff3311'
            className='p-2 text-black rounded w-full'
          />
        </div>
        <div>
          <label className='block mb-1'>LINE WIDTH:</label>
          <input
            ref={refLineWidth}
            type='number'
            min='0.5'
            max='13'
            defaultValue='1'
            step='0.2'
            className='p-2 text-black rounded w-full'
          />
        </div>

        <button
          onClick={handleUpdate}
          className='px-4 py-2.5 my-4 rounded dark:bg-zinc-800/50 w-full'
        >
          {t('UPDATE')}
        </button>
        <hr />
        <button
          onClick={handleVideo}
          className='px-4 py-2.5 my-4 rounded dark:bg-zinc-800/50 w-full'
        >
          {loading && <i className='icon-spin animate-spin' />}
          {t('VIDEO EXPORT')}
        </button>
      </div>
    </div>
  );
}

Component.displayName = 'Application.view';
