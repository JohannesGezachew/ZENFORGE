import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const AURA_THEME_ID = 'aura-theme.aura-theme';
const MOXER_ICONS_ID = 'moxer-icons.moxer-icons';
const AURA_THEME_NAME = 'Aura Dark'; // This should match the theme name exactly as it appears in VS Code
const MOXER_ICONS_NAME = 'moxer-icons'; // This should match the icon theme name

// Define ZenForge custom settings at a higher scope
const ZENFORGE_CUSTOM_SETTINGS = {
	// --- Editor ---
	"editor.fontLigatures": true, // Enable font ligatures for clean, connected code symbols
	"editor.formatOnSave": true, // Automatically format code on save
	"editor.lineNumbers": "on", // Display line numbers in the editor
	"editor.minimap.enabled": false, // Disable minimap for a cleaner view and minor performance gain
	"editor.wordWrap": "on", // Wrap long lines of code in the editor
	"editor.cursorBlinking": "smooth", // Enable smooth blinking for the cursor
	"editor.cursorSmoothCaretAnimation": "on", // Enable smooth cursor animation when moving
	"editor.accessibilitySupport": "off", // Disable accessibility support to improve performance (use with caution)
	"editor.semanticHighlighting.enabled": true, // Enable semantic highlighting for better readability
	"editor.bracketPairColorization.enabled": true, // Colorize matching brackets for better navigation
	"editor.guides.bracketPairs": "active", // Show active bracket pair guides
	"editor.folding": false, // Disable code folding to keep everything expanded
	"editor.glyphMargin": false, // Remove glyph margin for a cleaner code area
	"editor.renderWhitespace": "none", // Don’t render whitespace characters
	"editor.renderControlCharacters": false, // Don’t render control characters
	"editor.hideCursorInOverviewRuler": true, // Hide the cursor in the overview ruler
	"editor.overviewRulerBorder": false, // Remove the overview ruler border
	"editor.tabSize": 2, // Set tab size to 2 spaces
	"editor.linkedEditing": true, // Enable linked editing for HTML/XML tags, etc.
	"editor.scrollbar.vertical": "auto",
	"editor.scrollbar.horizontal": "auto",

	// --- Fonts ---
	// Note: These are the primary font settings. Specific applications (terminal, debug, etc.) have their own overrides below.
	"editor.fontFamily": "Geist Mono",
	"editor.fontSize": 12,
	"editor.inlayHints.fontFamily": "Geist Mono", // Ensure inlay hints match editor font
	"editor.codeLensFontFamily": "Geist Mono", // Ensure code lens fonts match

	// --- Workbench ---
	"workbench.statusBar.visible": false, // Hide the status bar for a more focused UI
	"workbench.layoutControl.enabled": false, // Disable the layout control feature in the workbench
	"workbench.sideBar.location": "left", // Position the sidebar on the left side
	"workbench.activityBar.location": "top", // Position activity bar to top for a cleaner vertical space (alternative to hiding)
	"workbench.settings.editor": "json", // Prefer JSON editor for settings
	"workbench.startupEditor": "none", // Don't open any default editor on startup

	// --- Theme & Icons ---
	"workbench.colorTheme": "Aura Dark", // Default ZenForge theme
	"workbench.iconTheme": "moxer-icons", // Default ZenForge icons
	"workbench.colorCustomizations": { // Specific Aura theme tweaks for a more unified ZenForge look
		"[Aura Dark]": {
			"editor.background": "#110f17",
			"terminal.background": "#110f17",
			"activityBar.background": "#110f17",
			"statusBar.background": "#110f17", // Though statusbar is hidden, this ensures consistency if shown
			"editorGroupHeader.tabsBackground": "#110f17",
			"tab.inactiveBackground": "#110f17"
		}
	},

	// --- Window ---
	"window.titleBarStyle": "custom", // Custom title bar (especially useful for Linux)
	"window.zoomLevel": 0, // Default zoom level
	"window.commandCenter": false, // Disable the command center for a cleaner window

	// --- Explorer ---
	"explorer.confirmDragAndDrop": false, // Disable drag and drop confirmation
	"explorer.confirmDelete": false, // Disable delete confirmation
	"explorer.confirmsPasteNative": false, // Disable paste confirmation for native file operations
	"explorer.openEditors.visible": 0, // Hide the "Open Editors" section
	"explorer.compactFolders": false, // Show full folder structure

	// --- Breadcrumbs ---
	"breadcrumbs.enabled": false, // Disable breadcrumbs for a cleaner editor UI
	"breadcrumbs.filePath": "off", // Don't show file path in breadcrumbs if they were enabled

	// --- Files ---
	"files.trimTrailingWhitespace": true, // Trim trailing whitespace on save
	"[markdown]": { // Keep trailing whitespace for markdown, as it can be significant
		"files.trimTrailingWhitespace": false
	},
	"files.autoSave": "afterDelay", // Autosave with a delay

	// --- Git ---
	"git.autofetch": true, // Automatically fetch from remotes

	// --- Terminal ---
	"terminal.integrated.fontFamily": "JetBrainsMono Nerd Font",
	"terminal.integrated.fontSize": 12,

	// --- SCM (Source Control Management) ---
	"scm.inputFontFamily": "Geist Mono", // Font for SCM input box

	// --- Debug ---
	"debug.console.fontFamily": "Geist Mono", // Font for debug console

	// --- Chat ---
	"chat.editor.fontFamily": "Geist Mono", // Font for chat editor (e.g., Copilot chat)

	// --- Notebook ---
	"notebook.output.fontFamily": "Geist Mono", // Font for notebook outputs

	// --- Markdown ---
	"markdown.preview.fontFamily": "Geist Mono", // Font for markdown preview

	// --- Neovim (Conditionally Applied by ZenForge settings) ---
	"vscode-neovim.neovimExecutablePaths.darwin": "/opt/homebrew/bin/nvim", // Example path for macOS
	"vscode-neovim.neovimInitVimPaths.darwin": "$HOME/.config/nvim-vscode/init.vim", // Example init path
	"extensions.experimental.affinity": { // Recommended for Neovim extension performance
		"asvetliakov.vscode-neovim": 1
	},

	// --- WhichKey (Conditionally Applied by ZenForge settings) ---
	"whichkey.sortOrder": "alphabetically",
	"whichkey.delay": 0, // No delay for which-key to appear
	"whichkey.bindings": [ // Example which-key bindings, can be extensive
		{ "key": "w", "name": "Save file", "type": "command", "command": "workbench.action.files.save" },
		{ "key": "q", "name": "Close file", "type": "command", "command": "workbench.action.closeActiveEditor" },
		{ "key": ";", "name": "commands", "type": "command", "command": "workbench.action.showCommands" },
		{ "key": "/", "name": "comment", "type": "command", "command": "vscode-neovim.send", "args": "<C-/>" },
		{ "key": "?", "name": "View All References", "type": "command", "command": "references-view.find", "when": "editorHasReferenceProvider" },
		{ "key": "b", "name": "Buffers/Editors...", "type": "bindings", "bindings": [
				{ "key": "b", "name": "Show all buffers/editors", "type": "command", "command": "workbench.action.showAllEditors" },
				{ "key": "d", "name": "Close active editor", "type": "command", "command": "workbench.action.closeActiveEditor" },
				{ "key": "h", "name": "Move editor into left group", "type": "command", "command": "workbench.action.moveEditorToLeftGroup" },
				{ "key": "j", "name": "Move editor into below group", "type": "command", "command": "workbench.action.moveEditorToBelowGroup" },
				{ "key": "k", "name": "Move editor into above group", "type": "command", "command": "workbench.action.moveEditorToAboveGroup" },
				{ "key": "l", "name": "Move editor into right group", "type": "command", "command": "workbench.action.moveEditorToRightGroup" },
				{ "key": "m", "name": "Close other editors", "type": "command", "command": "workbench.action.closeOtherEditors" },
				{ "key": "n", "name": "Next editor", "type": "command", "command": "workbench.action.nextEditor" },
				{ "key": "p", "name": "Previous editor", "type": "command", "command": "workbench.action.previousEditor" },
				{ "key": "N", "name": "New untitled editor", "type": "command", "command": "workbench.action.files.newUntitledFile" },
				{ "key": "u", "name": "Reopen closed editor", "type": "command", "command": "workbench.action.reopenClosedEditor" },
				{ "key": "y", "name": "Copy buffer to clipboard", "type": "commands", "commands": ["editor.action.selectAll", "editor.action.clipboardCopyAction", "cancelSelection"] }
			]},
		{ "key": "d", "name": "Debug...", "type": "bindings", "bindings": [
				{ "key": "d", "name": "Start debug", "type": "command", "command": "workbench.action.debug.start" },
				{ "key": "S", "name": "Stop debug", "type": "command", "command": "workbench.action.debug.stop" },
				{ "key": "c", "name": "Continue debug", "type": "command", "command": "workbench.action.debug.continue" },
				{ "key": "p", "name": "Pause debug", "type": "command", "command": "workbench.action.debug.pause" },
				{ "key": "r", "name": "Run without debugging", "type": "command", "command": "workbench.action.debug.run" },
				{ "key": "R", "name": "Restart ebug", "type": "command", "command": "workbench.action.debug.restart" },
				{ "key": "i", "name": "Step into", "type": "command", "command": "workbench.action.debug.stepInto" },
				{ "key": "s", "name": "Step over", "type": "command", "command": "workbench.action.debug.stepOver" },
				{ "key": "o", "name": "Step out", "type": "command", "command": "workbench.action.debug.stepOut" },
				{ "key": "b", "name": "Toggle breakpoint", "type": "command", "command": "editor.debug.action.toggleBreakpoint" },
				{ "key": "B", "name": "Toggle inline breakpoint", "type": "command", "command": "editor.debug.action.toggleInlineBreakpoint" },
				{ "key": "j", "name": "Jump to cursor", "type": "command", "command": "debug.jumpToCursor" },
				{ "key": "v", "name": "REPL", "type": "command", "command": "workbench.debug.action.toggleRepl" },
				{ "key": "w", "name": "Focus on watch window", "type": "command", "command": "workbench.debug.action.focusWatchView" },
				{ "key": "W", "name": "Add to watch", "type": "command", "command": "editor.debug.action.selectionToWatch" }
			]},
		{ "key": "e", "name": "Toggle Explorer", "type": "command", "command": "workbench.action.toggleSidebarVisibility" },
		{ "key": "f", "name": "Find & Replace...", "type": "bindings", "bindings": [
				{ "key": "f", "name": "File", "type": "command", "command": "editor.action.startFindReplaceAction" },
				{ "key": "s", "name": "Symbol", "type": "command", "command": "editor.action.rename", "when": "editorHasRenameProvider && editorTextFocus && !editorReadonly" },
				{ "key": "p", "name": "Project", "type": "command", "command": "workbench.action.replaceInFiles" }
			]},
		{ "key": "g", "name": "Git...", "type": "bindings", "bindings": [
				{ "key": "/", "name": "Search Commits", "command": "gitlens.showCommitSearch", "type": "command", "when": "gitlens:enabled && config.gitlens.keymap == 'alternate'" },
				{ "key": "a", "name": "Stage", "type": "command", "command": "git.stage" },
				{ "key": "b", "name": "Checkout", "type": "command", "command": "git.checkout" },
				{ "key": "B", "name": "Browse", "type": "command", "command": "gitlens.openFileInRemote" },
				{ "key": "c", "name": "Commit", "type": "command", "command": "git.commit" },
				{ "key": "C", "name": "Cherry Pick", "type": "command", "command": "gitlens.views.cherryPick" },
				{ "key": "d", "name": "Delete Branch", "type": "command", "command": "git.deleteBranch" },
				{ "key": "f", "name": "Fetch", "type": "command", "command": "git.fetch" },
				{ "key": "F", "name": "Pull From", "type": "command", "command": "git.pullFrom" },
				{ "key": "g", "name": "Graph", "type": "command", "command": "git-graph.view" },
				{ "key": "h", "name": "Heatmap", "type": "command", "command": "gitlens.toggleFileHeatmap" },
				{ "key": "H", "name": "History", "type": "command", "command": "git.viewFileHistory" },
				{ "key": "i", "name": "Init", "type": "command", "command": "git.init" },
				{ "key": "j", "name": "Next Change", "type": "command", "command": "workbench.action.editor.nextChange" },
				{ "key": "k", "name": "Previous Change", "type": "command", "command": "workbench.action.editor.previousChange" },
				{ "key": "l", "name": "Toggle Line Blame", "type": "command", "command": "gitlens.toggleLineBlame", "when": "editorTextFocus && gitlens:canToggleCodeLens && gitlens:enabled && config.gitlens.keymap == 'alternate'" },
				{ "key": "L", "name": "Toggle GitLens", "type": "command", "command": "gitlens.toggleCodeLens", "when": "editorTextFocus && gitlens:canToggleCodeLens && gitlens:enabled && config.gitlens.keymap == 'alternate'" },
				{ "key": "m", "name": "Merge", "type": "command", "command": "git.merge" },
				{ "key": "p", "name": "Push", "type": "command", "command": "git.push" },
				{ "key": "P", "name": "Pull", "type": "command", "command": "git.pull" },
				{ "key": "s", "name": "Stash", "type": "command", "command": "workbench.view.scm" },
				{ "key": "S", "name": "Status", "type": "command", "command": "gitlens.showQuickRepoStatus", "when": "gitlens:enabled && config.gitlens.keymap == 'alternate'" },
				{ "key": "t", "name": "Create Tag", "type": "command", "command": "git.createTag" },
				{ "key": "T", "name": "Delete Tag", "type": "command", "command": "git.deleteTag" },
				{ "key": "U", "name": "Unstage", "type": "command", "command": "git.unstage" }
			]},
		{ "key": "h", "name": "Split Horizontal", "type": "command", "command": "workbench.action.splitEditorDown" },
		{ "key": "i", "name": "Insert...", "type": "bindings", "bindings": [
				{ "key": "j", "name": "Insert line below", "type": "command", "command": "editor.action.insertLineAfter" },
				{ "key": "k", "name": "Insert line above", "type": "command", "command": "editor.action.insertLineBefore" },
				{ "key": "s", "name": "Insert snippet", "type": "command", "command": "editor.action.insertSnippet" }
			]},
		{ "key": "l", "name": "LSP...", "type": "bindings", "bindings": [
				{ "key": ";", "name": "Refactor", "type": "command", "command": "editor.action.refactor", "when": "editorHasCodeActionsProvider && editorTextFocus && !editorReadonly" },
				{ "key": "a", "name": "Auto Fix", "type": "command", "command": "editor.action.autoFix", "when": "editorTextFocus && !editorReadonly && supportedCodeAction =~ /(\\s|^)quickfix\\b/" },
				{ "key": "d", "name": "Definition", "type": "command", "command": "editor.action.revealDefinition", "when": "editorHasDefinitionProvider && editorTextFocus && !isInEmbeddedEditor" },
				{ "key": "D", "name": "Declaration", "type": "command", "command": "editor.action.revealDeclaration" },
				{ "key": "e", "name": "Errors", "type": "command", "command": "workbench.actions.view.problems" },
				{ "key": "f", "name": "Format", "type": "command", "command": "editor.action.formatDocument", "when": "editorHasDocumentFormattingProvider && editorHasDocumentFormattingProvider && editorTextFocus && !editorReadonly && !inCompositeEditor" },
				{ "key": "i", "name": "Implementation", "type": "command", "command": "editor.action.goToImplementation", "when": "editorHasImplementationProvider && editorTextFocus && !isInEmbeddedEditor" },
				{ "key": "l", "name": "Code Lens", "type": "command", "command": "codelens.showLensesInCurrentLine" },
				{ "key": "n", "name": "Next Problem", "type": "command", "command": "editor.action.marker.next", "when": "editorFocus" },
				{ "key": "N", "name": "Next Problem (Proj)", "type": "command", "command": "editor.action.marker.nextInFiles", "when": "editorFocus" },
				{ "key": "o", "name": "Outline", "type": "command", "command": "outline.focus" },
				{ "key": "p", "name": "Prev Problem", "type": "command", "command": "editor.action.marker.prevInFiles", "when": "editorFocus" },
				{ "key": "P", "name": "Prev Problem (Proj)", "type": "command", "command": "editor.action.marker.prev", "when": "editorFocus" },
				{ "key": "q", "name": "Quick Fix", "type": "command", "command": "editor.action.quickFix", "when": "editorHasCodeActionsProvider && editorTextFocus && !editorReadonly" },
				{ "key": "r", "name": "References", "type": "command", "command": "editor.action.goToReferences", "when": "editorHasReferenceProvider && editorTextFocus && !inReferenceSearchEditor && !isInEmbeddedEditor" },
				{ "key": "R", "name": "Rename", "type": "command", "command": "editor.action.rename", "when": "editorHasRenameProvider && editorTextFocus && !editorReadonly" },
				{ "key": "v", "name": "View All References", "type": "command", "command": "references-view.find", "when": "editorHasReferenceProvider" },
				{ "key": "s", "name": "Go To Symbol", "type": "command", "command": "workbench.action.gotoSymbol" },
				{ "key": "S", "name": "Show All Symbols", "type": "command", "command": "workbench.action.showAllSymbols" }
			]},
		{ "key": "m", "name": "Mark...", "type": "bindings", "bindings": [
				{ "key": "c", "name": "Clear Bookmarks", "type": "command", "command": "bookmarks.clear" },
				{ "key": "j", "name": "Next Bookmark", "type": "command", "command": "bookmarks.jumpToNext", "when": "editorTextFocus" },
				{ "key": "k", "name": "Previous Bookmark", "type": "command", "command": "bookmarks.jumpToPrevious", "when": "editorTextFocus" },
				{ "key": "l", "name": "List Bookmarks", "type": "command", "command": "bookmarks.listFromAllFiles", "when": "editorTextFocus" },
				{ "key": "r", "name": "Refresh Bookmarks", "type": "command", "command": "bookmarks.refresh" },
				{ "key": "t", "name": "Toggle Bookmark", "type": "command", "command": "bookmarks.toggle", "when": "editorTextFocus" },
				{ "key": "s", "name": "Show Bookmarks", "type": "command", "command": "workbench.view.extension.bookmarks" }
			]},
		{ "key": "M", "name": "Minimap", "type": "command", "command": "editor.action.toggleMinimap" },
		{ "key": "n", "name": "No Highlight", "type": "command", "command": "vscode-neovim.send", "args": ":noh<CR>" },
		{ "key": "o", "name": "Open...", "type": "bindings", "bindings": [
				{ "key": "d", "name": "Directory", "type": "command", "command": "workbench.action.files.openFolder" },
				{ "key": "r", "name": "Recent", "type": "command", "command": "workbench.action.openRecent" },
				{ "key": "f", "name": "File", "type": "command", "command": "workbench.action.files.openFile" }
			]},
		{ "key": "p", "name": "Peek...", "type": "bindings", "bindings": [
				{ "key": "d", "name": "Definition", "type": "command", "command": "editor.action.peekDefinition", "when": "editorHasDefinitionProvider && editorTextFocus && !inReferenceSearchEditor && !isInEmbeddedEditor" },
				{ "key": "D", "name": "Declaration", "type": "command", "command": "editor.action.peekDeclaration" },
				{ "key": "i", "name": "Implementation", "type": "command", "command": "editor.action.peekImplementation", "when": "editorHasImplementationProvider && editorTextFocus && !inReferenceSearchEditor && !isInEmbeddedEditor" },
				{ "key": "p", "name": "Toggle Focus", "type": "command", "command": "togglePeekWidgetFocus", "when": "inReferenceSearchEditor || referenceSearchVisible" },
				{ "key": "r", "name": "References", "type": "command", "command": "editor.action.referenceSearch.trigger" },
				{ "key": "t", "name": "Type Definition", "type": "command", "command": "editor.action.peekTypeDefinition" }
			]},
		{ "key": "s", "name": "Search...", "type": "bindings", "bindings": [
				{ "key": "f", "name": "Files", "type": "command", "command": "workbench.action.quickOpen" },
				{ "key": "t", "name": "Text", "type": "command", "command": "workbench.action.findInFiles" }
			]},
		{ "key": "S", "name": "Show...", "type": "bindings", "bindings": [
				{ "key": "e", "name": "Show explorer", "type": "command", "command": "workbench.view.explorer" },
				{ "key": "s", "name": "Show search", "type": "command", "command": "workbench.view.search" },
				{ "key": "g", "name": "Show source control", "type": "command", "command": "workbench.view.scm" },
				{ "key": "t", "name": "Show test", "type": "command", "command": "workbench.view.extension.test" },
				{ "key": "r", "name": "Show remote explorer", "type": "command", "command": "workbench.view.remote" },
				{ "key": "x", "name": "Show extensions", "type": "command", "command": "workbench.view.extensions" },
				{ "key": "p", "name": "Show problem", "type": "command", "command": "workbench.actions.view.problems" },
				{ "key": "o", "name": "Show output", "type": "command", "command": "workbench.action.output.toggleOutput" },
				{ "key": "d", "name": "Show debug console", "type": "command", "command": "workbench.debug.action.toggleRepl" }
			]},
		{ "key": "t", "name": "Terminal...", "type": "bindings", "bindings": [
				{ "key": "t", "name": "Toggle Terminal", "type": "command", "command": "workbench.action.togglePanel" },
				{ "key": "T", "name": "Focus Terminal", "type": "command", "command": "workbench.action.terminal.toggleTerminal", "when": "!terminalFocus" }
			]},
		{ "key": "u", "name": "UI toggles...", "type": "bindings", "bindings": [
				{ "key": "a", "name": "Toggle tool/activity bar visibility", "type": "command", "command": "workbench.action.toggleActivityBarVisibility" },
				{ "key": "b", "name": "Toggle side bar visibility", "type": "command", "command": "workbench.action.toggleSidebarVisibility" },
				{ "key": "j", "name": "Toggle panel visibility", "type": "command", "command": "workbench.action.togglePanel" },
				{ "key": "F", "name": "Toggle full screen", "type": "command", "command": "workbench.action.toggleFullScreen" },
				{ "key": "s", "name": "Select theme", "type": "command", "command": "workbench.action.selectTheme" },
				{ "key": "m", "name": "Toggle maximized panel", "type": "command", "command": "workbench.action.toggleMaximizedPanel" },
				{ "key": "T", "name": "Toggle tab visibility", "type": "command", "command": "workbench.action.toggleTabsVisibility" }
			]},
		{ "key": "v", "name": "Split Vertical", "type": "command", "command": "workbench.action.splitEditor" },
		{ "key": "w", "name": "Window...", "type": "bindings", "bindings": [
				{ "key": "W", "name": "Focus previous editor group", "type": "command", "command": "workbench.action.focusPreviousGroup" },
				{ "key": "h", "name": "Move editor group left", "type": "command", "command": "workbench.action.moveActiveEditorGroupLeft" },
				{ "key": "j", "name": "Move editor group down", "type": "command", "command": "workbench.action.moveActiveEditorGroupDown" },
				{ "key": "k", "name": "Move editor group up", "type": "command", "command": "workbench.action.moveActiveEditorGroupUp" },
				{ "key": "l", "name": "Move editor group right", "type": "command", "command": "workbench.action.moveActiveEditorGroupRight" },
				{ "key": "t", "name": "Toggle editor group sizes", "type": "command", "command": "workbench.action.toggleEditorWidths" },
				{ "key": "m", "name": "Maximize editor group", "type": "command", "command": "workbench.action.minimizeOtherEditors" },
				{ "key": "M", "name": "Maximize editor group and hide side bar", "type": "command", "command": "workbench.action.maximizeEditor" },
				{ "key": "=", "name": "Reset editor group sizes", "type": "command", "command": "workbench.action.evenEditorWidths" },
				{ "key": "z", "name": "Combine all editors", "type": "command", "command": "workbench.action.joinAllGroups" },
				{ "key": "d", "name": "Close editor group", "type": "command", "command": "workbench.action.closeEditorsInGroup" },
				{ "key": "x", "name": "Close all editor groups", "type": "command", "command": "workbench.action.closeAllGroups" }
			]},
		{ "key": "x", "name": "Extensions", "type": "command", "command": "workbench.view.extensions" },
		{ "key": "y", "name": "Sync...", "type": "bindings", "bindings": [
				{ "key": "d", "name": "Download Settings", "type": "command", "command": "extension.downloadSettings" },
				{ "key": "u", "name": "Upload Settings", "type": "command", "command": "extension.updateSettings" }
			]},
		{ "key": "z", "name": "Toggle zen mode", "type": "command", "command": "workbench.action.toggleZenMode" }
	],
	"files.autoSave": "afterDelay",
	"git.autofetch": true
};

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

		let fontFiles = fs.readdirSync(fontSourcePath);
		console.log('Raw files found in fonts directory:', fontFiles);

		// Filter for .ttf and .otf font files only
		fontFiles = fontFiles.filter(file => {
			const lowerCaseFile = file.toLowerCase();
			return lowerCaseFile.endsWith('.ttf') || lowerCaseFile.endsWith('.otf');
		});

		console.log('Filtered font files to install:', fontFiles);

		if (fontFiles.length === 0) {
			vscode.window.showInformationMessage('No .ttf or .otf font files found in the extension\'s fonts directory to install.');
			return;
		}

		let allFontsInstalledSuccessfully = true;
		let successfullyInstalledCount = 0;

		fontFiles.forEach(file => {
			const sourceFile = path.join(fontSourcePath, file);
			const destinationFile = path.join(fontDestinationPath, file);
			console.log(`Attempting to copy font: ${sourceFile} to ${destinationFile}`);
			try {
				fs.copyFileSync(sourceFile, destinationFile);
				console.log(`Successfully copied: ${file} to ${destinationFile}`);
				successfullyInstalledCount++;
			} catch (fileCopyError) {
				allFontsInstalledSuccessfully = false;
				console.error(`Failed to copy font: ${file}. Error:`, fileCopyError);
				vscode.window.showErrorMessage(`Failed to install font: ${file}. Error: ${fileCopyError.message}`);
				// Continue to next file
			}
		});

		if (allFontsInstalledSuccessfully && fontFiles.length > 0) {
			vscode.window.showInformationMessage(`All ${fontFiles.length} ZenForge fonts installed successfully.`);
		} else if (successfullyInstalledCount > 0) {
			vscode.window.showInformationMessage(`${successfullyInstalledCount} ZenForge font(s) installed. Some fonts failed to install. Check error notifications or console for details.`);
		} else if (fontFiles.length > 0) { // All failed
			vscode.window.showErrorMessage('ZenForge: Failed to install any fonts. Check error notifications or console for details.');
		}
		// If fontFiles.length was 0, message already shown.

	} catch (error) {
		console.error('Overall error in installFonts:', error);
		vscode.window.showErrorMessage('Failed to install ZenForge fonts: ' + error.message);
	}
}

