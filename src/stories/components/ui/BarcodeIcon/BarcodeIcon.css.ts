import { style, keyframes } from '@vanilla-extract/css';
import { BarcodeIconState } from './BarcodeIcon';


const rumbleKeyframes = keyframes({
  '0%': { transform: 'translate(0)' },
  '25%': { transform: 'translate(2px) rotate(5deg)' },
  '50%': { transform: 'translate(0, 0)' },
  '75%': { transform: 'translate(-2px) rotate(-5deg)' },
  '100%': { transform: 'translate(0)' },
});


export const styles = {
  icon: style({
    color: 'rgba(255, 255, 255, 0.5)',
  }),
  stateColor: {
    [BarcodeIconState.DEFAULT]: style({
    }),
    [BarcodeIconState.SUCCESS]: style({
      color: 'rgba(0, 100, 0, 0.5)',
      animation: `${rumbleKeyframes} 0.1s linear infinite`
    }),
    [BarcodeIconState.ERROR]: style({
      color: 'rgba(100, 0, 0, 0.5)',
      animation: `${rumbleKeyframes} 0.1s linear infinite`
    }),
  }
}


