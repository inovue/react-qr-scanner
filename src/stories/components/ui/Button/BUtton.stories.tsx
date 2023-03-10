import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from './Button';
import { FaPlay, FaPause } from 'react-icons/fa';
import {MdFlipCameraAndroid, MdFlashlightOn, MdFlashlightOff, } from 'react-icons/md';
import {SlClose} from 'react-icons/sl';

const meta = {
  title: 'UI/Button',
  component: Button,
  // tags: ['autodocs'],
  parameters: {
    layout: 'centered',    
    backgrounds: {
      default: 'dark',
    }
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Play: Story = {
  args: {
    children: <FaPlay />,
    disabled: false,
    size: 'lg',
  },
};
export const Pause: Story = {
  args: {
    children: <FaPause />,
    disabled: true,
    size: 'lg',
  },
};
export const Close: Story = {
  args: {
    children: <SlClose />,
    disabled: true,
    size: 'lg',
  },
};
export const Flip: Story = {
  args: {
    children: <MdFlipCameraAndroid />,
    disabled: true,
    size: 'md',
  },
};

export const Bulb: Story = {
  args: {
    children: <MdFlashlightOn />,
    disabled: true,
    size: 'md',
  },
};
export const BulbOff: Story = {
  args: {
    children: <MdFlashlightOff />,
    disabled: true,
    size: 'md',
  },
};