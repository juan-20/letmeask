import React, { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import Question from '../components/Question';
import RoomCode from '../components/RoomCode';
import { useAuth } from '../hooks/aseAuth';
// hook
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
// styles
import '../styles/rooms.scss';

type RoomParams = {
    id: string;
}

const Room: React.FC = () => {
    // pega o id da route para poer copiar
    const params = useParams<RoomParams>();
    // textarea
    const [newQuestion, setNewQuestion] = useState('');
    // pega o id do route
    const roomId = params.id;
    // pega o user pra ver se ta logado
    const { user } = useAuth();
    // hook que retorna as info
    const { title, questions } = useRoom(roomId);

    // o form event vc precisa colocar sempre que colocar em um form
    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();
        console.log(newQuestion);

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            throw new Error('You must be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user?.name,
                avatar: user?.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        };

        // manda a pergunta
        await database.ref(`rooms/${roomId}/questions`).push(question);

        // apaga depois de mandar a pergunta 
        setNewQuestion('');
    }

    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
        // ver se a pessoa já curtiu
        if (likeId) {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
        } else {

            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id,
            });
        }



    }
    return (
        <div id="page-room" className="">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Logo" />
                    <div className="">
                        <RoomCode code={params.id}></RoomCode>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {/* se ele tiver perguntas então  */}
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion} action="">
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    >

                    </textarea>

                    <div className="form-footer">
                        {/* se user n estiver logado ele mostra a forto e nome e se n tiver pede pra logar*/}
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button> faça seu login </button></span>
                        )}
                        <Button type="submit" disabled={!user}> Enviar Pergunta</Button>
                    </div>
                </form>

                {/* :perguntas: */}

                <div className="question-list">
                    {/* percorre o array dentro do component (sempre precisa da key) */}
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                                    type="button"
                                    aria-label="Marcar como gostei"
                                    // quando a funçãom precisa passar algo você precisa deixar ela assim com a () =>
                                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                                >
                                    {question.likeCount > 0 && <span>{question.likeCount}</span>}

                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>


                                </button>
                            </Question>
                        );
                    })}

                </div>
                {/* {JSON.stringify(questions)} */}
            </main>


        </div>
    );
}

export default Room;
