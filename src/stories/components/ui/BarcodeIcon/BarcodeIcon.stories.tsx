import type { Meta, StoryObj } from '@storybook/react';
import { Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { BarcodeIcon } from './BarcodeIcon';

const meta = {
  title: 'UI/BarcodeIcon',
  component: BarcodeIcon,
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    }
  },
  
} satisfies Meta<typeof BarcodeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;


export const QR_CODE: Story = {
  args: {
    format: Html5QrcodeSupportedFormats.QR_CODE,
    rumble: false,
    color: 'base'
  },
};

export const EAN_13: Story = {
  args: {
    format: Html5QrcodeSupportedFormats.EAN_13,
    rumble: true,
    color: 'success'
  },
};

export const EAN_8: Story = {
  args: {
    format: Html5QrcodeSupportedFormats.EAN_8,
    rumble: true,
    color: 'error'
  },
};