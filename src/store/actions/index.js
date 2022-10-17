const changeDrawingState = (value) => ({
    type: 'CHANGE_DRAWING_STATE',
    value,
});

const changePivot = (value) => ({
    type: 'CHANGE_PIVOT',
    value,
})

export { changeDrawingState, changePivot };