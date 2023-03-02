import {style} from '@vanilla-extract/css';

export const styles = {
  wrapper: style({
    widows: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '.1rem 2rem',
    backgroundColor: 'rgba(0, 0, 0, 1)',
  }),

  buttons: style({
    display: 'flex',
    gap: '2rem',
  }),
  
  buttonWrapper: style({
    backgroundColor: 'transparent',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    width: '32px',
    aspectRatio: '1',
    cursor: 'pointer',
  }),
}