import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';
import {
  AppProvider,
  ErrorPage,
} from '@edx/frontend-platform/react';

import React from 'react';
import ReactDOM from 'react-dom';

import Header from '@edx/frontend-component-header';
import FooterSlot from '@openedx/frontend-slot-footer';
import {
  SimaBotProvider,
  SimaBotModal,
  SimaBotIcon,
  useGetSimaBotContext,
} from '@sigmasoftware/sima-bot';

import messages from './i18n';
import configureStore from './data/configureStore';

import './index.scss';
import Head from './head/Head';

import AppRoutes from './routes/AppRoutes';

function SimaBotShell() {
  const { isOpenSimaBot, setIsOpenSimaBot } = useGetSimaBotContext();

  return (
    <>
      <AppRoutes />
      <SimaBotIcon />
      <SimaBotModal
        isOpenSimaBot={isOpenSimaBot}
        setIsOpenSimaBot={setIsOpenSimaBot}

        accessToken="[TOKEN]"
        hostWebApi={{
            message: '[api-conversations-message]',
            newConversation: '[api-conversations-new]',
            webSocket: '[stream-conversations]',
          }}
        isOpen={isOpenSimaBot}
        toggleOpen={setIsOpenSimaBot}
      />
    </>
  );
}

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={configureStore()}>
      <SimaBotProvider>
        <Head />
        <Header />
        <main id="main">
          <SimaBotShell />
        </main>
        <FooterSlot />
      </SimaBotProvider>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        COLLECT_YEAR_OF_BIRTH: process.env.COLLECT_YEAR_OF_BIRTH,
        ENABLE_SKILLS_BUILDER_PROFILE: process.env.ENABLE_SKILLS_BUILDER_PROFILE,
      }, 'App loadConfig override handler');
    },
  },
});
