import { cells } from "../../configs";

export const upperLayerTypes = {
  none: {
    class: "",
  },
  route: {
    class: "route-cell",
  },
  processed: {
    class: "processing-cell",
  },
  areProcessing: {
    class: "processed-cell",
  },
};

export const createCellInfo = (id, type, className, upperLayer) => {
    if (id === undefined) {
      console.error("Cell requires id");
    }
    return {
      id,
      type: type || cells.bcg.name,
      class: className || "",
      upperLayer: upperLayer || upperLayerTypes.none,
    };
  };
export const constructGridStructure = (r, c) => {
    let grid_cells = [];
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        const defaultCell = createCellInfo(
          `cell_${i}_${j}`,
          cells.bcg.name,
          cells.bcg.class,
          upperLayerTypes.none
        );
        grid_cells.push(defaultCell);
      }
    }
    return grid_cells;
  };