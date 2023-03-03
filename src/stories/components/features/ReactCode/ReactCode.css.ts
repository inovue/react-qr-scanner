import { createTheme, style } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: {
    brand: 'red'
  },
  font: {
    body: 'arial'
  }
});

export const styles = {
  canvasWrapper: style({
    position: 'relative',
  }),
  barcodeIconWrapper:style({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }),
  barcodeIcon: style({
    color: 'rgba(255, 255, 255, 0.6)',
  }),
  navbar: style({
    display: 'flex',
    gap: '1rem',
    backgroundColor: 'black',
    padding: '.5rem 1rem',
  }),

  // rounded icon button
  iconButton: style({
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    padding: '.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    selectors: {
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      },
    },
  }),

  error:{
    wrapper: style({
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    container: style({
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
    }),
    
    icon: style({
      color: 'red',
    }),
    message: style({
      color: 'red',
      fontSize: '1rem',
    }),
  }
}
