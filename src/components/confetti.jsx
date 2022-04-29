import Confetti from 'react-confetti'

export default function ConfettiComponent(props){
    
    return (
        <div>
            <Confetti
            width={props.width}
            height={props.height}
            numberOfPieces={props.run}
            recycle={false}
            gravity={0.4}
            tweenDuration={7000}
            initialVelocityY={10}
            />
        </div>
    )
}