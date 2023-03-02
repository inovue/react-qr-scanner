import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Html5QrcodeScannerState } from 'html5-qrcode';
import { FooterBar } from './FooterBar';

const meta = {
  title: 'UI/Footerbar',
  component: FooterBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FooterBar>;
export default meta;

export const Footerbar: StoryObj<typeof meta> = {
  args: {
    state: Html5QrcodeScannerState.SCANNING,
  },
};
