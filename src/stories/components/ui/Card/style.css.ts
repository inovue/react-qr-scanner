import { style } from '@vanilla-extract/css';
import OP from 'open-props';


export const colors = {
  info: style({color: OP.blue5}),
  success: style({color: OP.green5}),
  warn: style({color: OP.yellow5}),
  error: style({color: OP.red5}),
}

export const styles = {
  container: style({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    color: 'white',
  }),
  title: style({
    fontSize: OP.fontSize4,
    fontWeight: OP.fontWeight8,
    textAlign: 'center'
  }),
  message: style({
    fontSize: OP.fontSize1,
    textAlign: 'center'
  }),
}