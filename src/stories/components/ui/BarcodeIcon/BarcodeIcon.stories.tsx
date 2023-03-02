import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BarcodeIcon, BarcodeIconState, TickState } from './BarcodeIcon';

const meta = {
  title: 'UI/BarcodeIcon',
  component: BarcodeIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof BarcodeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;


const Template:React.FC = () => {
  const [tick, setTick] = React.useState<TickState>();

  return (
    <div style={{backgroundColor:'lightgrey', padding:'2rem', display:'flex', flexDirection:'column', gap:'1rem', alignItems:'center'}}>
      <BarcodeIcon tick={tick}/>
      <nav>
        <button onClick={()=>setTick({state: BarcodeIconState.SUCCESS})} style={{color:'green'}}>SUCCESS</button>
        <button onClick={()=>setTick({state: BarcodeIconState.ERROR})} style={{color:'red'}}>ERROR</button>
        <button onClick={()=>setTick({state: BarcodeIconState.DEFAULT})}>DEFAULT</button>
      </nav>
    </div>
  )
}

export const QrcodeIcon = Template.bind({});