import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/auth.scss';


const NewRoom: React.FC = () => {
    const history = useHistory();
    const { user } = useContext(AuthContext);

    function submit() {
        let span = document.getElementById("span")?.style.display
        span = 'inline';
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

                    <form action="">
                        <input
                            type="text"
                            placeholder="Nome da sala"
                        />

                        <Button onClick={submit}>Criar sala</Button>
                        <span id="span">Funcionalidade ainda não feita</span>
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