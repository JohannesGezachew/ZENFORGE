const assert = require('assert');
const vscode = require('vscode'); // Will be mocked
const fs = require('fs'); // Will be mocked
const path = require('path'); // Will be mocked
const os = require('os'); // Will be mocked

// Import the functions to test (assuming they are exported for testing)
const { installFonts, backupUserSettings, ZENFORGE_CUSTOM_SETTINGS } = require('../extension');

// --- Mocks ---
let mockVscodeApi;
let mockFsApi;
let mockPathApi;
let mockOsApi;
let copiedFiles; // To track calls to fs.copyFileSync
let globalStateBackup; // To track calls to context.globalState.update

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	setup(() => {
		// Reset mocks before each test
		copiedFiles = [];
		globalStateBackup = null;

		mockVscodeApi = {
			window: {
				showInformationMessage: (message) => { console.log(`Info: ${message}`); return Promise.resolve(); },
				showErrorMessage: (message) => { console.error(`Error: ${message}`); return Promise.resolve(); },
				showWarningMessage: (message) => { console.warn(`Warning: ${message}`); return Promise.resolve(); }
			},
			workspace: {
				getConfiguration: (section) => {
					return {
						get: (key, defaultValue) => {
							if (section === 'zenforge' && key === 'applyNeovimSettings') {
								return true; // Default to true for testing Neovim settings backup
							}
							return defaultValue;
						},
						inspect: (key) => {
							// Implemented specifically for backupUserSettings tests
							if (mockVscodeApi.workspace.getConfiguration.inspectValues && mockVscodeApi.workspace.getConfiguration.inspectValues[key]) {
								return mockVscodeApi.workspace.getConfiguration.inspectValues[key];
							}
							return undefined;
						},
						update: () => Promise.resolve()
					};
				}
			},
			ConfigurationTarget: {
				Global: 1
			},
			Uri: {
				file: (path) => ({ fsPath: path, path: path, scheme: 'file' }), // Simplified mock
			},
			extensions: {
				getExtension: () => undefined // Mock as not installed initially
			},
			commands: {
				executeCommand: () => Promise.resolve() // Mock command execution
			}
		};

		mockFsApi = {
			readdirSync: () => [],
			copyFileSync: (source, dest) => {
				copiedFiles.push({ source, dest });
			},
			existsSync: () => true, // Assume paths exist for simplicity unless specified
			mkdirSync: () => { }
		};

		mockPathApi = {
			join: (...args) => args.join('/'), // Simple join mock
			extname: (p) => {
				const parts = p.split('.');
				return parts.length > 1 ? '.' + parts.pop() : '';
			}
		};

		mockOsApi = {
			homedir: () => '/mock/home'
		};

		// Apply mocks - this is a simple way; a library like Sinon would be more robust
		Object.assign(vscode, mockVscodeApi);
		Object.assign(fs, mockFsApi);
		Object.assign(path, mockPathApi);
		Object.assign(os, mockOsApi);
	});

	suite('installFonts', () => {
		test('should filter and attempt to copy only .ttf and .otf files', async () => {
			const mockFontFiles = [
				'GeistMono-Regular.ttf',
				'JetBrainsMonoNerdFont-Regular.otf',
				'._GeistMono-Regular.ttf', // Should be ignored (starts with ._)
				'some-document.txt',       // Should be ignored
				'anotherfont.TTF',         // Should be included (case-insensitive)
				'font3.OTF'                // Should be included (case-insensitive)
			];
			fs.readdirSync = () => mockFontFiles;
			fs.existsSync = (path) => {
				if (path === '/app/fonts' || path.includes('fonts') || path === os.homedir() || path.includes(os.homedir())) return true; // Ensure destination dir exists
				return false;
			};


			await installFonts(); // Assuming __dirname is /app for testing context

			assert.strictEqual(copiedFiles.length, 4, 'Should attempt to copy 4 valid font files');
			assert.ok(copiedFiles.some(f => f.source.endsWith('GeistMono-Regular.ttf')), 'GeistMono-Regular.ttf should be copied');
			assert.ok(copiedFiles.some(f => f.source.endsWith('JetBrainsMonoNerdFont-Regular.otf')), 'JetBrainsMonoNerdFont-Regular.otf should be copied');
			assert.ok(copiedFiles.some(f => f.source.endsWith('anotherfont.TTF')), 'anotherfont.TTF should be copied');
			assert.ok(copiedFiles.some(f => f.source.endsWith('font3.OTF')), 'font3.OTF should be copied');

			assert.ok(!copiedFiles.some(f => f.source.endsWith('._GeistMono-Regular.ttf')), '._GeistMono-Regular.ttf should NOT be copied');
			assert.ok(!copiedFiles.some(f => f.source.endsWith('some-document.txt')), 'some-document.txt should NOT be copied');
		});

		test('should show message if no valid font files are found', async () => {
			const mockFontFiles = ['._invalid.ttf', 'invalid.txt'];
			fs.readdirSync = () => mockFontFiles;
			let infoMessage = '';
			vscode.window.showInformationMessage = (message) => { infoMessage = message; return Promise.resolve(); };
			
			await installFonts();
			
			assert.strictEqual(copiedFiles.length, 0, 'No files should be copied');
			assert.strictEqual(infoMessage, 'No .ttf or .otf font files found in the extension\'s fonts directory to install.');
		});
	});

	suite('backupUserSettings', () => {
		const mockContext = {
			globalState: {
				update: (key, value) => {
					globalStateBackup = { key, value };
					return Promise.resolve();
				},
				get: () => undefined // Not used by backupUserSettings directly
			}
		};

		const settingKeysToTest = Object.keys(ZENFORGE_CUSTOM_SETTINGS);

		test('should back up globalValue if defined', async () => {
			mockVscodeApi.workspace.getConfiguration.inspectValues = {
				'editor.fontSize': { globalValue: 10, workspaceValue: 12 },
				'workbench.colorTheme': { globalValue: 'OldTheme' }
			};

			await backupUserSettings(settingKeysToTest, mockContext);

			assert.ok(globalStateBackup, 'Backup should have been called');
			assert.strictEqual(globalStateBackup.key, 'zenforge.userSettingBackup');
			assert.deepStrictEqual(globalStateBackup.value, {
				'editor.fontSize': 10,
				'workbench.colorTheme': 'OldTheme'
			});
		});

		test('should back up workspaceValue if globalValue is undefined', async () => {
			mockVscodeApi.workspace.getConfiguration.inspectValues = {
				'editor.fontSize': { workspaceValue: 12 }, // globalValue is undefined
				'workbench.colorTheme': { globalValue: undefined, workspaceValue: 'WorkspaceTheme' }
			};

			await backupUserSettings(settingKeysToTest, mockContext);
			
			assert.ok(globalStateBackup, 'Backup should have been called');
			assert.strictEqual(globalStateBackup.key, 'zenforge.userSettingBackup');
			assert.deepStrictEqual(globalStateBackup.value, {
				'editor.fontSize': 12,
				'workbench.colorTheme': 'WorkspaceTheme'
			});
		});

		test('should not back up setting if neither globalValue nor workspaceValue is defined', async () => {
			mockVscodeApi.workspace.getConfiguration.inspectValues = {
				'editor.fontSize': { defaultValue: 14 }, // only default
				'workbench.colorTheme': { globalValue: 'ATheme' }
			};

			await backupUserSettings(settingKeysToTest, mockContext);
			
			assert.ok(globalStateBackup, 'Backup should have been called');
			assert.strictEqual(globalStateBackup.key, 'zenforge.userSettingBackup');
			assert.deepStrictEqual(globalStateBackup.value, {
				'workbench.colorTheme': 'ATheme' // Only this one should be backed up
			});
		});

		test('should clear backup if no user-defined settings are found for ZenForge keys', async () => {
			mockVscodeApi.workspace.getConfiguration.inspectValues = {
				'editor.fontSize': { defaultValue: 14 },
				'workbench.colorTheme': { defaultValue: 'Default Theme' }
			};
			// Ensure all ZENFORGE_CUSTOM_SETTINGS keys return only defaultValues or are undefined
			const allDefaultInspectValues = {};
			for(const key of settingKeysToTest) {
				allDefaultInspectValues[key] = { defaultValue: 'someDefault' };
			}
			mockVscodeApi.workspace.getConfiguration.inspectValues = allDefaultInspectValues;


			await backupUserSettings(settingKeysToTest, mockContext);
			
			assert.ok(globalStateBackup, 'Backup (clear) should have been called');
			assert.strictEqual(globalStateBackup.key, 'zenforge.userSettingBackup');
			assert.strictEqual(globalStateBackup.value, undefined, 'Backup should be cleared (set to undefined)');
		});

		test('should handle empty settingsKeys array gracefully', async () => {
			mockVscodeApi.workspace.getConfiguration.inspectValues = {};
			await backupUserSettings([], mockContext);
			
			assert.ok(globalStateBackup, 'Backup (clear) should have been called for empty keys');
			assert.strictEqual(globalStateBackup.key, 'zenforge.userSettingBackup');
			assert.strictEqual(globalStateBackup.value, undefined);
		});
	});
});
