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
    height: '100%',
    maxWidth: '900px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  header: style({
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
  barcodeIcon: style({
    lineHeight: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }),
  zoom: style({
    position: 'absolute',
    bottom: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '.8rem',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '1rem',
  }),
  footer: style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '.5rem 1rem 2rem 1rem',
  }),
  buttonGroup: style({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5rem',
  }),
}
