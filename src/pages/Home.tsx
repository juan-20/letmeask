import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import googleIconImg from '../assets/images/google-icon.svg';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import { useAuth } from '../hooks/aseAuth';
import { database } from '../services/firebase';
import '../styles/auth.scss';

const Home: React.FC = () => {

    const history = useHistory();
    // contexto
    const { user, signInWithGoogle } = useAuth();

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }
        history.push('/rooms/new');

    }

    const [roomCode, setRoomCode] = useState('');

    // entrar na sala
    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            alert('Room does not exist.')
        }

        history.push(`rooms/${roomCode}`)

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

                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do google" />
                        Crie sua conta com o google
                    </button>
                    <div className="separator">
                        ou entre em uma sala
                    </div>

                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o codigo da sala"
                            onChange={event => { setRoomCode(event.target.value) }}
                            value={roomCode}
                        />

                        <Button type="submit">Entrar na sala</Button>
                    </form>

                </div>
            </main>
        </div>
    );
}

export default Home;