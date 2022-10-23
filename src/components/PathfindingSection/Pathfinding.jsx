import "./Pathfinding.css";
import Grid from "./Grid";
import OptionPanel from "./OptionPanel/OptionPanel";
import { cells } from "../../configs";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import {
  upperLayerTypes,
  createCellInfo,
  constructGridStructure,
} from "./utils";
import StateButton from "../Button/StateButton";

const Pathfinding = () => {
  const COLUMNS = 16;
  const ROWS = 16;

  const [structure, setStructure] = useState(
    constructGridStructure(ROWS, COLUMNS)
  );

  const [pivot, setPivot] = useState(cells.wall);
  const [shortestRoute, setShortestRoute] = useState(undefined);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(2);
  const [allowEditing, setAllowEditing] = useState(true);
  const [allowClearRoute, setAllowClearRoute] = useState(true);
  const [allowPlayAnimation, setAllowPlayAnimation] = useState(true);

  const onDraw = (e) => {
    setShortestRoute(undefined);
    let lastSpecialIndex = -1;
    if (pivot.name === cells.start.name || pivot.name === cells.finish.name) {
      structure.forEach((e, i) => {
        if (e.type === pivot.name) {
          lastSpecialIndex = i;
        }
      });
    }
    const parts = e.target.id.split("_");
    const [row, col] = [parseInt(parts[1]), parseInt(parts[2])];
    const indexToModify = row * COLUMNS + col;
    const oldValue = structure[indexToModify];
    const nStructure = [...structure];
    if (pivot.name === oldValue.type) {
      if (nStructure[indexToModify].upperLayer !== upperLayerTypes.none) {
        nStructure[indexToModify].upperLayer = upperLayerTypes.none;
        setStructure(nStructure);
      }
      return;
    }
    nStructure[indexToModify] = createCellInfo(
      oldValue.id,
      pivot.name,
      pivot.class,
      upperLayerTypes.none
    );
    if (lastSpecialIndex !== -1) {
      nStructure[lastSpecialIndex] = createCellInfo(
        nStructure[lastSpecialIndex].id,
        cells.bcg.name,
        cells.bcg.class,
        upperLayerTypes.none
      );
    }
    setStructure(nStructure);
  };

  const onPivotChanged = (cell) => {
    setShortestRoute(undefined);
    clearRoute();
    setPivot(cell);
  };

  const clearRoute = () => {
    let nStructure = [...structure];
    for (let i = 0; i < nStructure.length; i++) {
      nStructure[i].upperLayer = upperLayerTypes.none;
    }
    setStructure(nStructure);
  };

  useEffect(() => {
    if (shortestRoute === undefined) {
      clearRoute();
    }
  }, [shortestRoute]);

  const structureToRequestData = () => {
    let usefulPoints = structure
      .filter((it) => it.type !== "background")
      .map((it) => {
        let parts = it.id.split("_");
        const x = parts[2];
        const y = parts[1];
        return {
          x,
          y,
          type: it.type,
        };
      });

    const start = usefulPoints.filter((it) => it.type === "start")[0];
    const finish = usefulPoints.filter((it) => it.type === "finish")[0];
    const walls = usefulPoints.filter((it) => it.type === "wall");
    const gridInfo = {
      left_border: 0,
      right_border: ROWS,
      top_border: 0,
      bottom_border: COLUMNS,
      walls: walls.map((it) => ({
        x: parseInt(it.x),
        y: parseInt(it.y),
      })),
    };

    return {
      start_point: { x: parseInt(start.x), y: parseInt(start.y) },
      end_point: { x: parseInt(finish.x), y: parseInt(finish.y) },
      map_info: gridInfo,
    };
  };

  const onFindPathClicked = () => {
    if (shortestRoute !== undefined) {
      return;
    }
    clearRoute();
    axios
      .post("http://localhost:8080/api/v1/find-path/grid", {
        ...structureToRequestData(),
      })
      .then((res) => {
        const found = res.data.found;
        if (!found) {
          alert("Route was not found!")
          return
        }
        let route = res.data.details.route;
        route.shift();
        route.pop();
        let ids = route.map((it) => `cell_${it.y}_${it.x}`);
        let nStructure = [...structure];
        for (let id of ids) {
          let index = nStructure.findIndex((it) => it.id === id);
          if (index >= 0) {
            nStructure[index].upperLayer = upperLayerTypes.route;
          }
        }
        setShortestRoute(res.data.details);
        setStructure(nStructure);
      })
      .catch((err) => console.log(err));
  };

  const playAnimation = () => {
    if (shortestRoute === undefined) {
      return;
    }
    clearRoute();
    setAllowEditing(false);
    setAllowClearRoute(false);
    setAllowPlayAnimation(false);
    let index = 0;
    let route = [...shortestRoute.route];
    const interval = setInterval(() => {
      if (index >= shortestRoute.iterations.length && route.length <= 0) {
        setAllowEditing(true);
        setAllowPlayAnimation(true);
        setAllowClearRoute(true);
        clearInterval(interval);
        return;
      }

      if (index < shortestRoute.iterations.length) {
        const frame = shortestRoute.iterations[index++];
        let nStructure = [...structure];
        frame.areAlreadyProcessed
          .map((p) => p.y * ROWS + p.x)
          .forEach((indexToChange) => {
            if (nStructure[indexToChange].type !== cells.start.name) {
              nStructure[indexToChange].upperLayer = upperLayerTypes.processed;
            }
          });
        frame.areProcessing
          .map((p) => p.y * ROWS + p.x)
          .forEach((indexToChange) => {
            if (nStructure[indexToChange].type !== cells.start.name) {
              nStructure[indexToChange].upperLayer =
                upperLayerTypes.areProcessing;
            }
          });
        setStructure(nStructure);
      } else {
        const point = route.pop();
        let nStructure = [...structure];
        nStructure[point.y * ROWS + point.x].upperLayer = upperLayerTypes.route;
        setStructure(nStructure);
      }
    }, 10);
  };

  const onClearRoutePressed = () => {
    clearRoute();
    setShortestRoute(undefined);
  };

  const createOptionCallback = (pivot) => {
    return (_, index) => {
      onPivotChanged(pivot);
      setSelectedOptionIndex(index);
    };
  };

  const options = [
    {
      text: "Start",
      onClick: createOptionCallback(cells.start),
    },
    {
      text: "Target",
      onClick: createOptionCallback(cells.finish),
    },
    {
      text: "Wall",
      onClick: createOptionCallback(cells.wall),
    },
    {
      text: "Eraser",
      onClick: createOptionCallback(cells.bcg),
    },
  ];

  return (
    <div className="page">
      <div className="page-content">
        <p className="page-title">Draw your map and find the shortest path:</p>
        <div className="pathfinding">
          <Grid structure={structure} onCellPressed={onDraw} />
          <div className="pathfinding-toolbar">
            <OptionPanel
              enableButtons={allowEditing}
              options={options}
              selectedOptionIndex={selectedOptionIndex}
            />
            <button
              onClick={(_) => onFindPathClicked()}
              className="find-path-button"
            >
              Find Route
            </button>
          </div>
          {/* <PlaybackPanel frames={shortestRoute === undefined ? [] : shortestRoute.iterations} onRender={onFrameRender} delay={250} /> */}
        </div>
        {shortestRoute !== undefined && (
          <div>
            <StateButton
              text="Clear Route"
              enable={allowClearRoute}
              onClick={(_) => onClearRoutePressed()}
              enableClassNames="find-path-button"
              disableClassNames="disabled-find-path-button"
            />
            <StateButton
              text="Play animation"
              enable={allowPlayAnimation}
              onClick={(_) => playAnimation()}
              enableClassNames="play-btn"
              disableClassNames="disabled-play-btn"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pathfinding;
