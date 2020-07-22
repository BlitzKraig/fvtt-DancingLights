# 2.0.0 - 2020/07/20

## New features

* Added token based lighting. Make sure you have an Emit Bright distance set on the token, and enable dancing lights in the vision tab.
* Improved fire effects - Semi-breaking change! Any current fire lights will use the new system. If you need to go back to the old system, switch these lights to use 'legacyfire' - Note that this will be removed in the future
    * The new Fire system is procedural, and you should be able to alter the speed without causing choppiness. 
* Added ability to set min/max fade
* Added multiple options to animate the dim radius, including fade values, fire movement and blurring
* Added support for lib - ColorSettings (https://github.com/ardittristan/VTTColorSettings)

## Misc Changes

* Changed Dim Bright Vision settings to be per-client
* Tweaked dim/color animation option. This will now fade completely in-step with the bright light fade, allowing blinking/fading lights to 'turn off' when their opacity is at its lowest
* Tweaked default light settings for fire movement & color
* Refactored code for easier future maintenance & updates
* Added light source tagging system, which should bring improvements across the board
* Improved animation smoothness for all types
* Improved color mapping. 2-color blink will now consistently show the correct colors for max & min fade, whole color map will now be utilised for all lights, regardless of min & max fade values
* Clarified some settings

## Performance improvements
* Object for tracking the last alpha is now cleared regularly
* Massively reduced loop count with the tagging system

## Bugfixes
* Negative-radius lights no longer cause all dancing lights to fail
* Lights with opacity 0 no longer revert to the default opacity (Seen as a quick flash of color when using a 'fade' light with dim/color animation enabled - This is a Foundry bug, and can be seen without DancingLights installed)
* Light tagging system should mean no more guesstimating which light source to affect, fixing bugs where the wrong source was animated
* Prevent frame advancing on every token/lighting update, causing choppy lighting on token move or day-night transition
* Creating a new light no longer requires token movement to show if a player token is active

# 1.5.1 - 2020/07/18

* Bugfix - Blur is now applied when players with token vision on a scene refresh or load the page, no longer requiring a canvas redraw.

# 1.5.0 - 2020/07/14

* Huge performance gains - Please contact me if you are still experiencing poor performance on a decent machine, or a simple scene
* Fixed a bug where adding or removing token selection interfered with lighting, causing some lights to not animate, or tokens to begin animating
* Added option to disabled DancingLights per client
* Added option to change DancingLights tickrate to help performance per client

# 1.4.x - 2020/07/07

* Various build workflow tweaks. If you are having issues, please uninstall & reinstall the module

# 1.4.0 - 2020/07/07

* Added blinking/fading color changes
* Greatly improved Fading speed animations. Now smooth on slower speeds
* Added option to have a blinking colored light with no alpha changes ('disco' light)
* Important performance increase - Ensured a working array is cleared when it should be
* Added versioned releases (Thanks to Stan#1549 on Discord for the guide)
* GIFs are now no longer in the release package, so releases should be far smaller

# 1.3.2 - 2020/07/01

* Fix for Pathfinder 1e Darkvision in scenes with 'Darkness Level' set

# 1.3.1 - 2020/06/30

* Fixed settings display for new lights not rendering correctly

# 1.3.0 - 2020/06/30

* Added the ability to optionally update lighting scene-wide with the lights 'standard' settings, as well as the DancingLight settings
* Added the ability to determine which light settings you want to update scene-wide (Position is disabled by default, but can be enabled)
* Overhauled light settings to make things more manageable

# 1.2.1 - 2020/06/29

* Minor settings text updates

# 1.2.0 - 2020/06/29

* Greatly improved and re-enabled scene-wide lighting updates. Thanks to zeel on Discord for his help
* Changed default bright vision dimming to 0.9

# 1.1.4 - 2020/06/29

* Temporarily disabled scene-wide lighting updates due to nasty bugs

# 1.1.3 - 2020/06/29

* Updated scene-wide light update to properly set the flags

# 1.1.2 - 2020/06/29

* Updated scene-wide light update to viewed instead of active

# 1.1.1 - 2020/06/29

* Added slider in module settings to customize how dim the tokens Bright Vision is

# 1.1.0 - 2020/06/29

* Added Bright Vision Dimming in module settings. Enabled by default. This dims your tokens bright vision radius slightly to allow Dancing Lights effects to still show
* Added tweakable fire movement amount in light setting
* Added the ability to update all lights in the scene at once in light settings 

# 1.0.1 - 2020/06/28

* Important hotfix - Fixed scene change errors

# 1.0.0 - 2020/06/28

* Initial Release


