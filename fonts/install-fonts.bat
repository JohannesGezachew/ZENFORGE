@echo off

:: Copy all TTF and OTF fonts to the Windows fonts directory
copy *.ttf *.otf %windir%\Fonts

echo Fonts installed. Please restart your applications to use the new fonts.
pause
