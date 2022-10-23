import { useState } from "react";
import { nanoid } from "nanoid";
import "./OptionPanelStyles.css";

const OptionPanel = ({ options, selectedOptionIndex }) => {
  const [selectedOption, setSelectedOption] = useState(
    selectedOptionIndex || 0
  );

  const onOptionClicked = (e, option, index) => {
    setSelectedOption(index);
    option.onClick(e, index);
  };

  const createOptionButton = (option, index) => {
    const classNames =
      "option" + (index === selectedOption ? " option-selected" : "");
    return (
      <button
        className={classNames}
        key={nanoid()}
        onClick={(e) => onOptionClicked(e, option, index)}
      >
        {option.text}
      </button>
    );
  };

  return (
    <div className="option-panel">
      {options.map((opt, index) => createOptionButton(opt, index))}
    </div>
  );
};

export default OptionPanel;
