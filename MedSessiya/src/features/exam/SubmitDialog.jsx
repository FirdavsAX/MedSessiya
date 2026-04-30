export default function SubmitDialog({ unanswered, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Imtihonni yakunlash</h3>
        {unanswered > 0 ? (
          <p className="text-sm text-gray-600 mb-6">
            <span className="font-semibold text-orange-600">{unanswered} ta savol</span> hali
            javoblanmagan. Shunga qaramay yakunlaysizmi?
          </p>
        ) : (
          <p className="text-sm text-gray-600 mb-6">
            Barcha savollar javoblangan. Imtihonni yakunlaysizmi?
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            Davom etish
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-all"
          >
            Yakunlash
          </button>
        </div>
      </div>
    </div>
  );
}