// Helper function to ensure extensions are installed
async function ensureExtensionsInstalled(extensionIds) {
	const installationStatus = {};
	for (const extId of extensionIds) {
		const extension = vscode.extensions.getExtension(extId);
		if (extension) {
			console.log(`ZenForge: Extension ${extId} is already installed.`);
			installationStatus[extId] = true;
		} else {
			console.log(`ZenForge: Extension ${extId} not found. Attempting to install...`);
			try {
				await vscode.commands.executeCommand('workbench.extensions.installExtension', extId);
				console.log(`ZenForge: Extension ${extId} installed successfully.`);
				installationStatus[extId] = true;
			} catch (error) {
				console.error(`ZenForge: Failed to install extension ${extId}. Error:`, error);
				installationStatus[extId] = false;
			}
		}
	}
	return installationStatus;
}


// Function to handle the actual settings application
async function applySettingsAndInstallFonts() {
	const config = vscode.workspace.getConfiguration();
	const zenForgeConfig = vscode.workspace.getConfiguration('zenforge');
	const applyNeovimSettings = zenForgeConfig.get('applyNeovimSettings', false);

	// Create a mutable copy of settings to potentially filter
	let settingsToApply = { ...ZENFORGE_CUSTOM_SETTINGS };

	// Conditionally remove Neovim settings
	if (!applyNeovimSettings) {
		const filteredSettings = {};
		for (const key in settingsToApply) {
			if (!key.startsWith('vscode-neovim.') && !key.startsWith('whichkey.')) {
				filteredSettings[key] = settingsToApply[key];
			}
		}
		settingsToApply = filteredSettings;
	}

	// Separate theme and icon settings
	const themeSetting = settingsToApply['workbench.colorTheme'];
	const iconThemeSetting = settingsToApply['workbench.iconTheme'];
	delete settingsToApply['workbench.colorTheme'];
	delete settingsToApply['workbench.iconTheme'];

	let generalSettingsApplied = false;
	try {
		// Apply general settings (excluding theme and icons)
		for (const [key, value] of Object.entries(settingsToApply)) {
			await config.update(key, value, vscode.ConfigurationTarget.Global);
		}
		generalSettingsApplied = true;
		console.log('ZenForge: General custom settings applied.');
	} catch (error) {
		console.error('ZenForge: Failed to apply general settings:', error);
		vscode.window.showErrorMessage('ZenForge: Failed to apply some general settings. Check console for details.');
	}

	// Ensure theme and icon extensions are installed
	const extensionInstallStats = await ensureExtensionsInstalled([AURA_THEME_ID, MOXER_ICONS_ID]);

	let themeApplied = false;
	let iconThemeApplied = false;

	// Apply Aura Theme if present
	if (extensionInstallStats[AURA_THEME_ID]) {
		if (themeSetting) { // Check if themeSetting was defined in ZENFORGE_CUSTOM_SETTINGS
			try {
				await config.update('workbench.colorTheme', AURA_THEME_NAME, vscode.ConfigurationTarget.Global);
				themeApplied = true;
				console.log(`ZenForge: Color theme '${AURA_THEME_NAME}' applied.`);
			} catch (error) {
				console.error(`ZenForge: Failed to apply color theme '${AURA_THEME_NAME}':`, error);
				vscode.window.showErrorMessage(`ZenForge: Failed to apply color theme '${AURA_THEME_NAME}'.`);
			}
		}
	} else {
		vscode.window.showWarningMessage(`ZenForge: Aura theme extension (${AURA_THEME_ID}) not found and could not be installed. Please install it manually to use the Aura theme.`);
	}

	// Apply Moxer Icons if present
	if (extensionInstallStats[MOXER_ICONS_ID]) {
		if (iconThemeSetting) { // Check if iconThemeSetting was defined in ZENFORGE_CUSTOM_SETTINGS
			try {
				await config.update('workbench.iconTheme', MOXER_ICONS_NAME, vscode.ConfigurationTarget.Global);
				iconThemeApplied = true;
				console.log(`ZenForge: Icon theme '${MOXER_ICONS_NAME}' applied.`);
			} catch (error) {
				console.error(`ZenForge: Failed to apply icon theme '${MOXER_ICONS_NAME}':`, error);
				vscode.window.showErrorMessage(`ZenForge: Failed to apply icon theme '${MOXER_ICONS_NAME}'.`);
			}
		}
	} else {
		vscode.window.showWarningMessage(`ZenForge: Moxer icons extension (${MOXER_ICONS_ID}) not found and could not be installed. Please install it manually to use Moxer icons.`);
	}

	// Final user message
	if (generalSettingsApplied) {
		let message = 'ZenForge: General settings applied. ';
		if (themeSetting && themeApplied) message += `Aura theme applied. `;
		else if (themeSetting && !themeApplied) message += `Aura theme NOT applied (extension missing). `;
		
		if (iconThemeSetting && iconThemeApplied) message += `Moxer icons applied.`;
		else if (iconThemeSetting && !iconThemeApplied) message += `Moxer icons NOT applied (extension missing).`;
		
		vscode.window.showInformationMessage(message.trim() + " Font installation will proceed if consented.");
	} else {
		vscode.window.showErrorMessage('ZenForge: Failed to apply general settings. Theme and icon settings status reported separately.');
	}
}


