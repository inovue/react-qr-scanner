import {button} from './Button.css'

export type ButtonProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl'
} & JSX.IntrinsicElements['button']

export const Button = (props: ButtonProps) => {
  return <button {...props} className={button({disabled:props.disabled, size:props.size})} >{props.children}</button>
}