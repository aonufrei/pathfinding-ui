import './Pathfinding.css'
import Grid from './Grid';
import { cells } from '../../configs';
import { useState } from 'react';


const Pathfinding = () => {

    const ROWS = 16;
    const COLUMNS = 16;

    const constructGridStructure = (r, c) => {
        let grid_cells = []
        for (let i = 0; i < r; i++) {
            for (let j = 0; j < c; j++) {
                grid_cells.push({
                    id: `cell_${i}_${j}`,
                    type: cells.bcg.name,
                    color: cells.bcg.color,
                })
            }
        }
        return grid_cells;
    }

    const [structure, setStructure] = useState(constructGridStructure(ROWS, COLUMNS));
    const [pivot, setPivot] = useState(cells.wall);

    const onDraw = (e) => {
        let lastSpecialIndex = -1;
        if (pivot.name === cells.start.name || pivot.name === cells.finish.name) {
            structure.forEach((e, i) => {
                if (e.type === pivot.name) {
                    lastSpecialIndex = i;
                }
            });
        }
        const parts = e.target.id.split('_');
        const [row, col] = [parseInt(parts[1]), parseInt(parts[2])]
        const indexToModify = row * ROWS + col;
        const oldValue = structure[indexToModify]
        if (pivot.name === oldValue.type) {
            return;
        }
        const nStructure = [...structure]
        nStructure[indexToModify] = ({
            id: oldValue.id,
            type: pivot.name,
            color: pivot.color,
        });
        if (lastSpecialIndex !== -1) {
            nStructure[lastSpecialIndex] = ({
                id: nStructure[lastSpecialIndex].id,
                type: cells.bcg.name,
                color: cells.bcg.color,
            })
        }
        setStructure(nStructure)
    }

    const onPivotChanged = (cell) => {
        setPivot(cell)
    }

    return (<div className="page">
        <div className="page-content">
            <p className='page-title'>Draw your map and find the shortest path:</p>
            <div className='grid-container-2'>
                <Grid structure={structure} onCellPressed={onDraw}/>
            </div>
            <div>
                <button onClick={_ => onPivotChanged(cells.start)}>Start</button>
                <button onClick={_ => onPivotChanged(cells.finish)}>Finish</button>
                <button onClick={_ => onPivotChanged(cells.wall)}>Wall</button>
                <button onClick={_ => onPivotChanged(cells.bcg)}>Clean</button>
            </div>
            <button onClick={_ => console.log("Find the solution clicked")}>Find Route</button>
        </div>
    </div>)
}

export default Pathfinding;