export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {"success" in message && (
        <div className="text-green-800 bg-green-100 border-l-4 border-green-500 px-4 py-2 rounded">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="text-red-800 bg-red-100 border-l-4 border-red-500 px-4 py-2 rounded">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-blue-900 bg-blue-100 border-l-4 border-blue-400 px-4 py-2 rounded">{message.message}</div>
      )}
    </div>
  );
}
