function ErrorMessage({ message }) {
  return (
    <p className="text-center text-red-600 py-6">
      {message}
    </p>
  );
}

export default ErrorMessage;