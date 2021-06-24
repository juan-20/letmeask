import CopyImg from '../../assets/images/copy.svg';
import './styles.scss';

type RoomCodeProps = {
  code: string;
}

function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code)
  }
  return (
    <button className='room-code' onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={CopyImg} alt="Copiar sala" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
};

export default RoomCode;
