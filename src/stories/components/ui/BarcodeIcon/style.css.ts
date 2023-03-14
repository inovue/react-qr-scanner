import { style, keyframes } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import OP from 'open-props';

const rumble = keyframes({
  '0%': { transform: 'translate(0)' },
  '25%': { transform: 'translate(2px) rotate(5deg)' },
  '50%': { transform: 'translate(0, 0)' },
  '75%': { transform: 'translate(-2px) rotate(-5deg)' },
  '100%': { transform: 'translate(0)' },
});

export const icon = recipe({
  base: {
    width: "150px",
    height: "150px",
  },
  variants: {
    color: {
      base: { fill: "rgba(255, 255, 255, 0.5)" },
      success: { fill: `hsl(${OP.green9Hsl} / 50%)` },
      error: { fill: `hsl(${OP.red9Hsl} / 50%)` },
    },
    rumble:{
      true: {
        animation: `${rumble} 0.1s linear infinite`
      }
    }
  },
  defaultVariants: {
    color: "base",
    rumble: false
  }
});

