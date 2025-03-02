export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      <h2 className="mt-4 text-xl font-semibold">Loading Challenge...</h2>
      <p className="mt-2 text-gray-500">
        Please wait while we prepare your challenge
      </p>
    </div>
  );
}