async function backupUserSettings(settingsKeys, context) {
	const backedUpSettings = {};
	const config = vscode.workspace.getConfiguration();

	for (const key of settingsKeys) {
		const inspection = config.inspect(key);
		if (inspection) {
			// Prioritize globalValue, then workspaceValue, then defaultValue
			// We only backup if there's an explicit user setting (global or workspace)
			if (inspection.globalValue !== undefined) {
				backedUpSettings[key] = inspection.globalValue;
			} else if (inspection.workspaceValue !== undefined) {
				backedUpSettings[key] = inspection.workspaceValue;
			}
			// If neither globalValue nor workspaceValue is set, we don't back up the default value,
			// as restoring 'undefined' would effectively apply the default.
		}
	}

	if (Object.keys(backedUpSettings).length > 0) {
		await context.globalState.update('zenforge.userSettingBackup', backedUpSettings);
		vscode.window.showInformationMessage('ZenForge: User settings backed up.');
	} else {
		// If no user-defined settings for ZenForge keys were found, remove any old backup.
		await context.globalState.update('zenforge.userSettingBackup', undefined);
	}
}


async function restoreBackedUpSettings(context) {
	const backedUpSettings = context.globalState.get('zenforge.userSettingBackup');

	if (!backedUpSettings || Object.keys(backedUpSettings).length === 0) {
		vscode.window.showErrorMessage('No ZenForge settings backup found.');
		return;
	}

	const userChoice = await vscode.window.showInformationMessage(
		'Are you sure you want to restore your previous settings? This will overwrite any changes made by ZenForge or since ZenForge was applied.',
		{ modal: true },
		'Restore Settings',
		'Cancel'
	);

	if (userChoice === 'Restore Settings') {
		const config = vscode.workspace.getConfiguration();
		try {
			for (const [key, value] of Object.entries(backedUpSettings)) {
				await config.update(key, value, vscode.ConfigurationTarget.Global);
			}
			vscode.window.showInformationMessage('ZenForge: Settings restored successfully.');
			// Keeping the backup as per instruction for now.
			// await context.globalState.update('zenforge.userSettingBackup', undefined); // Optionally clear backup
		} catch (error) {
			vscode.window.showErrorMessage('Failed to restore ZenForge settings: ' + error.message);
		}
	}
}


