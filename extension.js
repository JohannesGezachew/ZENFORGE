import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

async function installFonts() {
	try {
		const fontSourcePath = path.join(__dirname, 'fonts');
		if (!fs.existsSync(fontSourcePath)) {
			vscode.window.showErrorMessage('Font source directory does not exist. Ensure "fonts" folder is available in the extension directory.');
			return;
		}

		let fontDestinationPath;
		switch (process.platform) {
			case 'win32':
				fontDestinationPath = path.join(os.homedir(), 'AppData', 'Local', 'Microsoft', 'Windows', 'Fonts');
				break;
			case 'darwin':
				fontDestinationPath = path.join(os.homedir(), 'Library', 'Fonts'); // macOS path
				break;
			default:
				fontDestinationPath = path.join(os.homedir(), '.fonts'); // Linux path
		}

		if (!fs.existsSync(fontDestinationPath)) {
			fs.mkdirSync(fontDestinationPath, { recursive: true });
		}

		const fontFiles = fs.readdirSync(fontSourcePath);
		fontFiles.forEach(file => {
			const sourceFile = path.join(fontSourcePath, file);
			const destinationFile = path.join(fontDestinationPath, file);
			fs.copyFileSync(sourceFile, destinationFile);
		});

		vscode.window.showInformationMessage('Fonts installed successfully.');
	} catch (error) {
		vscode.window.showErrorMessage('Failed to install fonts: ' + error.message);
	}
}

