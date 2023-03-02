import type { Meta, StoryObj } from '@storybook/react';
import {ReactCodeScanner} from './ReactCodeScanner';

const meta = {
  title: 'ReactCodeScanner',
  component: ReactCodeScanner,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: [],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ReactCodeScanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReactCode: Story = {
  args: {
    persist: true,
  },
};


