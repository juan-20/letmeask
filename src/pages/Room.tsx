import React, { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import RoomCode from '../components/RoomCode';
import { useAuth } from '../hooks/aseAuth';
import { database } from '../services/firebase';
// styles
import '../styles/rooms.scss';

type RoomParams = {
    id: string;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}



const Room: React.FC = () => {
    // pega o id da route para poer copiar
    const params = useParams<RoomParams>();
    // textarea
    const [newQuestion, setNewQuestion] = useState('');
    // ele é um array de questions
    const [questions, setQuestions] = useState<Question[]>([]);
    // pega o id do route
    const roomId = params.id;
    // pega o user pra ver se ta logado
    const { user } = useAuth();

    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        // firebase once vc ouve uma vez a req e o val() é para os values
        roomRef.on('value', room => {
            console.log(room.val());
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            // converte de obj pra um array e se tiver sem nada retorna null
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: !value.isAnswered,

                }
            });
            setQuestions(parsedQuestions)
            setTitle(databaseRoom.title)

            console.log(parsedQuestions);
        })
        // sempre que muda o roomid ele recarrega as info da pagina
    }, [roomId]);

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
                Jájá aqui vai ter as perguntas essas são as cadastradas no momento:
                <br />
                <br />
                {JSON.stringify(questions)}
            </main>


        </div>
    );
}

export default Room;