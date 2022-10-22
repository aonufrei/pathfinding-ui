import './Pathfinding.css'
import Grid from './Grid';
import { cells } from '../../configs';
import { useState } from 'react';
import axios from 'axios';


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

    const structureToRequestData = () => {
        let usefulPoints = structure.filter(it => it.type !== "background").map(it => {
            let parts = it.id.split("_")
            const x = parts[2]
            const y = parts[1]
            return ({
                x,
                y,
                type: it.type
            })
        })
        
        let start = usefulPoints.filter(it => it.type === "start")[0]
        let finish = usefulPoints.filter(it => it.type === "finish")[0]
        let walls = usefulPoints.filter(it => it.type === "wall")
        let gridInfo = {
            left_border: 0,
            right_border: COLUMNS,
            top_border: 0,
            bottom_border: ROWS
        }

        return ({
            "start_point": {"x": parseInt(start.x), "y": parseInt(start.y)},
            "end_point": {"x": parseInt(finish.x), "y": parseInt(finish.y)},

            "map_info": {...gridInfo, "walls": walls.map(it => ({
                "x": parseInt(it.x),
                "y": parseInt(it.y)
            })),},
        })
    }

    const onFindPathClicked = () => {
        axios.post("http://localhost:8080/api/v1/find-path/grid", ({
            ...structureToRequestData()
        }))
            .then(res => {
                let route = res.data.details.route
                let ids = route.map(it => `cell_${it.y}_${it.x}`)
                let nStructure = [...structure]
                for (let id of ids) {
                    let index = nStructure.findIndex(it => it.id === id)
                    if (index >= 0) {
                        nStructure[index].color = "rgb(255, 0, 255)";
                    }
    
                }

                setStructure(nStructure)
            })
            .catch(err => console.log(err))
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
            <button onClick={_ => onFindPathClicked()}>Find Route</button>
        </div>
    </div>)
}

export default Pathfinding;