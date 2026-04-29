import type { Preview } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { ModelProvider } from '@components';
import { MswProvider } from '@examples/components/MswProvider';
import { store } from '@examples/store';
import React from 'react';

const Decorators: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  return (
    <MswProvider>
      <Provider store={store}>
        <ModelProvider store={store}>{children}</ModelProvider>
      </Provider>
    </MswProvider>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <Decorators>
        <Story />
      </Decorators>
    ),
  ],
};

export default preview;
