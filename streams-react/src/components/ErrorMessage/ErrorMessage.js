const ErrorMessage = ({error}) => {
  if(!error || !error.message) return null;

  return(
    <div>
      <p>An error has occured: {error.message}</p>
    </div>
  );
};

export default ErrorMessage;