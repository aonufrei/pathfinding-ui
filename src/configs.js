const apiURL = "http://localhost:8080";

const cells = {
  bcg: {
    name: "background",
    class: "bcg-cell",
    placable: true,
  },
  start: {
    name: "start",
    class: "start-cell",
    placable: true,
  },
  finish: {
    name: "finish",
    class: "end-cell",
    placable: true,
  },
  wall: {
    name: "wall",
    class: "wall-cell",
    placable: true,
  },
  route: {
    name: "route",
    class: "route-cell",
    placable: false,
  },
};

export { cells, apiURL };
