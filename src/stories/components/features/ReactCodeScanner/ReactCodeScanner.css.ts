import {style} from '@vanilla-extract/css';



export const styles = {
  root: style({
    width: '100dvw',
    height: '100dvh',
    overflow:'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }),
  wrapper: style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    maxWidth: '600px',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0)',
  }),
  canvas: style({
    flex: 1,
    width: '100%',
    height: '100%',
  })
}