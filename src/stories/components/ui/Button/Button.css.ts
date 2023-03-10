import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

// https://zenn.dev/mai_zenn/articles/5c9e018f9ff468
export const buttonStyle = style({
  appearance: 'none',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
  padding: 6,
  fontSize: '3rem',
  lineHeight: 0,
  
  color: 'white',
  borderRadius: '50%',
  ':active': {
    backgroundColor: 'rgb(125, 125, 125, 0.2)',
  },
  ':disabled': {
    cursor: 'auto',
    color: 'rgb(125, 125, 125)',
  },
});

export const button = recipe({
  base: [{
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    padding: 6,
    lineHeight: 0,
    color: 'white',
    borderRadius: '50%',
    ':disabled': {
      cursor: 'auto',
      color: 'rgb(125, 125, 125)',
    },
  }],

  variants: {
    size: {
      sm:{fontSize: '1rem',},
      md:{fontSize: '1.5rem',},
      lg:{fontSize: '2rem',},
      xl:{fontSize: '3rem',}
    },
    disabled: {
      false: {
        ':active': {
          backgroundColor: 'rgb(125, 125, 125, 0.2)',
        },
      }
    }
  },

  defaultVariants: {
    size: 'md',
    disabled: false
  }
});