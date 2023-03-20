import { style,keyframes } from '@vanilla-extract/css'


//親要素の高さ分上下するトランジション
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
  
}