# ZenForge

ZenForge is a Visual Studio Code extension designed to enhance your coding experience by transforming your editor into a focused, distraction-free environment with custom themes, icons, and optimized settings.

## Features

- **Automated Setup**: Applies a curated set of UI and editor settings upon user consent to optimize VS Code for focus and aesthetics.
- **Aura Theme & Moxer Icons**: Automatically attempts to install and apply the "Aura Dark" theme and "Moxer Icons" for a cohesive and visually appealing coding environment.
- **Automatic Font Installation**: Installs "Geist Mono" (primary editor font) and "JetBrains Mono Nerd Font" (for the integrated terminal) to user-specific font directories.
- **Neovim Configuration (Optional)**: Includes specific settings for users of the VSCode Neovim extension, which can be enabled via a setting.
- **Settings Backup & Restore**: Backs up your original user settings before ZenForge applies its customizations, allowing you to restore them easily.

## Requirements

- Visual Studio Code version 1.60.0 or higher.
- Internet connection (required for the initial download of theme/icon extensions if not already installed).

## Installation

1.  Install the ZenForge extension from the VS Code Marketplace.
2.  Upon activation, ZenForge will prompt you for consent to apply its settings.

## Automatic Configuration

Upon activation (e.g., when VS Code starts or when the "ZenForge: Apply Custom Settings" command is triggered manually), ZenForge will prompt you for consent to apply its comprehensive suite of settings. These settings aim to create a distraction-free, aesthetically pleasing coding environment.

This includes:
- Applying the "Aura Dark" theme and "Moxer Icons" (attempting to install them if they are missing).
- Installing and applying custom fonts: "Geist Mono" for the editor and "JetBrains Mono Nerd Font" for the integrated terminal.
- Various UI and editor behavior tweaks designed for focus and efficiency (see `ZENFORGE_CUSTOM_SETTINGS` in `extension.js` for a full list).

## Extension Settings

ZenForge contributes the following user-configurable setting in your VS Code `settings.json`:

-   **`zenforge.applyNeovimSettings`**:
    -   **Description**: Controls whether Neovim-specific configurations (e.g., `vscode-neovim.*` and `whichkey.*` settings) are applied by ZenForge.
    -   **Type**: `boolean`
    -   **Default**: `false`
    -   **Usage**: Set to `true` in your VS Code user or workspace settings if you use the VSCode Neovim extension and want ZenForge to manage these settings.

## Commands

ZenForge provides the following commands accessible via the Command Palette (Ctrl+Shift+P or Cmd+Shift+P):

-   **`ZenForge: Apply Custom Settings`**:
    -   Manually triggers the consent dialog. If consent is given, it backs up current user settings, then applies ZenForge's settings and installs necessary fonts and extensions.
-   **`ZenForge: Install Fonts`**:
    -   Manually triggers the installation of the required fonts ("Geist Mono" and "JetBrains Mono Nerd Font") to your user-specific font directory. This is also run as part of the "Apply Custom Settings" flow.
-   **`ZenForge: Restore User Settings`**:
    -   Restores your VS Code settings from the backup taken before ZenForge's settings were last applied. This allows you to revert to your previous configuration.

## Settings Backup and Restore

Before ZenForge applies its settings (either on first run after consent or when manually triggered via the "Apply Custom Settings" command), it will automatically back up your existing relevant VS Code settings. This backup includes any user-defined values for the settings that ZenForge intends to modify.

You can restore these settings at any time by running the command **`ZenForge: Restore User Settings`** from the Command Palette. This will revert the ZenForge-applied settings to your previously backed-up configuration.

## Font Installation Details

The necessary fonts ("Geist Mono" and "JetBrains Mono Nerd Font") are automatically installed by the extension when it activates and you provide consent, or when you run the "ZenForge: Install Fonts" command. The extension attempts to install these fonts into user-specific directories, which typically does not require administrative privileges:
-   **Windows**: `%LOCALAPPDATA%\Microsoft\Windows\Fonts`
-   **macOS**: `~/Library/Fonts`
-   **Linux**: `~/.fonts`

After font installation, a VS Code restart might be necessary for the editor to fully recognize and apply the new fonts across all UI elements.

## Known Issues

-   **Font Installation on Windows**: While administrative privileges are generally not required for the user-specific font installation paths, some system configurations or security software might interfere. If automatic installation fails, you can try manually installing the fonts from the extension's `fonts` directory. For a system-wide installation (which would require admin rights), you would also need to copy these fonts manually to the system font directory (e.g., `C:\Windows\Fonts`).
-   **Neovim Path on macOS**: The default Neovim executable path for macOS in `ZENFORGE_CUSTOM_SETTINGS` is `/opt/homebrew/bin/nvim`. If your Neovim is installed elsewhere (e.g., via MacPorts or a different Homebrew prefix), you'll need to adjust `vscode-neovim.neovimExecutablePaths.darwin` in your personal VS Code settings *after* ZenForge applies its settings, or disable ZenForge's Neovim settings management via `zenforge.applyNeovimSettings`.

## Release Notes

### 1.1.0 (Planned)

-   Refined font installation with better error handling and logging.
-   Added user consent dialog before applying any settings.
-   Implemented settings backup and restore functionality.
-   Added `zenforge.applyNeovimSettings` configuration to optionally manage Neovim-related settings.
-   Removed manual font installation scripts in favor of automatic installation.
-   Updated README with new features and commands.

### 1.0.0

-   Initial release with Aura Theme and Moxer Icons integration, and basic settings application.

## Support

For support, please open an issue on our [GitHub repository](https://github.com/JohannesGezachew/ZENFORGE.git).

**Enjoy coding with ZenForge!**
