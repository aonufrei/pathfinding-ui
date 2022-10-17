import { nanoid } from 'nanoid';
import { useSelector } from 'react-redux';

const Grid = ({structure, onCellPressed }) => {

    const isDrawing = useSelector(store => store.isDrawing);

    const getCellFromStructure = (cellInfo) => {
        return <div className='cell'
            onMouseDown={onCellPressed}
            onMouseMove={(e) => {isDrawing && onCellPressed(e)}}
            key={nanoid()}
            id={cellInfo.id}
            style={{
                backgroundColor: cellInfo.color
            }}></div>
    }
    
    return (
        <div className='grid-container'>
            <div className='grid'>
                {
                    structure.map(it => getCellFromStructure(it))
                }
            </div>
        </div>
    )

}

export default Grid;