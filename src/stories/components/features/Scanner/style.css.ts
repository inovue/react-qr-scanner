import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const styles = {
  screen: style({
    width: '100dvw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#333333',
    position: 'relative',
  }),
  container: recipe({
    base:{
      position: 'relative',
      height: '100%',
      maxWidth: '640px',
      display: 'flex',
    },
    variants: {
      orientation: {
        portrait: {
          flexDirection: 'column',
        },
        landscape: {
          flexDirection: 'row',
        }
      }
    },
    defaultVariants: {
      orientation: 'portrait',
    },
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
    height: '100%',
    flexGrow: 1,
  }),
  barcodeIcon: style({
    lineHeight: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }),
  zoom: recipe({
    base:{
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      //alignItems: 'center',
      gap: '.8rem',
    },
    variants: {
      orientation: {
        portrait: {
          flexDirection: 'row',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
        },
        landscape: {
          flexDirection: 'column-reverse',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          '-webkit-appearance': 'slider-vertical',
        },
      }
    },
    defaultVariants: {
      orientation: 'portrait',
    }
  }),
  zoomRange: recipe({
    base:{},
    variants: {
      orientation: {
        portrait: {},
        landscape: {
          writingMode: 'vertical-lr',
          WebkitAppearance: 'slider-vertical',
          maxWidth: '2rem',
        },
      }
    },
    defaultVariants: {
      orientation: 'portrait',
    }
  }),
  toolbar: recipe({
    base:{
      display: 'flex',
      justifyContent: 'space-around'
    },
    variants: {
      orientation: {
        portrait: {
          flexDirection: 'row',
          padding: '1rem 0rem',
        },
        landscape: {
          flexDirection: 'column-reverse',
          padding: '0rem 1rem',
        },
      }
    },
    defaultVariants: {
      orientation: 'portrait',
    },
  }),
}
