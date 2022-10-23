import { nanoid } from "nanoid";
import { useSelector } from "react-redux";

const Grid = ({ structure, onCellPressed }) => {
  const isDrawing = useSelector((store) => store.isDrawing);

  const getCellFromStructure = (cellInfo) => {
    return (
      <div
        className={`cell ${cellInfo.class} ${cellInfo.upperLayer.class}` }
        onMouseDown={onCellPressed}
        onMouseMove={(e) => {
          isDrawing && onCellPressed(e);
        }}
        key={nanoid()}
        id={cellInfo.id}
      ></div>
    );
  };

  return (
    <div className="grid-container">
      <div className="grid">
        {structure.map(getCellFromStructure)}
      </div>
    </div>
  );
};

export default Grid;
