const isDrawingReducer = (isDrawing=false, action) => {
    if (action.type === 'CHANGE_DRAWING_STATE') return action.value;
    return isDrawing;
}

export default isDrawingReducer;