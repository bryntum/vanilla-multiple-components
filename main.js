import { TaskBoard } from "@bryntum/taskboard-thin";
import { Grid } from "@bryntum/grid-thin";
import { Button } from "@bryntum/core-thin";
import "./style.scss";

const priority = ["low", "medium", "high"];

const teamColor = {
  DevOps: "#ff6b6b",
  Developer: "#54a0ff",
  QA: "#1dd1a1",
  UX: "#ff9ff3",
};

const getResources = async () => {
  const res = await fetch("/data.json");
  const data = await res.json();

  return data.resources.rows;
};

const getAvatars = (value) => {
  return {
    tag: "img",
    class: "avatar",
    src: `/users/${value.toLowerCase()}.jpg`,
  };
};

const grid = new Grid({
  appendTo: "app",
  autoHeight: true,

  tbar: ["Bryntum AB", "->", "Employee Record"],

  columns: [
    {
      field: "name",
      text: "Name",
      icon: "b-fa b-fa-user",
      flex: 1,
      renderer({ value }) {
        return {
          class: "name-container",
          children: [getAvatars(value), { html: value }],
        };
      },
    },
    {
      field: "team",
      text: "Team",
      icon: "b-fa b-fa-people-group",
      flex: 1,
      renderer({ value }) {
        return {
          class: "badge", // the style should be defined in .css file
          style: {
            backgroundColor: teamColor[value],
          },
          text: value,
        };
      },
    },
    {
      field: "employed",
      text: "Employed Since",
      icon: "b-fa b-fa-calendar",
      flex: 1,
    },
  ],
});

grid.data = await getResources();

const taskBoard = new TaskBoard({
  appendTo: "app",

  features: {
    taskMenu: false,
    columnDrag: true,
    simpleTaskEdit: true,
  },

  tbar: ["Bryntum AB", "->", "Employee Task List"],

  newTaskDefaults: {
    name: "Add title",
    description: "Add description",
    team: "Pick team",
  },

  // Columns to display
  columns: [
    { id: "todo", text: "Todo", color: "blue" },
    { id: "doing", text: "Doing", color: "light-green" },
    { id: "review", text: "Review", color: "green" },
    { id: "done", text: "Done", color: "gray" },
  ],

  project: {
    loadUrl: "data.json",

    autoLoad: true,
  },

  // Task item header
  headerItems: {
    text: {
      field: "name",
      // Configure inline editor for name field to make task name a mandatory field
      editor: {
        type: "text",
        required: true,
      },
    },
    resources: { type: "resourceAvatars" },
  },

  footerItems: {
    resourceAvatars: null,
    prio: {
      type: "template",
      template: ({ taskRecord }) =>
        `<div class='prio ${taskRecord.prio}-prio'>${taskRecord.prio}</div>`,
      editor: { type: "combo", items: priority },
    },
    tags: { type: "tags" },
  },

  // Url for resource avatar images
  resourceImagePath: "users/",

  // Field used to pair a task to a column
  columnField: "status",
});

new Button({
  appendTo: "buttons",
  icon: "b-fa-list",
  text: "Toggle Grid View",
  cls: "b-raised",
  color: "b-blue",
  style: "margin: 10px",
  onClick: () => {
    grid.hidden = grid.isVisible;
  },
});

new Button({
  appendTo: "buttons",
  icon: "b-fa-bars-progress",
  text: "Toggle Task View",
  cls: "b-raised",
  color: "b-blue",
  style: "margin: 10px",
  onClick: () => {
    taskBoard.hidden = taskBoard.isVisible;
  },
});
