export default function Timer({ seconds }) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return (
    <div className='text-lg font-semibold'>
      Time: {min}:{sec < 10 ? `0${sec}` : sec}
    </div>
  );
}
