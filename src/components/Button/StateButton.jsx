const StateButton = ({
  enable,
  enableClassNames,
  disableClassNames,
  text,
  onClick,
}) => {

  const noClickCallback = () => {};
  return (
    <button
      className={(enable ? enableClassNames : disableClassNames) || ""}
      onClick={enable ? onClick || noClickCallback : noClickCallback}
    >
      {text}
    </button>
  );
};

export default StateButton;
