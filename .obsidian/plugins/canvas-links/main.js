/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CanvasLinksPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var FILE_VIEW = "file-view";
var CANVAS_VIEW = "canvas-view";
var ALL_VIEW = "all-view";
var CanvasLinksPlugin = class extends import_obsidian.Plugin {
  onload() {
    this.registerView(FILE_VIEW, (leaf) => new FileView(leaf));
    this.registerView(CANVAS_VIEW, (leaf) => new CanvasView(leaf));
    this.addCommand({
      id: FILE_VIEW,
      name: 'Show "outgoing links" of canvas (which files the active canvas contains)',
      callback: () => {
        this.onloadFileView();
      }
    });
    this.addCommand({
      id: CANVAS_VIEW,
      name: 'Show "backlinks" of canvas (which canvases the active file embedded)',
      callback: () => {
        this.onloadCanvasView();
      }
    });
    this.addCommand({
      id: ALL_VIEW,
      name: 'Show "outgoing links" and "backlinks" of canvas',
      callback: () => {
        this.onloadFileView();
        this.onloadCanvasView();
      }
    });
  }
  async onloadFileView() {
    if (this.app.workspace.getLeavesOfType(FILE_VIEW).length == 0) {
      await this.app.workspace.getRightLeaf(false).setViewState({
        type: FILE_VIEW,
        active: true
      });
    }
  }
  async onloadCanvasView() {
    if (this.app.workspace.getLeavesOfType(CANVAS_VIEW).length == 0) {
      await this.app.workspace.getRightLeaf(false).setViewState({
        type: CANVAS_VIEW,
        active: true
      });
    }
  }
  onunload() {
  }
};
var FileView = class extends import_obsidian.ItemView {
  constructor(leaf) {
    super(leaf);
  }
  getViewType() {
    return FILE_VIEW;
  }
  getDisplayText() {
    return "Files View";
  }
  async onOpen() {
    this.icon = "chevron-right-square";
    this.getFiles().then((notes) => {
      renderView(notes, "Files the canvas contain", this.containerEl);
    });
    this.registerEvent(this.app.workspace.on("file-open", () => {
      this.getFiles().then((notes) => {
        renderView(notes, "Files the canvas contain", this.containerEl);
      });
    }));
  }
  async getFiles() {
    const activeCanvas = this.app.workspace.getActiveFile();
    if (activeCanvas == null || "canvas" != activeCanvas.extension) {
      return [];
    }
    let canvasContent = "";
    await this.app.vault.cachedRead(activeCanvas).then((content) => {
      canvasContent = content;
    });
    const nodes = JSON.parse(canvasContent).nodes;
    if (nodes == null) {
      return [];
    }
    const filePaths = [];
    for (const node of nodes) {
      if ("file" == node.type) {
        filePaths.push(node.file);
      }
    }
    const files = [];
    for (const filePath of filePaths) {
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (file != null) {
        files.push(file);
      }
    }
    return files;
  }
  async onClose() {
  }
};
var CanvasView = class extends import_obsidian.ItemView {
  constructor(leaf) {
    super(leaf);
  }
  getViewType() {
    return CANVAS_VIEW;
  }
  getDisplayText() {
    return "Canvas View";
  }
  async onOpen() {
    this.icon = "chevron-left-square";
    this.getCanvas().then((canvas) => {
      renderView(canvas, "Canvas the file embedded", this.containerEl);
    });
    this.registerEvent(this.app.workspace.on("file-open", () => {
      this.getCanvas().then((canvas) => {
        renderView(canvas, "Canvas the file embedded", this.containerEl);
      });
    }));
  }
  async getCanvas() {
    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile == null) {
      return [];
    }
    const canvas = [];
    const all = this.app.vault.getFiles();
    for (const file of all) {
      if ("canvas" == file.extension) {
        canvas.push(file);
      }
    }
    const canvasContent = /* @__PURE__ */ new Map();
    for (const file of canvas) {
      await this.app.vault.cachedRead(file).then((content) => {
        canvasContent.set(file, content);
      });
    }
    const canvasEmebeded = [];
    for (const [file, content] of canvasContent) {
      const nodes = JSON.parse(content).nodes;
      if (nodes == null) {
        continue;
      }
      for (const node of nodes) {
        if ("file" == node.type && activeFile.path == node.file) {
          canvasEmebeded.push(file);
        }
      }
    }
    return canvasEmebeded;
  }
  async onClose() {
  }
};
function renderView(files, text, container) {
  container.empty();
  const pane = container.createDiv({
    cls: "outgoing-link-pane node-insert-event",
    attr: { "style": "position: relative;" }
  });
  const header = pane.createDiv({
    cls: "tree-item-self is-clickable",
    attr: {
      "aria-label": "Click to collapse",
      "aria-label-position": "right"
    }
  });
  header.createSpan({ cls: "tree-item-icon collapse-icon" });
  header.createDiv({
    cls: "tree-item-inner",
    text
  });
  header.createDiv({ cls: "tree-item-flair-outer" }, (el) => {
    el.createSpan({
      cls: "tree-item-flair",
      text: files.length.toString()
    });
  });
  const content = pane.createDiv({ cls: "search-result-container" });
  content.createDiv({
    attr: {
      "style": "width: 1px; height: 0.1px; margin-bottom: 0px;"
    }
  });
  for (const file of files) {
    content.createDiv({
      cls: "tree-item-self is-clickable outgoing-link-item",
      attr: { "draggable": true }
    }, (el) => {
      el.createSpan({ cls: "tree-item-icon" }, (el2) => {
        (0, import_obsidian.setIcon)(el2, "link");
      });
      el.createDiv({
        cls: "tree-item-inner",
        text: file.name.substring(0, file.name.lastIndexOf("."))
      }).addEventListener("click", () => {
        this.app.workspace.openLinkText("", file.path);
      });
    });
  }
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgSXRlbVZpZXcsIFBsdWdpbiwgVEFic3RyYWN0RmlsZSwgVEZpbGUsIFdvcmtzcGFjZUxlYWYsIHNldEljb24gfSBmcm9tICdvYnNpZGlhbic7XG5cbmNvbnN0IEZJTEVfVklFVzogc3RyaW5nID0gXCJmaWxlLXZpZXdcIlxuY29uc3QgQ0FOVkFTX1ZJRVc6IHN0cmluZyA9IFwiY2FudmFzLXZpZXdcIlxuY29uc3QgQUxMX1ZJRVc6IHN0cmluZyA9IFwiYWxsLXZpZXdcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNMaW5rc1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG5cbiAgICBvbmxvYWQoKTogdm9pZCB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsb2FkIHBsdWdpbicpIC8vIGVuYWJsZSBwbHVnaW5cblxuICAgICAgICB0aGlzLnJlZ2lzdGVyVmlldyhGSUxFX1ZJRVcsIChsZWFmKSA9PiBuZXcgRmlsZVZpZXcobGVhZikpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyVmlldyhDQU5WQVNfVklFVywgKGxlYWYpID0+IG5ldyBDYW52YXNWaWV3KGxlYWYpKTtcblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IEZJTEVfVklFVyxcbiAgICAgICAgICAgIG5hbWU6ICdTaG93IFwib3V0Z29pbmcgbGlua3NcIiBvZiBjYW52YXMgKHdoaWNoIGZpbGVzIHRoZSBhY3RpdmUgY2FudmFzIGNvbnRhaW5zKScsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25sb2FkRmlsZVZpZXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBDQU5WQVNfVklFVyxcbiAgICAgICAgICAgIG5hbWU6ICdTaG93IFwiYmFja2xpbmtzXCIgb2YgY2FudmFzICh3aGljaCBjYW52YXNlcyB0aGUgYWN0aXZlIGZpbGUgZW1iZWRkZWQpJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbmxvYWRDYW52YXNWaWV3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogQUxMX1ZJRVcsXG4gICAgICAgICAgICBuYW1lOiAnU2hvdyBcIm91dGdvaW5nIGxpbmtzXCIgYW5kIFwiYmFja2xpbmtzXCIgb2YgY2FudmFzJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbmxvYWRGaWxlVmlldygpO1xuICAgICAgICAgICAgICAgIHRoaXMub25sb2FkQ2FudmFzVmlldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBvbmxvYWRGaWxlVmlldygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoRklMRV9WSUVXKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldFJpZ2h0TGVhZihmYWxzZSkuc2V0Vmlld1N0YXRlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBGSUxFX1ZJRVcsXG4gICAgICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgfSk7IC8vIHZpZXcjb25PcGVuKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIG9ubG9hZENhbnZhc1ZpZXcoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICh0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKENBTlZBU19WSUVXKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldFJpZ2h0TGVhZihmYWxzZSkuc2V0Vmlld1N0YXRlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBDQU5WQVNfVklFVyxcbiAgICAgICAgICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgICAgICB9KTsgLy8gdmlldyNvbk9wZW4oKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb251bmxvYWQoKTogdm9pZCB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd1bmxvYWQgcGx1Z2luJyk7IC8vIGRpc2FibGUgcGx1Z2luXG4gICAgfVxufVxuXG5jbGFzcyBGaWxlVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcblxuICAgIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYpIHtcbiAgICAgICAgc3VwZXIobGVhZik7XG4gICAgfVxuXG4gICAgZ2V0Vmlld1R5cGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIEZJTEVfVklFVztcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJGaWxlcyBWaWV3XCI7XG4gICAgfVxuXG4gICAgYXN5bmMgb25PcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLmljb24gPSAnY2hldnJvbi1yaWdodC1zcXVhcmUnXG5cbiAgICAgICAgdGhpcy5nZXRGaWxlcygpLnRoZW4oKG5vdGVzKSA9PiB7XG4gICAgICAgICAgICByZW5kZXJWaWV3KG5vdGVzLCAnRmlsZXMgdGhlIGNhbnZhcyBjb250YWluJywgdGhpcy5jb250YWluZXJFbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ2ZpbGUtb3BlbicsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2V0RmlsZXMoKS50aGVuKChub3RlcykgPT4ge1xuICAgICAgICAgICAgICAgIHJlbmRlclZpZXcobm90ZXMsICdGaWxlcyB0aGUgY2FudmFzIGNvbnRhaW4nLCB0aGlzLmNvbnRhaW5lckVsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0RmlsZXMoKTogUHJvbWlzZTxUQWJzdHJhY3RGaWxlW10+IHtcbiAgICAgICAgY29uc3QgYWN0aXZlQ2FudmFzOiBURmlsZSB8IG51bGwgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICBpZiAoYWN0aXZlQ2FudmFzID09IG51bGwgfHwgJ2NhbnZhcycgIT0gYWN0aXZlQ2FudmFzLmV4dGVuc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNhbnZhc0NvbnRlbnQgPSAnJztcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY2FjaGVkUmVhZChhY3RpdmVDYW52YXMpLnRoZW4oKGNvbnRlbnQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY2FudmFzQ29udGVudCA9IGNvbnRlbnQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IG5vZGVzOiBub2RlW10gPSBKU09OLnBhcnNlKGNhbnZhc0NvbnRlbnQpLm5vZGVzO1xuICAgICAgICBpZiAobm9kZXMgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoJ2ZpbGUnID09IG5vZGUudHlwZSkge1xuICAgICAgICAgICAgICAgIGZpbGVQYXRocy5wdXNoKG5vZGUuZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb25zdCBmaWxlczogVEZpbGVbXSA9IFtdO1xuICAgICAgICAvLyBjb25zdCBhbGw6IFRGaWxlW10gPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlcygpO1xuICAgICAgICAvLyBmb3IgKGNvbnN0IGZpbGUgb2YgYWxsKSB7XG4gICAgICAgIC8vICAgICBpZiAoZmlsZVBhdGhzLmNvbnRhaW5zKGZpbGUucGF0aCkpIHtcbiAgICAgICAgLy8gICAgICAgICBmaWxlcy5wdXNoKGZpbGUpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIGNvbnN0IGZpbGVzOiBUQWJzdHJhY3RGaWxlW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBmaWxlUGF0aHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZVBhdGgpO1xuICAgICAgICAgICAgaWYgKGZpbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgb25DbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2Nsb3NlIHZpZXcnKTtcbiAgICB9XG59XG5cbmNsYXNzIENhbnZhc1ZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmKSB7XG4gICAgICAgIHN1cGVyKGxlYWYpO1xuICAgIH1cblxuICAgIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBDQU5WQVNfVklFVztcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJDYW52YXMgVmlld1wiO1xuICAgIH1cblxuICAgIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ29wZW4gdmlldycpO1xuXG4gICAgICAgIHRoaXMuaWNvbiA9ICdjaGV2cm9uLWxlZnQtc3F1YXJlJ1xuXG4gICAgICAgIHRoaXMuZ2V0Q2FudmFzKCkudGhlbigoY2FudmFzKSA9PiB7XG4gICAgICAgICAgICByZW5kZXJWaWV3KGNhbnZhcywgJ0NhbnZhcyB0aGUgZmlsZSBlbWJlZGRlZCcsIHRoaXMuY29udGFpbmVyRWwpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKCdmaWxlLW9wZW4nLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdldENhbnZhcygpLnRoZW4oKGNhbnZhcykgPT4ge1xuICAgICAgICAgICAgICAgIHJlbmRlclZpZXcoY2FudmFzLCAnQ2FudmFzIHRoZSBmaWxlIGVtYmVkZGVkJywgdGhpcy5jb250YWluZXJFbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldENhbnZhcygpOiBQcm9taXNlPFRGaWxlW10+IHtcbiAgICAgICAgY29uc3QgYWN0aXZlRmlsZTogVEZpbGUgfCBudWxsID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgICAgaWYgKGFjdGl2ZUZpbGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2FudmFzOiBURmlsZVtdID0gW107XG4gICAgICAgIGNvbnN0IGFsbDogVEZpbGVbXSA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVzKCk7XG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBhbGwpIHtcbiAgICAgICAgICAgIGlmICgnY2FudmFzJyA9PSBmaWxlLmV4dGVuc2lvbikge1xuICAgICAgICAgICAgICAgIGNhbnZhcy5wdXNoKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2FudmFzQ29udGVudDogTWFwPFRGaWxlLCBzdHJpbmc+ID0gbmV3IE1hcDxURmlsZSwgc3RyaW5nPigpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgY2FudmFzKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jYWNoZWRSZWFkKGZpbGUpLnRoZW4oKGNvbnRlbnQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGNhbnZhc0NvbnRlbnQuc2V0KGZpbGUsIGNvbnRlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjYW52YXNFbWViZWRlZDogVEZpbGVbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IFtmaWxlLCBjb250ZW50XSBvZiBjYW52YXNDb250ZW50KSB7XG4gICAgICAgICAgICBjb25zdCBub2Rlczogbm9kZVtdID0gSlNPTi5wYXJzZShjb250ZW50KS5ub2RlcztcbiAgICAgICAgICAgIGlmIChub2RlcyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoJ2ZpbGUnID09IG5vZGUudHlwZSAmJiBhY3RpdmVGaWxlLnBhdGggPT0gbm9kZS5maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZhc0VtZWJlZGVkLnB1c2goZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNhbnZhc0VtZWJlZGVkO1xuICAgIH1cblxuICAgIGFzeW5jIG9uQ2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjbG9zZSB2aWV3Jyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJWaWV3KGZpbGVzOiBUQWJzdHJhY3RGaWxlW10sIHRleHQ6IHN0cmluZywgY29udGFpbmVyOiBFbGVtZW50KTogdm9pZCB7XG4gICAgY29udGFpbmVyLmVtcHR5KCk7XG5cbiAgICBjb25zdCBwYW5lOiBIVE1MRGl2RWxlbWVudCA9IGNvbnRhaW5lci5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6ICdvdXRnb2luZy1saW5rLXBhbmUgbm9kZS1pbnNlcnQtZXZlbnQnLFxuICAgICAgICBhdHRyOiB7ICdzdHlsZSc6ICdwb3NpdGlvbjogcmVsYXRpdmU7JyB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgaGVhZGVyOiBIVE1MRGl2RWxlbWVudCA9IHBhbmUuY3JlYXRlRGl2KHtcbiAgICAgICAgY2xzOiAndHJlZS1pdGVtLXNlbGYgaXMtY2xpY2thYmxlJyxcbiAgICAgICAgYXR0cjoge1xuICAgICAgICAgICAgJ2FyaWEtbGFiZWwnOiAnQ2xpY2sgdG8gY29sbGFwc2UnLFxuICAgICAgICAgICAgJ2FyaWEtbGFiZWwtcG9zaXRpb24nOiAncmlnaHQnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBoZWFkZXIuY3JlYXRlU3Bhbih7IGNsczogJ3RyZWUtaXRlbS1pY29uIGNvbGxhcHNlLWljb24nIH0pO1xuICAgIGhlYWRlci5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6ICd0cmVlLWl0ZW0taW5uZXInLFxuICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgfSk7XG4gICAgaGVhZGVyLmNyZWF0ZURpdih7IGNsczogJ3RyZWUtaXRlbS1mbGFpci1vdXRlcicgfSwgKGVsKSA9PiB7XG4gICAgICAgIGVsLmNyZWF0ZVNwYW4oe1xuICAgICAgICAgICAgY2xzOiAndHJlZS1pdGVtLWZsYWlyJyxcbiAgICAgICAgICAgIHRleHQ6IGZpbGVzLmxlbmd0aC50b1N0cmluZygpXG4gICAgICAgIH0pXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb250ZW50OiBIVE1MRGl2RWxlbWVudCA9IHBhbmUuY3JlYXRlRGl2KHsgY2xzOiAnc2VhcmNoLXJlc3VsdC1jb250YWluZXInIH0pO1xuICAgIGNvbnRlbnQuY3JlYXRlRGl2KHtcbiAgICAgICAgYXR0cjoge1xuICAgICAgICAgICAgJ3N0eWxlJzogJ3dpZHRoOiAxcHg7IGhlaWdodDogMC4xcHg7IG1hcmdpbi1ib3R0b206IDBweDsnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgY29udGVudC5jcmVhdGVEaXYoe1xuICAgICAgICAgICAgY2xzOiAndHJlZS1pdGVtLXNlbGYgaXMtY2xpY2thYmxlIG91dGdvaW5nLWxpbmstaXRlbScsXG4gICAgICAgICAgICBhdHRyOiB7ICdkcmFnZ2FibGUnOiB0cnVlIH1cbiAgICAgICAgfSwgKGVsKSA9PiB7XG4gICAgICAgICAgICBlbC5jcmVhdGVTcGFuKHsgY2xzOiAndHJlZS1pdGVtLWljb24nIH0sIChlbCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldEljb24oZWwsICdsaW5rJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsLmNyZWF0ZURpdih7XG4gICAgICAgICAgICAgICAgY2xzOiAndHJlZS1pdGVtLWlubmVyJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBmaWxlLm5hbWUuc3Vic3RyaW5nKDAsIGZpbGUubmFtZS5sYXN0SW5kZXhPZihcIi5cIikpXG4gICAgICAgICAgICB9KS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KCcnLCBmaWxlLnBhdGgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxudHlwZSBub2RlID0ge1xuICAgIHR5cGU6IHN0cmluZ1xuICAgIGZpbGU6IHN0cmluZ1xufSJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFBK0U7QUFFL0UsSUFBTSxZQUFvQjtBQUMxQixJQUFNLGNBQXNCO0FBQzVCLElBQU0sV0FBbUI7QUFFekIsSUFBcUIsb0JBQXJCLGNBQStDLHVC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