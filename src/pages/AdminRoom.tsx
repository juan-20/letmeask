import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
// img
import ansewerImg from '../assets/images/answer.svg';
import checkImg from '../assets/images/check.svg';
import deleteImg from '../assets/images/delete.svg';
import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import Question from '../components/Question';
import RoomCode from '../components/RoomCode';
// hook
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
// styles
import '../styles/rooms.scss';


type RoomParams = {
    id: string;
}

const AdminRoom: React.FC = () => {
    // pega o id da route para poer copiar
    const params = useParams<RoomParams>();
    // textarea
    // const [newQuestion, setNewQuestion] = useState('');
    // pega o id do route
    const roomId = params.id;
    // pega o user pra ver se ta logado
    // const { user } = useAuth();
    // hook que retorna as info
    const { title, questions } = useRoom(roomId);

    // o form event vc precisa colocar sempre que colocar em um form

    const history = useHistory();
    async function handleEndRoom() {
        // update altera os dados da sala para acabar a sala
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Quer excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {

        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }
    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }


    return (
        <div id="page-room" className="">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Logo" />
                    <div className="">
                        <RoomCode code={params.id}></RoomCode>
                        {/* não precisa passar true */}
                        <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {/* se ele tiver perguntas então  */}
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>


                {/* :perguntas: */}

                <div className="question-list">
                    {/* percorre o array dentro do component (sempre precisa da key) */}
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}

                            >
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Deletar pergunta" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                >
                                    <img src={checkImg} alt="Marrcar pergunta como respondida" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleHighlightQuestion(question.id)}
                                >
                                    <img src={ansewerImg} alt="Dar destaque a pergunta" />
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

export default AdminRoom;
