import { style,keyframes } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes';

export const scanning = keyframes({
  '0%': { transform: 'translate(-50%, -80px)' },
  '25%': { transform: 'translate(-50%, 0%)' },
  '50%': { transform: 'translate(-50%, 80px)' },
  '75%': { transform: 'translate(-50%, 0%)' },
  '100%': { transform: 'translate(-50%, -80px)' },
});

const barColor = "0,199,255" 

export const styles = {
  heroContainer: style({
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  
  scanBar: style({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    maxWidth: '500px',
    height: '5px',
    background: `linear-gradient(90deg, rgba(${barColor},0) 0%, rgba(${barColor},1) 50%, rgba(${barColor},0) 100%)`,
    animation: `${scanning} 3s linear infinite`,
  }),

  //buttons
  buttons: style({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: '3rem',
    margin: '48px 0',
  }),
    
  // vanilla extract recipe for a button
  button: recipe({
    base: {
      minWidth: '150px',
      padding: '.5rem 1rem',
      borderRadius: '25px',
      backgroundColor: '#00c7ff',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      border: 'none',
      ':hover': {
        backgroundColor: '#00b0e0',
      },
    },
    variants: {
      outlined: {
        true: {
          backgroundColor: 'transparent',
          border: '2px solid #00c7ff',
          color: '#00c7ff',
          ':hover': {
            backgroundColor: '#00c7ff',
            color: '#fff',
          },
        },
      },
    },
  })
  
}