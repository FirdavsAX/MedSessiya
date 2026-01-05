export default function AnswerOption({ text, checked, onChange }) {
  return (
    <label
      className={`flex gap-3 items-center cursor-pointer p-2 rounded border ${
        checked ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'
      }`}
    >
      <input
        type='checkbox'
        checked={checked}
        onChange={onChange}
        className='w-4 h-4 text-blue-600'
      />
      <span className='text-sm'>{text}</span>
    </label>
  );
}
