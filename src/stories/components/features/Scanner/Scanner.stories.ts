import type { Meta, StoryObj } from '@storybook/react';
import { Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {Scanner} from './Scanner';

const meta = {
  title: 'Feature/Scanner',
  component: Scanner,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: [],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Scanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Environment: Story = { 
  args: {
    state: Html5QrcodeScannerState.SCANNING,
    mode: 'environment',
    delay: 1000,
    timeout: 0,
    fitScreen: true,
    format: Html5QrcodeSupportedFormats.QR_CODE,
    onScanSuccess: (result) => console.log(result),
    onScanError: (error) => console.error(error)
  }
};


