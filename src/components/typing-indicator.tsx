const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 px-4 py-3">
      <div className="text-sm text-muted-foreground">Mr.Doctor is thinking</div>
      <div className="typing-dots">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;