async function requestConsentAndApplySettings(context) {
	// const settingsAppliedPreviously = context.globalState.get('zenforge.settingsAppliedPreviously');

	// For this iteration, always show the consent dialog as per instructions.
	// Later, this could be: if (!settingsAppliedPreviously) { ... }
	const userChoice = await vscode.window.showInformationMessage(
		'ZenForge will make significant changes to your VS Code settings (themes, fonts, UI preferences, etc.). Do you want to apply these settings?',
		{ modal: true }, // Makes the dialog modal
		'Apply ZenForge Settings',
		'Cancel'
	);

	if (userChoice === 'Apply ZenForge Settings') {
		try {
			// Backup existing user settings for the keys ZenForge will modify
			await backupUserSettings(Object.keys(ZENFORGE_CUSTOM_SETTINGS), context);

			await applySettingsAndInstallFonts(); // This function now handles settings and tries to install extensions
			await installFonts(); // Install fonts separately
			// await context.globalState.update('zenforge.settingsAppliedPreviously', true); // Flag that initial setup was done
			vscode.window.showInformationMessage('ZenForge settings have been applied.');
		} catch (error) {
			vscode.window.showErrorMessage('Failed to apply ZenForge settings or install fonts: ' + error.message);
		}
	} else {
		vscode.window.showInformationMessage('ZenForge settings were not applied.');
	}
}

export async function activate(context) {
	// This function is called when your extension is activated
	// Show consent dialog and apply settings if consented
	await requestConsentAndApplySettings(context);

	// Register the applySettings command to re-trigger the consent flow
	const applySettingsCommand = vscode.commands.registerCommand('extension.applyCustomSettings', () => {
		requestConsentAndApplySettings(context);
	});
	context.subscriptions.push(applySettingsCommand);

	// Register the installFonts command - this can be called independently if needed,
	// but primary font installation happens after consent.
	const installFontsCommand = vscode.commands.registerCommand('extension.installFonts', installFonts);
	context.subscriptions.push(installFontsCommand);

	// Register the restoreBackedUpSettings command
	const restoreCommand = vscode.commands.registerCommand('zenforge.restoreBackedUpSettings', () => {
		restoreBackedUpSettings(context);
	});
	context.subscriptions.push(restoreCommand);
}

export function deactivate() {}

// At the end of extension.js, for testing only:
/* istanbul ignore if */ // To tell coverage tools to ignore this
if (process.env.NODE_ENV === 'test') {
  module.exports = {
    installFonts,
    backupUserSettings,
    ZENFORGE_CUSTOM_SETTINGS
  };
}