async function applyCustomSettings() {
	const config = vscode.workspace.getConfiguration();

	// Define your custom settings here
	const customSettings = {
		"editor.fontLigatures": true, // Enable font ligatures for clean, connected code symbols
		"editor.formatOnSave": true, // Automatically format code on save
		"editor.lineNumbers": "on", // Display line numbers in the editor
		"editor.minimap.enabled": false, // Disable minimap for a cleaner view
		"editor.wordWrap": "on", // Wrap long lines of code in the editor
		"editor.cursorBlinking": "smooth", // Enable smooth blinking for the cursor
		"editor.cursorSmoothCaretAnimation": "on", // Enable smooth cursor animation when moving
		"editor.accessibilitySupport": "off", // Disable accessibility support to improve performance
		"workbench.statusBar.visible": false, // Hide the status bar for a more focused UI
		"workbench.layoutControl.enabled": false, // Disable the layout control feature in the workbench

		"workbench.sideBar.location": "left", // Position the sidebar on the left side

		// "window.menuBarVisibility": "toggle", // Automatically hide/show the menu bar
		"window.titleBarStyle": "custom", // Remove the default title bar (especially useful for Linux)
		"window.zoomLevel": 0, // Set default zoom level (0 means no zoom)
		"window.commandCenter": false, // Disable the command center for a cleaner window

		"explorer.confirmDragAndDrop": false, // Disable drag and drop confirmation in the file explorer
		"explorer.confirmDelete": false, // Disable delete confirmation for files
		"explorer.confirmsPasteNative": false, // Disable paste confirmation for native file operations
		"explorer.openEditors.visible": 0, // Hide the "Open Editors" section in the file explorer

		"editor.semanticHighlighting.enabled": true, // Enable semantic highlighting for better readability
		"editor.bracketPairColorization.enabled": true, // Colorize matching brackets for better navigation
		"editor.guides.bracketPairs": "active", // Show active bracket pair guides

		"breadcrumbs.enabled": false, // Disable breadcrumbs for a cleaner editor UI
		"editor.folding": false, // Disable code folding to keep everything expanded
		"editor.glyphMargin": false, // Remove glyph margin for a cleaner code area
		"editor.renderWhitespace": "none", // Don’t render whitespace characters
		"editor.renderControlCharacters": false, // Don’t render control characters
		"editor.hideCursorInOverviewRuler": true, // Hide the cursor in the overview ruler
		"editor.overviewRulerBorder": false, // Remove the overview ruler border
		"workbench.activityBar.location": "top", // Hide the title bar for a more immersive coding experience


		// open json editor for settings
		"workbench.settings.editor": "json",

		// Theme
		"workbench.colorTheme": "Aura Dark",
		"workbench.iconTheme": "moxer-icons",

		// Change font
		"editor.fontFamily": "Geist Mono",
		"scm.inputFontFamily": "Geist Mono",
		"terminal.integrated.fontFamily": "JetBrainsMono Nerd Font",
		"chat.editor.fontFamily": "Geist Mono",
		"debug.console.fontFamily": "Geist Mono",
		"editor.codeLensFontFamily": "Geist Mono",
		"notebook.output.fontFamily": "Geist Mono",
		"markdown.preview.fontFamily": "Geist Mono",
		"editor.inlayHints.fontFamily": "Geist Mono",

		// Font size
		"editor.fontSize": 12,
		"terminal.integrated.fontSize": 12,



		"editor.scrollbar.vertical": "auto",

		"editor.scrollbar.horizontal": "auto",


		// Aura theme customisation
		"workbench.colorCustomizations": {
			"[Aura Dark]": {
				"editor.background": "#110f17",
				"terminal.background": "#110f17",
				"activityBar.background": "#110f17",
				"statusBar.background": "#110f17",
				"editorGroupHeader.tabsBackground": "#110f17",
				"tab.inactiveBackground": "#110f17"
			}
		},



		// Misc
		"workbench.startupEditor": "none",
		"explorer.compactFolders": false,
		"editor.tabSize": 2,
		"editor.linkedEditing": true,
		"breadcrumbs.filePath": "off",
		"files.trimTrailingWhitespace": true,
		"[markdown]": {
			"files.trimTrailingWhitespace": false
		},



		// Neovim
		"vscode-neovim.neovimExecutablePaths.darwin": "/opt/homebrew/bin/nvim",
		"vscode-neovim.neovimInitVimPaths.darwin": "$HOME/.config/nvim-vscode/init.vim",
		"extensions.experimental.affinity": {
			"asvetliakov.vscode-neovim": 1
		},
		"whichkey.sortOrder": "alphabetically",
		"whichkey.delay": 0,
		"whichkey.bindings": [
		{
			"key": "w",
			"name": "Save file",
			"type": "command",
			"command": "workbench.action.files.save"
		},
		{
			"key": "q",
			"name": "Close file",
			"type": "command",
			"command": "workbench.action.closeActiveEditor"
		},
		{
			"key": ";",
			"name": "commands",
			"type": "command",
			"command": "workbench.action.showCommands"
		},
		{
			"key": "/",
			"name": "comment",
			"type": "command",
			"command": "vscode-neovim.send",
			"args": "<C-/>"
		},
		{
			"key": "?",
			"name": "View All References",
			"type": "command",
			"command": "references-view.find",
			"when": "editorHasReferenceProvider"
		},
		{
			"key": "b",
			"name": "Buffers/Editors...",
			"type": "bindings",
			"bindings": [
				{
					"key": "b",
					"name": "Show all buffers/editors",
					"type": "command",
					"command": "workbench.action.showAllEditors"
				},
				{
					"key": "d",
					"name": "Close active editor",
					"type": "command",
					"command": "workbench.action.closeActiveEditor"
				},
				{
					"key": "h",
					"name": "Move editor into left group",
					"type": "command",
					"command": "workbench.action.moveEditorToLeftGroup"
				},
				{
					"key": "j",
					"name": "Move editor into below group",
					"type": "command",
					"command": "workbench.action.moveEditorToBelowGroup"
				},
				{
					"key": "k",
					"name": "Move editor into above group",
					"type": "command",
					"command": "workbench.action.moveEditorToAboveGroup"
				},
				{
					"key": "l",
					"name": "Move editor into right group",
					"type": "command",
					"command": "workbench.action.moveEditorToRightGroup"
				},
				{
					"key": "m",
					"name": "Close other editors",
					"type": "command",
					"command": "workbench.action.closeOtherEditors"
				},
				{
					"key": "n",
					"name": "Next editor",
					"type": "command",
					"command": "workbench.action.nextEditor"
				},
				{
					"key": "p",
					"name": "Previous editor",
					"type": "command",
					"command": "workbench.action.previousEditor"
				},
				{
					"key": "N",
					"name": "New untitled editor",
					"type": "command",
					"command": "workbench.action.files.newUntitledFile"
				},
				{
					"key": "u",
					"name": "Reopen closed editor",
					"type": "command",
					"command": "workbench.action.reopenClosedEditor"
				},
				{
					"key": "y",
					"name": "Copy buffer to clipboard",
					"type": "commands",
					"commands": [
						"editor.action.selectAll",
						"editor.action.clipboardCopyAction",
						"cancelSelection"
					]
				}
			]
		},
		{
			"key": "d",
			"name": "Debug...",
			"type": "bindings",
			"bindings": [
				{
					"key": "d",
					"name": "Start debug",
					"type": "command",
					"command": "workbench.action.debug.start"
				},
				{
					"key": "S",
					"name": "Stop debug",
					"type": "command",
					"command": "workbench.action.debug.stop"
				},
				{
					"key": "c",
					"name": "Continue debug",
					"type": "command",
					"command": "workbench.action.debug.continue"
				},
				{
					"key": "p",
					"name": "Pause debug",
					"type": "command",
					"command": "workbench.action.debug.pause"
				},
				{
					"key": "r",
					"name": "Run without debugging",
					"type": "command",
					"command": "workbench.action.debug.run"
				},
				{
					"key": "R",
					"name": "Restart ebug",
					"type": "command",
					"command": "workbench.action.debug.restart"
				},
				{
					"key": "i",
					"name": "Step into",
					"type": "command",
					"command": "workbench.action.debug.stepInto"
				},
				{
					"key": "s",
					"name": "Step over",
					"type": "command",
					"command": "workbench.action.debug.stepOver"
				},
				{
					"key": "o",
					"name": "Step out",
					"type": "command",
					"command": "workbench.action.debug.stepOut"
				},
				{
					"key": "b",
					"name": "Toggle breakpoint",
					"type": "command",
					"command": "editor.debug.action.toggleBreakpoint"
				},
				{
					"key": "B",
					"name": "Toggle inline breakpoint",
					"type": "command",
					"command": "editor.debug.action.toggleInlineBreakpoint"
				},
				{
					"key": "j",
					"name": "Jump to cursor",
					"type": "command",
					"command": "debug.jumpToCursor"
				},
				{
					"key": "v",
					"name": "REPL",
					"type": "command",
					"command": "workbench.debug.action.toggleRepl"
				},
				{
					"key": "w",
					"name": "Focus on watch window",
					"type": "command",
					"command": "workbench.debug.action.focusWatchView"
				},
				{
					"key": "W",
					"name": "Add to watch",
					"type": "command",
					"command": "editor.debug.action.selectionToWatch"
				}
			]
		},
		{
			"key": "e",
			"name": "Toggle Explorer",
			"type": "command",
			"command": "workbench.action.toggleSidebarVisibility"
		},
		{
			"key": "f",
			"name": "Find & Replace...",
			"type": "bindings",
			"bindings": [
				{
					"key": "f",
					"name": "File",
					"type": "command",
					"command": "editor.action.startFindReplaceAction"
				},
				{
					"key": "s",
					"name": "Symbol",
					"type": "command",
					"command": "editor.action.rename",
					"when": "editorHasRenameProvider && editorTextFocus && !editorReadonly"
				},
				{
					"key": "p",
					"name": "Project",
					"type": "command",
					"command": "workbench.action.replaceInFiles"
				}
			]
		},
		{
			"key": "g",
			"name": "Git...",
			"type": "bindings",
			"bindings": [
				{
					"key": "/",
					"name": "Search Commits",
					"command": "gitlens.showCommitSearch",
					"type": "command",
					"when": "gitlens:enabled && config.gitlens.keymap == 'alternate'"
				},
				{
					"key": "a",
					"name": "Stage",
					"type": "command",
					"command": "git.stage"
				},
				{
					"key": "b",
					"name": "Checkout",
					"type": "command",
					"command": "git.checkout"
				},
				{
					"key": "B",
					"name": "Browse",
					"type": "command",
					"command": "gitlens.openFileInRemote"
				},
				{
					"key": "c",
					"name": "Commit",
					"type": "command",
					"command": "git.commit"
				},
				{
					"key": "C",
					"name": "Cherry Pick",
					"type": "command",
					"command": "gitlens.views.cherryPick"
				},
				{
					"key": "d",
					"name": "Delete Branch",
					"type": "command",
					"command": "git.deleteBranch"
				},
				{
					"key": "f",
					"name": "Fetch",
					"type": "command",
					"command": "git.fetch"
				},
				{
					"key": "F",
					"name": "Pull From",
					"type": "command",
					"command": "git.pullFrom"
				},
				{
					"key": "g",
					"name": "Graph",
					"type": "command",
					"command": "git-graph.view"
				},
				{
					"key": "h",
					"name": "Heatmap",
					"type": "command",
					"command": "gitlens.toggleFileHeatmap"
				},
				{
					"key": "H",
					"name": "History",
					"type": "command",
					"command": "git.viewFileHistory"
				},
				{
					"key": "i",
					"name": "Init",
					"type": "command",
					"command": "git.init"
				},
				{
					"key": "j",
					"name": "Next Change",
					"type": "command",
					"command": "workbench.action.editor.nextChange"
				},
				{
					"key": "k",
					"name": "Previous Change",
					"type": "command",
					"command": "workbench.action.editor.previousChange"
				},
				{
					"key": "l",
					"name": "Toggle Line Blame",
					"type": "command",
					"command": "gitlens.toggleLineBlame",
					"when": "editorTextFocus && gitlens:canToggleCodeLens && gitlens:enabled && config.gitlens.keymap == 'alternate'"
				},
				{
					"key": "L",
					"name": "Toggle GitLens",
					"type": "command",
					"command": "gitlens.toggleCodeLens",
					"when": "editorTextFocus && gitlens:canToggleCodeLens && gitlens:enabled && config.gitlens.keymap == 'alternate'"
				},
				{
					"key": "m",
					"name": "Merge",
					"type": "command",
					"command": "git.merge"
				},
				{
					"key": "p",
					"name": "Push",
					"type": "command",
					"command": "git.push"
				},
				{
					"key": "P",
					"name": "Pull",
					"type": "command",
					"command": "git.pull"
				},
				{
					"key": "s",
					"name": "Stash",
					"type": "command",
					"command": "workbench.view.scm"
				},
				{
					"key": "S",
					"name": "Status",
					"type": "command",
					"command": "gitlens.showQuickRepoStatus",
					"when": "gitlens:enabled && config.gitlens.keymap == 'alternate'"
				},
				{
					"key": "t",
					"name": "Create Tag",
					"type": "command",
					"command": "git.createTag"
				},
				{
					"key": "T",
					"name": "Delete Tag",
					"type": "command",
					"command": "git.deleteTag"
				},
				{
					"key": "U",
					"name": "Unstage",
					"type": "command",
					"command": "git.unstage"
				}
			]
		},
		{
			"key": "h",
			"name": "Split Horizontal",
			"type": "command",
			"command": "workbench.action.splitEditorDown"
		},
		{
			"key": "i",
			"name": "Insert...",
			"type": "bindings",
			"bindings": [
				{
					"key": "j",
					"name": "Insert line below",
					"type": "command",
					"command": "editor.action.insertLineAfter"
				},
				{
					"key": "k",
					"name": "Insert line above",
					"type": "command",
					"command": "editor.action.insertLineBefore"
				},
				{
					"key": "s",
					"name": "Insert snippet",
					"type": "command",
					"command": "editor.action.insertSnippet"
				}
			]
		},
		{
			"key": "l",
			"name": "LSP...",
			"type": "bindings",
			"bindings": [
				{
					"key": ";",
					"name": "Refactor",
					"type": "command",
					"command": "editor.action.refactor",
					"when": "editorHasCodeActionsProvider && editorTextFocus && !editorReadonly"
				},
				{
					"key": "a",
					"name": "Auto Fix",
					"type": "command",
					"command": "editor.action.autoFix",
					"when": "editorTextFocus && !editorReadonly && supportedCodeAction =~ /(\\s|^)quickfix\\b/"
				},
				{
					"key": "d",
					"name": "Definition",
					"type": "command",
					"command": "editor.action.revealDefinition",
					"when": "editorHasDefinitionProvider && editorTextFocus && !isInEmbeddedEditor"
				},
				{
					"key": "D",
					"name": "Declaration",
					"type": "command",
					"command": "editor.action.revealDeclaration"
				},
				{
					"key": "e",
					"name": "Errors",
					"type": "command",
					"command": "workbench.actions.view.problems"
				},
				{
					"key": "f",
					"name": "Format",
					"type": "command",
					"command": "editor.action.formatDocument",
					"when": "editorHasDocumentFormattingProvider && editorHasDocumentFormattingProvider && editorTextFocus && !editorReadonly && !inCompositeEditor"
				},
				{
					"key": "i",
					"name": "Implementation",
					"type": "command",
					"command": "editor.action.goToImplementation",
					"when": "editorHasImplementationProvider && editorTextFocus && !isInEmbeddedEditor"
				},
				{
					"key": "l",
					"name": "Code Lens",
					"type": "command",
					"command": "codelens.showLensesInCurrentLine"
				},
				{
					"key": "n",
					"name": "Next Problem",
					"type": "command",
					"command": "editor.action.marker.next",
					"when": "editorFocus"
				},
				{
					"key": "N",
					"name": "Next Problem (Proj)",
					"type": "command",
					"command": "editor.action.marker.nextInFiles",
					"when": "editorFocus"
				},
				{
					"key": "o",
					"name": "Outline",
					"type": "command",
					"command": "outline.focus"
				},
				{
					"key": "p",
					"name": "Prev Problem",
					"type": "command",
					"command": "editor.action.marker.prevInFiles",
					"when": "editorFocus"
				},
				{
					"key": "P",
					"name": "Prev Problem (Proj)",
					"type": "command",
					"command": "editor.action.marker.prev",
					"when": "editorFocus"
				},
				{
					"key": "q",
					"name": "Quick Fix",
					"type": "command",
					"command": "editor.action.quickFix",
					"when": "editorHasCodeActionsProvider && editorTextFocus && !editorReadonly"
				},
				{
					"key": "r",
					"name": "References",
					"type": "command",
					"command": "editor.action.goToReferences",
					"when": "editorHasReferenceProvider && editorTextFocus && !inReferenceSearchEditor && !isInEmbeddedEditor"
				},
				{
					"key": "R",
					"name": "Rename",
					"type": "command",
					"command": "editor.action.rename",
					"when": "editorHasRenameProvider && editorTextFocus && !editorReadonly"
				},
				{
					"key": "v",
					"name": "View All References",
					"type": "command",
					"command": "references-view.find",
					"when": "editorHasReferenceProvider"
				},
				{
					"key": "s",
					"name": "Go To Symbol",
					"type": "command",
					"command": "workbench.action.gotoSymbol"
				},
				{
					"key": "S",
					"name": "Show All Symbols",
					"type": "command",
					"command": "workbench.action.showAllSymbols"
				}
			]
		},
		{
			"key": "m",
			"name": "Mark...",
			"type": "bindings",
			"bindings": [
				{
					"key": "c",
					"name": "Clear Bookmarks",
					"type": "command",
					"command": "bookmarks.clear"
				},
				{
					"key": "j",
					"name": "Next Bookmark",
					"type": "command",
					"command": "bookmarks.jumpToNext",
					"when": "editorTextFocus"
				},
				{
					"key": "k",
					"name": "Previous Bookmark",
					"type": "command",
					"command": "bookmarks.jumpToPrevious",
					"when": "editorTextFocus"
				},
				{
					"key": "l",
					"name": "List Bookmarks",
					"type": "command",
					"command": "bookmarks.listFromAllFiles",
					"when": "editorTextFocus"
				},
				{
					"key": "r",
					"name": "Refresh Bookmarks",
					"type": "command",
					"command": "bookmarks.refresh"
				},
				{
					"key": "t",
					"name": "Toggle Bookmark",
					"type": "command",
					"command": "bookmarks.toggle",
					"when": "editorTextFocus"
				},
				{
					"key": "s",
					"name": "Show Bookmarks",
					"type": "command",
					"command": "workbench.view.extension.bookmarks"
				}
			]
		},
		{
			"key": "M",
			"name": "Minimap",
			"type": "command",
			"command": "editor.action.toggleMinimap"
		},
		{
			"key": "n",
			"name": "No Highlight",
			"type": "command",
			"command": "vscode-neovim.send",
			"args": ":noh<CR>"
		},
		{
			"key": "o",
			"name": "Open...",
			"type": "bindings",
			"bindings": [
				{
					"key": "d",
					"name": "Directory",
					"type": "command",
					"command": "workbench.action.files.openFolder"
				},
				{
					"key": "r",
					"name": "Recent",
					"type": "command",
					"command": "workbench.action.openRecent"
				},
				{
					"key": "f",
					"name": "File",
					"type": "command",
					"command": "workbench.action.files.openFile"
				}
			]
		},
		{
			"key": "p",
			"name": "Peek...",
			"type": "bindings",
			"bindings": [
				{
					"key": "d",
					"name": "Definition",
					"type": "command",
					"command": "editor.action.peekDefinition",
					"when": "editorHasDefinitionProvider && editorTextFocus && !inReferenceSearchEditor && !isInEmbeddedEditor"
				},
				{
					"key": "D",
					"name": "Declaration",
					"type": "command",
					"command": "editor.action.peekDeclaration"
				},
				{
					"key": "i",
					"name": "Implementation",
					"type": "command",
					"command": "editor.action.peekImplementation",
					"when": "editorHasImplementationProvider && editorTextFocus && !inReferenceSearchEditor && !isInEmbeddedEditor"
				},
				{
					"key": "p",
					"name": "Toggle Focus",
					"type": "command",
					"command": "togglePeekWidgetFocus",
					"when": "inReferenceSearchEditor || referenceSearchVisible"
				},
				{
					"key": "r",
					"name": "References",
					"type": "command",
					"command": "editor.action.referenceSearch.trigger"
				},
				{
					"key": "t",
					"name": "Type Definition",
					"type": "command",
					"command": "editor.action.peekTypeDefinition"
				}
			]
		},
		{
			"key": "s",
			"name": "Search...",
			"type": "bindings",
			"bindings": [
				{
					"key": "f",
					"name": "Files",
					"type": "command",
					"command": "workbench.action.quickOpen"
				},
				{
					"key": "t",
					"name": "Text",
					"type": "command",
					"command": "workbench.action.findInFiles"
				}
			]
		},
		{
			"key": "S",
			"name": "Show...",
			"type": "bindings",
			"bindings": [
				{
					"key": "e",
					"name": "Show explorer",
					"type": "command",
					"command": "workbench.view.explorer"
				},
				{
					"key": "s",
					"name": "Show search",
					"type": "command",
					"command": "workbench.view.search"
				},
				{
					"key": "g",
					"name": "Show source control",
					"type": "command",
					"command": "workbench.view.scm"
				},
				{
					"key": "t",
					"name": "Show test",
					"type": "command",
					"command": "workbench.view.extension.test"
				},
				{
					"key": "r",
					"name": "Show remote explorer",
					"type": "command",
					"command": "workbench.view.remote"
				},
				{
					"key": "x",
					"name": "Show extensions",
					"type": "command",
					"command": "workbench.view.extensions"
				},
				{
					"key": "p",
					"name": "Show problem",
					"type": "command",
					"command": "workbench.actions.view.problems"
				},
				{
					"key": "o",
					"name": "Show output",
					"type": "command",
					"command": "workbench.action.output.toggleOutput"
				},
				{
					"key": "d",
					"name": "Show debug console",
					"type": "command",
					"command": "workbench.debug.action.toggleRepl"
				}
			]
		},
		{
			"key": "t",
			"name": "Terminal...",
			"type": "bindings",
			"bindings": [
				{
					"key": "t",
					"name": "Toggle Terminal",
					"type": "command",
					"command": "workbench.action.togglePanel"
				},
				{
					"key": "T",
					"name": "Focus Terminal",
					"type": "command",
					"command": "workbench.action.terminal.toggleTerminal",
					"when": "!terminalFocus"
				}
			]
		},
		{
			"key": "u",
			"name": "UI toggles...",
			"type": "bindings",
			"bindings": [
				{
					"key": "a",
					"name": "Toggle tool/activity bar visibility",
					"type": "command",
					"command": "workbench.action.toggleActivityBarVisibility"
				},
				{
					"key": "b",
					"name": "Toggle side bar visibility",
					"type": "command",
					"command": "workbench.action.toggleSidebarVisibility"
				},
				{
					"key": "j",
					"name": "Toggle panel visibility",
					"type": "command",
					"command": "workbench.action.togglePanel"
				},
				{
					"key": "F",
					"name": "Toggle full screen",
					"type": "command",
					"command": "workbench.action.toggleFullScreen"
				},
				{
					"key": "s",
					"name": "Select theme",
					"type": "command",
					"command": "workbench.action.selectTheme"
				},
				{
					"key": "m",
					"name": "Toggle maximized panel",
					"type": "command",
					"command": "workbench.action.toggleMaximizedPanel"
				},
				{
					"key": "T",
					"name": "Toggle tab visibility",
					"type": "command",
					"command": "workbench.action.toggleTabsVisibility"
				}
			]
		},
		{
			"key": "v",
			"name": "Split Vertical",
			"type": "command",
			"command": "workbench.action.splitEditor"
		},
		{
			"key": "w",
			"name": "Window...",
			"type": "bindings",
			"bindings": [
				{
					"key": "W",
					"name": "Focus previous editor group",
					"type": "command",
					"command": "workbench.action.focusPreviousGroup"
				},
				{
					"key": "h",
					"name": "Move editor group left",
					"type": "command",
					"command": "workbench.action.moveActiveEditorGroupLeft"
				},
				{
					"key": "j",
					"name": "Move editor group down",
					"type": "command",
					"command": "workbench.action.moveActiveEditorGroupDown"
				},
				{
					"key": "k",
					"name": "Move editor group up",
					"type": "command",
					"command": "workbench.action.moveActiveEditorGroupUp"
				},
				{
					"key": "l",
					"name": "Move editor group right",
					"type": "command",
					"command": "workbench.action.moveActiveEditorGroupRight"
				},
				{
					"key": "t",
					"name": "Toggle editor group sizes",
					"type": "command",
					"command": "workbench.action.toggleEditorWidths"
				},
				{
					"key": "m",
					"name": "Maximize editor group",
					"type": "command",
					"command": "workbench.action.minimizeOtherEditors"
				},
				{
					"key": "M",
					"name": "Maximize editor group and hide side bar",
					"type": "command",
					"command": "workbench.action.maximizeEditor"
				},
				{
					"key": "=",
					"name": "Reset editor group sizes",
					"type": "command",
					"command": "workbench.action.evenEditorWidths"
				},
				{
					"key": "z",
					"name": "Combine all editors",
					"type": "command",
					"command": "workbench.action.joinAllGroups"
				},
				{
					"key": "d",
					"name": "Close editor group",
					"type": "command",
					"command": "workbench.action.closeEditorsInGroup"
				},
				{
					"key": "x",
					"name": "Close all editor groups",
					"type": "command",
					"command": "workbench.action.closeAllGroups"
				}
			]
		},
		{
			"key": "x",
			"name": "Extensions",
			"type": "command",
			"command": "workbench.view.extensions"
		},
		{
			"key": "y",
			"name": "Sync...",
			"type": "bindings",
			"bindings": [
				{
					"key": "d",
					"name": "Download Settings",
					"type": "command",
					"command": "extension.downloadSettings"
				},
				{
					"key": "u",
					"name": "Upload Settings",
					"type": "command",
					"command": "extension.updateSettings"
				}
			]
		},
		{
			"key": "z",
			"name": "Toggle zen mode",
			"type": "command",
			"command": "workbench.action.toggleZenMode"
		}
	],
	"files.autoSave": "afterDelay",
	"git.autofetch": true
	};

	// Apply each setting
	for (const [key, value] of Object.entries(customSettings)) {
		await config.update(key, value, vscode.ConfigurationTarget.Global);
	}

	vscode.window.showInformationMessage('Custom settings applied! Please ensure the custom fonts are installed on your system. Check the README for instructions.');

	// Attempt to install required extensions
	try {
		await vscode.commands.executeCommand('workbench.extensions.installExtension', 'aura-theme.aura-theme');
		await vscode.commands.executeCommand('workbench.extensions.installExtension', 'moxer-icons.moxer-icons');
		vscode.window.showInformationMessage('Custom settings applied and required extensions installed!');
	} catch {
		vscode.window.showErrorMessage('Failed to install required extensions. Please install them manually.');
	}
}

export async function activate(context) {
	// This function is called when your extension is activated
	try {
		await applyCustomSettings();
		await installFonts();
	} catch (error) {
		vscode.window.showErrorMessage('Failed to apply custom settings or install fonts: ' + error.message);
	}

	// Register the applySettings command
	const applySettingsCommand = vscode.commands.registerCommand('extension.applyCustomSettings', applyCustomSettings);
	context.subscriptions.push(applySettingsCommand);

	// Register the installFonts command
	const installFontsCommand = vscode.commands.registerCommand('extension.installFonts', installFonts);
	context.subscriptions.push(installFontsCommand);
}

export function deactivate() {}