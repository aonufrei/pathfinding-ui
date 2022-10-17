import { cells } from '../../configs';

const pivotReducer = (pivot=cells.wall, action) => {
    if (action === 'CHANGE_PIVOT') return action.value;
    return pivot;
}

export default pivotReducer;