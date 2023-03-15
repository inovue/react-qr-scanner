import clsx from "clsx";
import { IconBaseProps, IconType } from "react-icons";
import { SlInfo, SlExclamation } from 'react-icons/sl'
import {CiFaceFrown} from 'react-icons/ci'
import { styles, colors } from './style.css';
import {FiLoader} from 'react-icons/fi';
export type Colors = keyof typeof colors;

export type CardProps = {
  type?: Colors;
  title?: string;
  message?:string;
  children?:React.ReactNode;
}

export const Card:React.FC<CardProps> = ({type, title,  message, children}) => {
  const IconsSize = 64;
  const Icons:{[key in Colors]?: JSX.Element}= {
    info: <SlInfo size={IconsSize} className={colors.info}></SlInfo>,
    loading: <FiLoader size={IconsSize} className={colors.loading}></FiLoader>,
    warn: <SlExclamation size={IconsSize} className={colors.warn}></SlExclamation>,
    error: <CiFaceFrown size={IconsSize} className={colors.error}></CiFaceFrown>,
  }
  return (
    <div className={styles.container}>
      {type && Icons?.[type] && Icons[type]}
      {title && <div className={clsx(styles.title, (type && colors[type]))}>{title}</div>}
      {message && <div className={styles.message}>{message}</div>}
      {children && children}
    </div>
  )
}