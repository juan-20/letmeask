import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./aseAuth";

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>;
}>


export function useRoom(roomId: string) {
    const { user } = useAuth()
    // ele é um array de questions
    const [questions, setQuestions] = useState<QuestionType[]>([]);

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
                    likeCount: Object.values(value.likes ?? {}).length,
                    // some percorre o array ate achar oq vc ta pedindo e retiurna true ou false
                    // hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id)

                    likeId: Object.entries(value.likes ?? {}).find(
                        ([key, like]) => like.authorId === user?.id
                    )?.[0]
                }
            });
            setQuestions(parsedQuestions)
            setTitle(databaseRoom.title)

            console.log(parsedQuestions);
        })
        // sempre que muda o roomid ele recarrega as info da pagina

        return () => {
            roomRef.off('value');
        }
    }, [roomId, user?.id]);

    return { questions, title }
}
