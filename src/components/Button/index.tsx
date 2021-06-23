import { ButtonHTMLAttributes } from 'react';
import './styles.scss';


// ele recebe todas as props que um button do html
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

function Button(props: ButtonProps) {
  return (
    <button className='button' {...props} />
  );
};

export default Button;
