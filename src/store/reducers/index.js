import isDrawingReducer from './isDrawing';
import pivotReducer from './pivot';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    pivot: pivotReducer,
    isDrawing: isDrawingReducer,
})

export default allReducers