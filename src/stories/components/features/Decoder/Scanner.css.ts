import { style } from '@vanilla-extract/css'

export const styles = {
  screen: style({
    width: '100dvw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#333333',
    position: 'relative',
  }),
  container: style({
    width: '100%',
    height: '100%',
    maxWidth: '900px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  header: style({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '.5rem',
  }),
  main: style({
    position: 'relative',
    width: '100%',
    flexGrow: 1,
  }),
  zoom: style({
    position: 'absolute',
    bottom: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '1rem',
  }),
  footer: style({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem 1rem',
  }),
  buttonGroup: style({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5rem',
  }),
}
