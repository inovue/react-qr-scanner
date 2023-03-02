import type { Meta, StoryObj } from '@storybook/react';
import ReactCode from './ReactCode';

const meta = {
  title: 'ReactCode',
  component: ReactCode,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: [],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ReactCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scanner: Story = {
  args: {
    persist: true,
  },
};


