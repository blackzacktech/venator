/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => GitLabWikiConverterPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/converter.ts
var import_obsidian = require("obsidian");
var fs = __toESM(require("fs/promises"));
var path = __toESM(require("path"));

// src/fileExtensionStripper.ts
var removeFileExtensionsForMdFiles = (fileText) => {
  const markdownRegex = /\[(^$|.*?)\]\((.*?)\)/g;
  const markdownMatches = fileText.match(markdownRegex);
  if (markdownMatches) {
    const fileRegex = /(?<=\().*(?=\))/;
    for (const markdownMatch of markdownMatches) {
      const fileMatch = markdownMatch.match(fileRegex);
      if (fileMatch && fileMatch[0].endsWith(".md")) {
        fileText = fileText.replace(fileMatch[0], fileMatch[0].slice(0, -3));
      }
    }
  }
  return fileText;
};

// src/converter.ts
var convertAndExportVault = async (plugin) => {
  new import_obsidian.Notice("Starting Vault conversion and export ...", 4e3);
  const files = plugin.app.vault.getFiles();
  for (const file of files) {
    if (file.path.slice(0, -3).match(plugin.settings.homeFilePath)) {
      const path2 = file.path.split("/");
      path2[path2.length - 1] = "home.md";
      await plugin.app.fileManager.renameFile(file, path2.join("/"));
      continue;
    }
    await plugin.app.fileManager.renameFile(file, file.path.replace(/\s+/g, "-"));
  }
  const markdownFiles = plugin.app.vault.getMarkdownFiles();
  for (const file of markdownFiles) {
    await plugin.app.vault.process(file, (data) => {
      return removeFileExtensionsForMdFiles(data);
    });
  }
  exportVaultToSpecifiedLocation(plugin);
  for (const file of files) {
    if (file.path.match("home.md")) {
      const path2 = file.path.split("/");
      path2[path2.length - 1] = plugin.settings.homeFilePath + ".md";
      await plugin.app.fileManager.renameFile(file, path2.join("/"));
      continue;
    }
    await plugin.app.fileManager.renameFile(file, file.path.replace(/-/g, " "));
  }
  new import_obsidian.Notice("Vault conversion and export finished successfully!", 5e3);
};
var exportVaultToSpecifiedLocation = async (plugin) => {
  const adapter = plugin.app.vault.adapter;
  if (adapter instanceof import_obsidian.FileSystemAdapter) {
    const vaultAbsolutePath = adapter.getBasePath();
    const exportPath = plugin.settings.exportPath.split(path.sep).join(path.posix.sep);
    import_obsidian.Vault.recurseChildren(plugin.app.vault.getRoot(), async (file) => {
      if (file instanceof import_obsidian.TFolder && file.isRoot()) {
        try {
          await fs.mkdir(exportPath);
        } catch (error) {
          if (error.code != "EEXIST") {
            console.log("Export failed: Could not find or create export folder! Check path specified in settings.");
            new import_obsidian.Notice("Export failed: Could not find or create export folder! Check path specified in settings.", 0);
            return;
          }
        }
      } else {
        if (file instanceof import_obsidian.TFolder) {
          try {
            await fs.mkdir(path.posix.join(exportPath, file.path));
          } catch (error) {
            if (error.code != "EEXIST") {
              console.log("Export failed: Could not create subfolder in export folder! Check that you have the corresponding permissions.");
              new import_obsidian.Notice("Export failed: Could not create subfolder in export folder! Check that you have the corresponding permissions.", 0);
              return;
            }
          }
        } else {
          try {
            await fs.copyFile(path.posix.join(vaultAbsolutePath, file.path), path.posix.join(exportPath, file.path));
          } catch (error) {
            console.log("Export failed: Could not write to export folder! Check that path is correct and you have the corresponding permissions.");
            new import_obsidian.Notice("Export failed: Could not write to export folder! Check that path is correct and you have the corresponding permissions.", 0);
            return;
          }
        }
      }
    });
    return;
  }
  console.error("Could not get base path of Vault");
};

// src/fileSuggest.ts
var import_obsidian2 = require("obsidian");

// src/utils.ts
function trimFile(file) {
  if (!file)
    return "";
  return file.extension == "md" ? file.path.slice(0, -3) : file.path;
}
function isHomePageSelectedAndValid(plugin) {
  if (plugin.settings.homeFilePath != "" && plugin.app.vault.getAbstractFileByPath(plugin.settings.homeFilePath + ".md") != null) {
    return true;
  } else {
    return false;
  }
}

// src/fileSuggest.ts
var FileSuggest = class extends import_obsidian2.AbstractInputSuggest {
  getSuggestions(inputStr) {
    const mdFiles = this.app.vault.getMarkdownFiles();
    const files = [];
    const inputLower = inputStr.toLowerCase();
    mdFiles.forEach((file) => {
      if (file.path.toLowerCase().contains(inputLower)) {
        files.push(file);
      }
    });
    return files;
  }
  renderSuggestion(file, el) {
    el.setText(trimFile(file));
  }
  selectSuggestion(file) {
    this.textInputEl.value = trimFile(file);
    this.textInputEl.trigger("input");
    this.close();
  }
};

// src/settings.ts
var import_obsidian3 = require("obsidian");
var DEFAULT_SETTINGS = {
  exportPath: "",
  homeFilePath: ""
};
var GitLabWikiConverterSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian3.Setting(containerEl).setName("Location").setDesc("Specify the path to where you want to export converted vault.").addText((text) => text.setPlaceholder("Path").setValue(this.plugin.settings.exportPath).onChange(async (value) => {
      this.plugin.settings.exportPath = (0, import_obsidian3.normalizePath)(value);
      await this.plugin.saveSettings();
    }));
    new import_obsidian3.Setting(containerEl).setName("Home page").setDesc("Specify the file, which will be your Gitlab homepage.").addText((text) => {
      new FileSuggest(this.app, text.inputEl);
      text.setPlaceholder("Home").setValue(this.plugin.settings.homeFilePath).onChange(async (value) => {
        this.plugin.settings.homeFilePath = (0, import_obsidian3.normalizePath)(value);
        await this.plugin.saveSettings();
      });
    });
  }
};

// src/main.ts
var GitLabWikiConverterPlugin = class extends import_obsidian4.Plugin {
  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: "export-vault",
      name: "Export Vault as Gitlab Wiki",
      callback: () => {
        if (isHomePageSelectedAndValid(this)) {
          convertAndExportVault(this);
        } else {
          new import_obsidian4.Notice("Export failed! Select a valid Gitlab home page in the settings before exporting vault.", 0);
        }
      }
    });
    this.addSettingTab(new GitLabWikiConverterSettingTab(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};

/* nosourcemap */