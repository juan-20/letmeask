import React, { FormEvent, useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import { AuthContext } from '../contexts/AuthContext';
import { database } from '../services/firebase';
import '../styles/auth.scss';


const NewRoom: React.FC = () => {
    const history = useHistory();
    const { user } = useContext(AuthContext);

    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        console.log(newRoom);

        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao -vivo</strong>
                <p>Tire as duvidas de sua audiencia em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Latmeask" />
                    <h1>Oi, {user?.name} !</h1>
                    <h2>Criar uma nova sala</h2>

                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />

                        <Button type="submit">Criar sala</Button>
                    </form>

                    <p>Quer entrar em uma sala existente
                        <Link to="/"> Clique aqui</Link>
                    </p>

                </div>
            </main>
        </div>
    );
}

export default NewRoom;