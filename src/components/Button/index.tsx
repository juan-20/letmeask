import { ButtonHTMLAttributes } from 'react';
import './styles.scss';


// ele recebe todas as props que um button do html
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // o ? deixa opcional
  isOutlined?: boolean;
}

// ele começa como false como padrão
function Button({ isOutlined = false, ...props }: ButtonProps) {
  return (
    <button
      className={`button ${isOutlined ? 'outlined' : ''}`}
      {...props} />
  );
};

export default Button;
