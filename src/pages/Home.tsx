import React from 'react';
import { useHistory } from 'react-router-dom';
import googleIconImg from '../assets/images/google-icon.svg';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import { useAuth } from '../hooks/aseAuth';
import '../styles/auth.scss';

const Home: React.FC = () => {

    const history = useHistory();
    // contexto
    const { user, signInWithGoogle } = useAuth();

    async function handleCreateRoom() {
        if (!user) {
            signInWithGoogle();
        }
        history.push('/rooms/new');

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

                    <form action="">
                        <input
                            type="text"
                            placeholder="Digite o codigo da sala"
                        />

                        <Button type="submit">Entrar na sala</Button>
                    </form>

                </div>
            </main>
        </div>
    );
}

export default Home;