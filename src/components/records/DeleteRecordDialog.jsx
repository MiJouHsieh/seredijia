export function DeleteRecordDialog({
  title,
  onCancel,
  onConfirm,
  isDeleting,
  deleteError,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40"
    >
      <div className="w-full max-w-md p-6 rounded-3xl bg-cream text-dark">
        <h2
          id="delete-dialog-title"
          className="mb-3 text-lg font-bold"
        >
          確定要刪除這天的紀錄嗎？
        </h2>
        <p className="mb-6 text-sm">
          {title}{" "}
          的心情、用藥、飲食及事件紀錄都會被刪除，且無法復原。
        </p>

        {deleteError && (
          <p role="alert" className="text-red-700">
            {deleteError}
          </p>
        )}

        <div className="flex justify-end gap-6">
          <button
            type="button"
            className="px-4 py-2 border rounded-full border-dark hover:cursor-pointer"
            onClick={onCancel}
            disabled={isDeleting}
          >
            取消
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-700 rounded-full text-cream hover:cursor-pointer dark:bg-red-400"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "刪除中…" : "確認刪除"}
          </button>
        </div>
      </div>
    </div>
  );
}