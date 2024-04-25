import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MyPluginSettings {
	mySetting: string;
	urlPrefix: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	urlPrefix: 'https://example.com/'
}

function getSlugFromPath(path) {
	const slug = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
	return slug
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon('external-link', 'Open Published URL', () => {
			const currentFile = this.app.workspace.getActiveFile();
			if (currentFile) {
				const path = currentFile.path;
				// we could use getSlugFromPath here, but we want the whole path				
				window.open(`${this.settings.urlPrefix}/${path}`, '_blank');
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('URL Prefix')
			.setDesc('Enter the URL prefix for external links')
			.addText(text => text
				.setPlaceholder('Enter URL prefix')
				.setValue(this.plugin.settings.urlPrefix)
				.onChange(async (value) => {
					this.plugin.settings.urlPrefix = value;
					await this.plugin.saveSettings();
				}));
	}
}

