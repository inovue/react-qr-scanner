import type { Meta, StoryObj } from '@storybook/react';
import { Scanner } from './Scanner';

const meta = {
  title: 'Example/Scanner',
  component: Scanner,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Scanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Qr: Story = {
  args: {
  },
};
