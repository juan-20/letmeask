import { ReactNode } from 'react';
import './styles.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  // os botões
  children?: ReactNode;
}


export default function Question({ content, author, children, }: QuestionProps) {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>

        {/* botoes que mudam de acordo com o user */}
        <div>
          {children}
          {console.log(children)}
        </div>
      </footer>
    </div>
  );
};

