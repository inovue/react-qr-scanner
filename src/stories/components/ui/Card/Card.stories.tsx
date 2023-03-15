import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card } from './Card';
import { FaPlay, FaPause } from 'react-icons/fa';
import { MdFlipCameraAndroid, MdFlashlightOn, MdFlashlightOff } from 'react-icons/md';
import { SlClose } from 'react-icons/sl';

const meta = {
  title: 'UI/Card',
  component: Card,
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    }
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Loading: Story = {
  args: {
    type: 'loading',
  },
};

export const Error: Story = {
  args: {
    type:'error',
    title:"ERROR",
    message:'This is an error message'
  },
};