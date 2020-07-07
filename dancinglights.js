const danceTimerTick = 80;
var danceFrameCounter = 0;
//TODO: Improve class structure...
class DancingLights {

    static Utilities = {
        arraysEqual : (arr1, arr2) => {
            if(arr1.length !== arr2.length)
                return false;
            for(var i = arr1.length; i--;) {
                if(arr1[i] !== arr2[i])
                    return false;
            }
        
            return true;
        }
    }

    static brightPairs = {};
    static lastAlpha = {};
    static timers = [];

    static animationFrame = {};

    //TODO: Improve this. Both in storage/processing terms and the animation itself
    static fireAnim = [1.0,
        0.763,
        0.857,
        0.925,
        0.831,
        0.698,
        0.698,
        0.698,
        0.646,
        0.658,
        0.742,
        0.765,
        0.716,
        0.699,
        0.712,
        0.657,
        0.573,
        0.537,
        0.46,
        0.442,
        0.48,
        0.469,
        0.477,
        0.569,
        0.602,
        0.555,
        0.523,
        0.52,
        0.518,
        0.538,
        0.54,
        0.488,
        0.429,
        0.428,
        0.438,
        0.517,
        0.634,
        0.683,
        0.673,
        0.695,
        0.655,
        0.614,
        0.676,
        0.75,
        0.741,
        0.687,
        0.706,
        0.724,
        0.655,
        0.651,
        0.761,
        0.829,
        0.815,
        0.798,
        0.803,
        0.813,
        0.851,
        0.907,
        0.888,
        0.812,
        0.808,
        0.814,
        0.795,
        0.813,
        0.726,
        0.608,
        0.606,
        0.582,
        0.526,
        0.478,
        0.455,
        0.477,
        0.495,
        0.434,
        0.338,
        0.22,
        0.219,
        0.256,
        0.248,
        0.256,
        0.254,
        0.179,
        0.139,
        0.155,
        0.204,
        0.273,
        0.36,
        0.328,
        0.217,
        0.185,
        0.254,
        0.263,
        0.192,
        0.181,
        0.247,
        0.308,
        0.357,
        0.449,
        0.479,
        0.492,
        0.489,
        0.451,
        0.462,
        0.514,
        0.534,
        0.62,
        0.721,
        0.727,
        0.696,
        0.719,
        0.789,
        0.74,
        0.654,
        0.669,
        0.745,
        0.763,
        0.796,
        0.808,
        0.814,
        1.0

    ]

    /* Input form */
    //TODO: Improve settings for clarity
    static getFormElement(label, hint, inputType, name, value, dType, opt) {
        let element = `<div class="form-group">
        <label>${label}</label>
        <div class="form-fields">`;
        if (inputType === "range") {
            element += `<input type="range" name="flags.world.dancingLights.${name}" value="${value}" min="${opt.min}" max="${opt.max}" step="${opt.step}" data-dtype="${dType}">
            <span class="range-value">${value}</span>`;
        } else if (inputType === "select") {
            element += `<select name="flags.world.dancingLights.${name}" ${opt.onChange?`onChange='${opt.onChange}'`:''}>`;
            opt.values.forEach(sValue => {
                element += `<option value="${sValue}"${value===sValue?'selected="selected"':''}>${sValue}</option>`
            });
            element += `</select>`;

        } else if (inputType === "color") {
            element += `<input class="color" type="text" name="flags.world.dancingLights.${name}" value="${value}" data-dtype="String"></input>`
            element += `<input type="color" value="${value}" data-edit="flags.world.dancingLights.${name}">`
        } else {
            element += `<input type="${inputType}" name="flags.world.dancingLights.${name}" value="${value}" data-dtype="${dType}" ${inputType=='checkbox' && value === true?'checked':''} ${inputType =='checkbox' && opt && opt.onClick?`onclick='${opt.onClick}'`:''} >`;
        }
        element += `</div>
        <p class="hint">${hint}</p>
    </div>`;

        return element;
    }

    static onRenderLightConfig(lightConfig, html, data) {
        let element = html.find(".window-content")
        DancingLights.addConfig(element, lightConfig);

        //TODO: Improve style changes to attempt expansion on load.
        // $("#light-config").attr('style', function (i, style) {
        //     return style && style.replace(/height[^;]+;?/g, '');
        // });
        // $("#light-config").css('max-height', window.innerHeight - 200);
    }

    static displayExtendedOptions(display, divId) {
        return display ? $(`#${divId}`).show() : $(`#${divId}`).hide();
    }

    static addConfig(element, lightConfig) {
        if (!lightConfig.object.data.flags.world) {
            lightConfig.object.data.flags.world = {};
        }
        if (!lightConfig.object.data.flags.world.dancingLights) {
            lightConfig.object.data.flags.world.dancingLights = {};
        }

        let dancingLightsHeader = `<h2>Dancing Lights config</h2>`;
        let dancingLightsEnabled = DancingLights.getFormElement("Enable Dancing Lights", "Enable/disable effects on this light", "checkbox", "enabled", lightConfig.object.data.flags.world.dancingLights.enabled || false, "Boolean", {
            onClick: 'DancingLights.displayExtendedOptions(this.checked, "dancingLightsOptions");'
        });
        let blurEnabled = DancingLights.getFormElement("Enable Blur", "", "checkbox", "blurEnabled", lightConfig.object.data.flags.world.dancingLights.blurEnabled || false, "Boolean", {
            onClick: 'DancingLights.displayExtendedOptions(this.checked, "blurOptions");'
        });
        let blurAmount = DancingLights.getFormElement("Blur Amount", "", "range", "blurAmount", typeof lightConfig.object.data.flags.world.dancingLights.blurAmount !== 'undefined' ? lightConfig.object.data.flags.world.dancingLights.blurAmount : 10, "Number", {
            min: 0,
            max: 100,
            step: 1
        });
        let danceType = DancingLights.getFormElement("Dancing Lights Type", "Select 'none' to disable the animations (if you just want the blur for example)", "select", "type", lightConfig.object.data.flags.world.dancingLights.type || "none", "String", {
            values: ["fire", "blink", "fade", "electricfault", "none"],
            onChange: `DancingLights.displayExtendedOptions(this.value !== "none", "typeOptions"); DancingLights.displayExtendedOptions(this.value == "fire", "fireOptions"); DancingLights.displayExtendedOptions(this.value == "blink" || this.value == "fade", "blinkFadeOptions"); DancingLights.displayExtendedOptions(this.value == "blink", "blinkOptions");`
        });
        let sync = DancingLights.getFormElement("Enable Sync", "Synchronize animations. Lights with the same animation type & speed with this checked will animate together", "checkbox", "sync", lightConfig.object.data.flags.world.dancingLights.sync || false, "Boolean");
        let animateDim = DancingLights.getFormElement("Enable Dim Animation", "If checked, the 'dim' light will also fade based on a fraction of the bright light. This overrides the 'Light Opacity' in the default light settings. Disable this to keep the opacity as set.", "checkbox", "animateDimAlpha", lightConfig.object.data.flags.world.dancingLights.animateDimAlpha || false, "Boolean"); //animateDimAlpha
        let startColor = DancingLights.getFormElement("Fire Color Dim", "The light color when the fire is at its dimmest", "color", "startColor", lightConfig.object.data.flags.world.dancingLights.startColor || "#ffc08f", "String");
        let endColor = DancingLights.getFormElement("Fire Color Bright", "The light color when the fire is at its brightest", "color", "endColor", lightConfig.object.data.flags.world.dancingLights.endColor || "#f8e0af", "String");
        let blinkColorOnly = DancingLights.getFormElement("Blink Color Only", "Do not change the alpha of the Blink light, only switch between colors. Useful for 'disco lights'", "checkbox", "blinkColorOnly", lightConfig.object.data.flags.world.dancingLights.blinkColorOnly || false, "Boolean");
        let blinkFadeColorEnabled = DancingLights.getFormElement("Enable Blink/Fade Colors", "'none' uses to normal Light Opacity, other values animate between colors", "select", "blinkFadeColorEnabled", lightConfig.object.data.flags.world.dancingLights.blinkFadeColorEnabled || "none", "String", {
            values: ["none", "two", "three"],
            onChange: `DancingLights.displayExtendedOptions(this.value !== "none", "blinkFadeColorOptions"); DancingLights.displayExtendedOptions(this.value == "three", "blinkFadeColorOptionsExtended");`
        });
        let blinkFadeColor1 = DancingLights.getFormElement("Color 1", "", "color", "blinkFadeColor1", lightConfig.object.data.flags.world.dancingLights.blinkFadeColor1 || "#ff0000", "String");
        let blinkFadeColor2 = DancingLights.getFormElement("Color 2", "", "color", "blinkFadeColor2", lightConfig.object.data.flags.world.dancingLights.blinkFadeColor2 || "#00ff00", "String");
        let blinkFadeColor3 = DancingLights.getFormElement("Color 3", "", "color", "blinkFadeColor3", lightConfig.object.data.flags.world.dancingLights.blinkFadeColor3 || "#0000ff", "String");
        let movementAmount = DancingLights.getFormElement("Fire Movement Amount", "How much the fire position flickers", "range", "fireMovement", typeof lightConfig.object.data.flags.world.dancingLights.fireMovement !== 'undefined' ? lightConfig.object.data.flags.world.dancingLights.fireMovement : 15, "Number", {
            min: 1,
            max: 40,
            step: 1
        });
        let speed = DancingLights.getFormElement("Speed", "The speed of the 'animations'. Lower is faster. Note that the movement of the 'fire' is not affected by this, only the alpha changes. The 'electricfault' type triggers more often with higher numbers here.", "range", "speed", typeof lightConfig.object.data.flags.world.dancingLights.speed !== 'undefined' ? lightConfig.object.data.flags.world.dancingLights.speed : 1, "Number", {
            min: 1,
            max: 10,
            step: 1
        });
        let updateAll = DancingLights.getFormElement("Update All Lights", "IMPORTANT: This can take some time. Do not refresh your page until it is completed, or you risk losing data. Check this to automatically update all of the lights in the scene to match this one. This only updates the DancingLight options", "checkbox", "updateAll", false, "Boolean", {
            onClick: 'DancingLights.displayExtendedOptions(this.checked, "updateExtendedOptions");'
        });
        let updateExtended = DancingLights.getFormElement("Include Standard Config", "When checked along with 'Update All Lights', every light in the scene will also inherit this lights normal light properties. Disable the checkboxes that appear below to disable syncing specific properties. Note that X & Y position are disabled by default.", "checkbox", "updateExtended", false, "Boolean", {
            onClick: 'DancingLights.displayExtendedOptions(this.checked, "granularExtendedOptions");'
        })

        let updateExtendedHeader = `<h2>Standard options to sync</h2>`;
        let t = DancingLights.getFormElement("Light Type", "", "checkbox", "updateGranular.t", true, "Boolean");
        let x = DancingLights.getFormElement("X-Position", "", "checkbox", "updateGranular.x", false, "Boolean");
        let y = DancingLights.getFormElement("Y-Position", "", "checkbox", "updateGranular.y", false, "Boolean");
        let dim = DancingLights.getFormElement("Dim Radius", "", "checkbox", "updateGranular.dim", true, "Boolean");
        let bright = DancingLights.getFormElement("Bright Radius", "", "checkbox", "updateGranular.bright", true, "Boolean");
        let angle = DancingLights.getFormElement("Emission Angle", "", "checkbox", "updateGranular.angle", true, "Boolean");
        let rotation = DancingLights.getFormElement("Rotation", "", "checkbox", "updateGranular.rotation", true, "Boolean");
        let tintColor = DancingLights.getFormElement("Light Color", "", "checkbox", "updateGranular.tintColor", true, "Boolean");
        let tintAlpha = DancingLights.getFormElement("Light Opacity", "", "checkbox", "updateGranular.tintAlpha", true, "Boolean");
        let darknessThreshold = DancingLights.getFormElement("Darkness Threshold", "", "checkbox", "updateGranular.darknessThreshold", true, "Boolean");

        $('button[name ="submit"]').before(`${dancingLightsHeader}${dancingLightsEnabled}<div id="dancingLightsOptions">${blurEnabled}
        <div id="blurOptions">${blurAmount}</div>${danceType}<div id="typeOptions"><div id="fireOptions">${startColor}${endColor}${movementAmount}</div>
        <div id="blinkOptions">${blinkColorOnly}</div>
        <div id="blinkFadeOptions">${blinkFadeColorEnabled}<div id="blinkFadeColorOptions">${blinkFadeColor1}${blinkFadeColor2}<div id="blinkFadeColorOptionsExtended">${blinkFadeColor3}</div></div></div>
        ${sync}${animateDim}${speed}</div></div>${updateAll}<div id="updateExtendedOptions">${updateExtended}
        <div id="granularExtendedOptions">${updateExtendedHeader}${t}${x}${y}${rotation}${dim}${bright}${angle}${tintColor}${tintAlpha}${darknessThreshold}</div></div>`);

        DancingLights.displayExtendedOptions(lightConfig.object.data.flags.world.dancingLights.enabled || false, "dancingLightsOptions");
        DancingLights.displayExtendedOptions(lightConfig.object.data.flags.world.dancingLights.blurEnabled || false, "blurOptions");
        DancingLights.displayExtendedOptions(lightConfig.object.data.flags.world.dancingLights.type && lightConfig.object.data.flags.world.dancingLights.type !== 'none', 'typeOptions');
        DancingLights.displayExtendedOptions(lightConfig.object.data.flags.world.dancingLights.type == 'fire', 'fireOptions');
        DancingLights.displayExtendedOptions(lightConfig.object.data.flags.world.dancingLights.type == 'blink', "blinkOptions");
        DancingLights.displayExtendedOptions(lightConfig.object.data.flags.world.dancingLights.type == 'blink' || lightConfig.object.data.flags.world.dancingLights.type == 'fade', "blinkFadeOptions");
        DancingLights.displayExtendedOptions(lightConfig.object.data.flags.world.dancingLights.blinkFadeColorEnabled && lightConfig.object.data.flags.world.dancingLights.blinkFadeColorEnabled !== 'none', "blinkFadeColorOptions");
        DancingLights.displayExtendedOptions(lightConfig.object.data.flags.world.dancingLights.blinkFadeColorEnabled && lightConfig.object.data.flags.world.dancingLights.blinkFadeColorEnabled == 'three', "blinkFadeColorOptionsExtended");
        DancingLights.displayExtendedOptions(false, 'updateExtendedOptions');
        DancingLights.displayExtendedOptions(false, 'granularExtendedOptions');
    }
    /* Input form end */

    static destroyAllTimers() {
        DancingLights.animationFrame = {};
        DancingLights.brightPairs = {};
        DancingLights.timers.forEach(timer => {
            clearInterval(timer);
        });
        DancingLights.timers = [];
    }

    static getAnimationFrame(id, type, speed, sync, opt) {
        if (!DancingLights.animationFrame[id]) {
            DancingLights.animationFrame[id] = {
                frame: 0,
                timesShown: 0,
                alreadyPlaying: false
            };
        }
        switch (type) {
            case 'fire':
                if (!DancingLights.animationFrame[id].alreadyPlaying) {
                    if (!sync) {
                        DancingLights.animationFrame[id].frame = Math.floor(Math.random() * DancingLights.fireAnim.length);
                    }
                    DancingLights.animationFrame[id].alreadyPlaying = true;
                }
                DancingLights.animationFrame[id].timesShown++;
                if (DancingLights.animationFrame[id].timesShown >= speed) {
                    DancingLights.animationFrame[id].timesShown = 0;
                    DancingLights.animationFrame[id].frame++;
                }
                if (DancingLights.animationFrame[id].frame >= DancingLights.fireAnim.length) {
                    DancingLights.animationFrame[id].frame = 0;
                }
                return DancingLights.fireAnim[DancingLights.animationFrame[id].frame];

            case 'blink':
                if (!DancingLights.animationFrame[id].alreadyPlaying) {
                    if (!sync) {
                        DancingLights.animationFrame[id].frame = Math.round(Math.random() * 2);
                        DancingLights.animationFrame[id].blinkColorIndex = Math.round(Math.random() * 2);
                    }
                    DancingLights.animationFrame[id].alreadyPlaying = true;
                }
                
                DancingLights.animationFrame[id].timesShown++;

                if (DancingLights.animationFrame[id].timesShown >= speed) {
                    DancingLights.animationFrame[id].timesShown = 0;
                    DancingLights.animationFrame[id].frame++;
                    if(DancingLights.animationFrame[id].blinkColorIndex == undefined){
                        DancingLights.animationFrame[id].blinkColorIndex = 0;
                    } else {
                        DancingLights.animationFrame[id].blinkColorIndex++;
                    }
                }
                if (DancingLights.animationFrame[id].frame >= 2) {
                    DancingLights.animationFrame[id].frame = 0;
                }
                if(opt.blinkColorOnly){
                    return 1
                }
                return DancingLights.animationFrame[id].frame;
            case 'fade':
                if (!DancingLights.animationFrame[id].alreadyPlaying) {
                    if (!sync) {
                        DancingLights.animationFrame[id].frame = Math.floor(Math.random() * (20 * speed));
                    }
                    DancingLights.animationFrame[id].alreadyPlaying = true;
                }
                // DancingLights.animationFrame[id].timesShown++;

                // if (DancingLights.animationFrame[id].timesShown >= speed) {
                //     DancingLights.animationFrame[id].timesShown = 0;
                    DancingLights.animationFrame[id].frame++;
                // }
                if (DancingLights.animationFrame[id].frame >= (20 * speed)) {
                    DancingLights.animationFrame[id].frame = 0;
                }
                let alpha = 1 - DancingLights.animationFrame[id].frame / 10 / speed;
                if (DancingLights.animationFrame[id].frame >= (10 * speed)) {
                    alpha = 0 + (DancingLights.animationFrame[id].frame - (10 * speed)) / 10 / speed;
                }

                return alpha;
            case 'electricfault':
                return Math.random() < (.05 * speed) ? Math.random() < .5 ? 0.4 : 0.6 : 1;
            case 'none':
                return 1;

            default:
                return 1;
        }


    }

    static getBlinkColor(id, colorsArray) {
        if(!DancingLights.animationFrame[id]){
            return;
        }
        if(DancingLights.animationFrame[id].blinkColorIndex == undefined || DancingLights.animationFrame[id].blinkColorIndex >= colorsArray.length){
            DancingLights.animationFrame[id].blinkColorIndex = 0
            
        }
        if(!canvas.sight.visible){
            return;
        }
        return chroma(colorsArray[DancingLights.animationFrame[id].blinkColorIndex]).num();

    }

    static getFadeColor(id, colorsArray) {
        let fadeColorScale = chroma.scale(colorsArray).domain([0, 1]);
        return fadeColorScale(DancingLights.lastAlpha[id]).num();
    }

    static getFireColor(id, startColor, endColor) {
        let fireColorScale = chroma.scale([startColor, endColor]).domain([0.21, 1]); //Domain retrieved from fireanim frames, change this when we update fireanim // TODO: Improve this to grab dynamically
        return fireColorScale(DancingLights.lastAlpha[id]).num();
    }

    static createTimers() {
        canvas.lighting.objects.children.forEach((child) => {
            if (!child.data.flags.world) {
                child.data.flags.world = {};
            }
            if (!child.data.flags.world.dancingLights) {
                child.data.flags.world.dancingLights = {};
            }
            if (child.data.flags.world.dancingLights.enabled) {
                DancingLights.timers.push(setInterval(() => {
                    if (!DancingLights.brightPairs || DancingLights.brightPairs[child.id] == undefined) {
                        canvas.sight.light.bright.children.forEach((channelChild, index) => {
                            if (channelChild.light.geometry.graphicsData[0].shape.x === child.x && channelChild.light.geometry.graphicsData[0].shape.y === child.y) {
                                DancingLights.brightPairs[child.id] = index;
                            }
                            if (!DancingLights.brightPairs[child.id] && game.settings.get("DancingLights", "dimBrightVision")) {
                                channelChild.alpha = game.settings.get("DancingLights", "dimBrightVisionAmount") || 0.5;
                            }
                        });
                    } else {
                        if (danceFrameCounter++ >= 1000) {
                            danceFrameCounter = 0;
                        }
                        try {
                            canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].alpha = DancingLights.getAnimationFrame(child.id, child.data.flags.world.dancingLights.type, child.data.flags.world.dancingLights.speed || 1, child.data.flags.world.dancingLights.sync || false, {blinkColorOnly:child.data.flags.world.dancingLights.blinkColorOnly});
                            // Keeping in case we want to add this. Almost looks good.
                            // canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].filters[1].direction = Math.random() * 360;
                            // canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].filters[1].refresh();
                            if (child.data.flags.world.dancingLights.type === 'fire') {
                                // Move the fire animation
                                canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].light.transform.position.x = ((Math.random() - 0.5) * (child.id, child.data.flags.world.dancingLights.fireMovement || 15));
                                canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].light.transform.position.y = ((Math.random() - 0.5) * (child.data.flags.world.dancingLights.fireMovement || 15));
                                // Not ready to give up on skew/scale. Scale could be done by clearing and redrawing, but for now we'll stick with the position shift.
                                // canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].light.transform.skew.x = ((Math.random() - 0.5) / 50);
                                // canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].light.transform.skew.y = ((Math.random() - 0.5) / 50);
                            }
                            DancingLights.lastAlpha[child.id] = canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].alpha;
                        } catch (e) {
                            // Sight layer isn't active, ignore
                        }
                    }
                }, danceTimerTick));
            }
        });
        // Global timer
        DancingLights.timers.push(setInterval(() => {
            try {
                canvas.lighting.lighting.lights.clear();
            } catch (e) {}
            for (let s of canvas.sight.sources.lights.values()) {
                let dancingLightOptions;
                let childID;
                canvas.lighting.objects.children.forEach((child) => {
                    if (child.x == s.x && child.y == s.y && child.data.flags.world) {
                        dancingLightOptions = child.data.flags.world.dancingLights;
                        childID = child.id;
                    }
                });

                if (s.darknessThreshold <= canvas.lighting._darkness) {
                    if (dancingLightOptions && dancingLightOptions.enabled) {
                        if (dancingLightOptions.type === 'fire') {
                            canvas.lighting.lighting.lights.beginFill(DancingLights.getFireColor(childID, dancingLightOptions.startColor || '#ffc08f', dancingLightOptions.endColor || '#f8e0af'), dancingLightOptions.animateDimAlpha ? 1 - (1 - (DancingLights.lastAlpha[childID])) / 4 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                        } else if (dancingLightOptions.type === 'fade' && dancingLightOptions.blinkFadeColorEnabled !== 'none') {
                            if (dancingLightOptions.blinkFadeColorEnabled == 'two') {
                                canvas.lighting.lighting.lights.beginFill(DancingLights.getFadeColor(childID, [dancingLightOptions.blinkFadeColor1 || '#ff0000', dancingLightOptions.blinkFadeColor2 || '#00ff00']), dancingLightOptions.animateDimAlpha ? 1 - (1 - (DancingLights.lastAlpha[childID])) / 2 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                            } else if (dancingLightOptions.blinkFadeColorEnabled == 'three') {
                                canvas.lighting.lighting.lights.beginFill(DancingLights.getFadeColor(childID, [dancingLightOptions.blinkFadeColor1 || '#ff0000', dancingLightOptions.blinkFadeColor2 || '#00ff00', dancingLightOptions.blinkFadeColor3 || '#0000ff']), dancingLightOptions.animateDimAlpha ? 1 - (1 - (DancingLights.lastAlpha[childID])) / 2 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                            }
                        } else if (dancingLightOptions.type === 'blink' && dancingLightOptions.blinkFadeColorEnabled !== 'none') {
                            if (dancingLightOptions.blinkFadeColorEnabled == 'two') {
                                canvas.lighting.lighting.lights.beginFill(DancingLights.getBlinkColor(childID, [dancingLightOptions.blinkFadeColor1 || '#ff0000', dancingLightOptions.blinkFadeColor2 || '#00ff00']) || s.color, dancingLightOptions.animateDimAlpha ? 1 - (1 - (DancingLights.lastAlpha[childID])) / 2 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                            } else if (dancingLightOptions.blinkFadeColorEnabled == 'three') {
                                canvas.lighting.lighting.lights.beginFill(DancingLights.getBlinkColor(childID, [dancingLightOptions.blinkFadeColor1 || '#ff0000', dancingLightOptions.blinkFadeColor2 || '#00ff00', dancingLightOptions.blinkFadeColor3 || '#0000ff']) || s.color, dancingLightOptions.animateDimAlpha ? 1 - (1 - (DancingLights.lastAlpha[childID])) / 2 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                            }
                        } else {
                            canvas.lighting.lighting.lights.beginFill(s.color, dancingLightOptions.animateDimAlpha ? 1 - (1 - DancingLights.lastAlpha[childID]) / 2 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                        }
                    } else {
                        canvas.lighting.lighting.lights.beginFill(s.color, s.alpha).drawPolygon(s.fov).endFill();
                    }
                }
            }
            /* Fix for Pathfinder 1 'DarkVision' dimness in scenes with dark overlay set */
            if(game.system.id === 'pf1') {
                if (canvas.sight.hasDarkvision) {
                    canvas.lighting.updateDarkvision();
                }
            }
            /* PF1e fix end */
        }, danceTimerTick));
    }

    static forceReinit() {
        DancingLights.destroyAllTimers();
        DancingLights.createTimers();
    }

    static async syncLightConfigs(scene, light, updateExtended, updateGranular) {
        ui.notifications.notify(`Updating all lights in the scene, do not refresh!`);
        let lightId = light.id;
        const lights = scene.data.lights;
        lights.forEach((updateLight) => {
            if (updateLight._id !== lightId) {
                mergeObject(updateLight.flags.world.dancingLights, light.flags.world.dancingLights, true, true)
                if (updateExtended) {
                    let lightData = {};
                    updateGranular.t ? lightData.t = light.t : '';
                    updateGranular.x ? lightData.x = light.x : '';
                    updateGranular.y ? lightData.y = light.y : '';
                    updateGranular.rotation ? lightData.rotation = light.rotation : '';
                    updateGranular.dim ? lightData.dim = light.dim : '';
                    updateGranular.bright ? lightData.bright = light.bright : '';
                    updateGranular.angle ? lightData.angle = light.angle : '';
                    updateGranular.tintColor ? lightData.tintColor = light.tintColor : '';
                    updateGranular.tintAlpha ? lightData.tintAlpha = light.tintAlpha : '';
                    updateGranular.darknessThreshold ? lightData.darknessThreshold = light.darknessThreshold : '';

                    mergeObject(updateLight, lightData, true, true);
                }
            }
        });
        let results = await canvas.lighting.updateMany(lights, {
            diff: false
        });
        ui.notifications.notify(`All lights updated.`);
        return results;
    }

    static onUpdateAmbientLight(scene, light, custom, changes, sceneID) {

        if (light.flags.world && light.flags.world.dancingLights && light.flags.world.dancingLights.updateAll) {
            light.flags.world.dancingLights.updateAll = false;
            let updateExtended = light.flags.world.dancingLights.updateExtended;
            let updateGranular = light.flags.world.dancingLights.updateGranular;
            light.flags.world.dancingLights.updateExtended = false;
            (async () => {
                console.time('lightPromise');

                await DancingLights.syncLightConfigs(scene, light, updateExtended, updateGranular);

                console.timeEnd('lightPromise');
            })();
        }

        DancingLights.destroyAllTimers();
        DancingLights.createTimers();
    }

    static onInit() {
        game.settings.register("DancingLights", "dimBrightVision", {
            name: "Dim token Bright Vision",
            hint: "Changing this will refresh your page! Disable this to revert bright vision circles back to default. Note that you will not see some Dancing Lights effects properly while they are within your bright vision radius.",
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
            onChange: value => {
                window.location.reload();
            }
        })
        game.settings.register("DancingLights", "dimBrightVisionAmount", {
            name: "Dim token Bright Vision alpha",
            hint: "Changing this will refresh your page! Tweak how dim the Bright Vision radius is. 0.1 is very dim, 1 is fully bright",
            scope: "world",
            config: true,
            type: Number,
            range: { // If range is specified, the resulting setting will be a range slider
                min: 0.1,
                max: 1,
                step: 0.05
            },
            default: 0.9,
            onChange: value => {
                window.location.reload();
            }
        })
    }

    static patchLighting() {
        // Forgive me -- This will probably break with some Foundry updates
        // TODO: Add version checks with custom patches - This works with at least 0.6.2 -> 0.6.4

        // ? -> 0.6.2 -> 0.6.4
        /*
  _drawSource(hex, {x, y, radius, fov}={}) {
    let source = new PIXI.Container();
    source.light = source.addChild(new PIXI.Graphics());
    source.light.beginFill(hex, 1.0).drawCircle(x, y, radius).endFill();
    source.fov = source.addChild(new PIXI.Graphics());
    source.fov.beginFill(0xFFFFFF, 1.0).drawPolygon(fov).endFill();
    source.light.mask = source.fov;
    return source;
  }
    */
        canvas.sight._drawSource = function (hex, {
            x,
            y,
            radius,
            fov
        } = {}) {
            /* Monkeypatch block */
            // Get x,y from lights to determine correct light, use dancinglights values from that
            let dancingLightOptions;
            let childID;
            canvas.lighting.objects.children.forEach((child) => {
                if (hex === 0 && 
                    child.data.flags.world && 
                    child.x == x && // Strangely, token brightlights can match the lights easily on refresh, as snapped tokens & lights are whole num floats, but once tokens are moved they add decimals
                    child.y == y && 
                    child.brightRadius == radius && // Check the radius and fovs to try prevent grabbing a token brightlight on scene refresh.
                    DancingLights.Utilities.arraysEqual(child.fov.points, fov.points)) {
                    dancingLightOptions = child.data.flags.world.dancingLights;
                    childID = child.id;
                }
            });
            /* Monkeypatch block end */

            let source = new PIXI.Container();
            source.light = source.addChild(new PIXI.Graphics());
            // TODO: Remove source.children[0] and redraw to scale
            // $pixi.children[0] = $pixi.addChild(new PIXI.Graphics());
            // $pixi.children[0].beginFill(0xFF0000, 1.0).drawCircle(1450, 1350, 100).endFill();
            source.light.beginFill(hex, 1.0).drawCircle(x, y, radius).endFill();
            source.fov = source.addChild(new PIXI.Graphics());
            source.fov.beginFill(0xFFFFFF, 1.0).drawPolygon(fov).endFill();
            source.light.mask = source.fov;

            /* Monkeypatch block */
            if (!childID && game.settings.get("DancingLights", "dimBrightVision")) {
                source.alpha = game.settings.get("DancingLights", "dimBrightVisionAmount") || 0.5;
            }
            if (dancingLightOptions && dancingLightOptions.enabled) {
                if (dancingLightOptions.blurEnabled) {
                    source.filters = [new PIXI.filters.BlurFilter(dancingLightOptions.blurAmount)]
                    // Keeping in case we want to add this. Almost looks good.
                    // source.filters.push(new PIXI.filters.GlitchFilter({slices:30, offset: 5, direction: 45, average: true}));
                }
                source.alpha = DancingLights.lastAlpha[childID]
                if (dancingLightOptions.type === 'fire') {
                    try {
                        source.light.transform.position.x = ((Math.random() - 0.5) * (dancingLightOptions.fireMovement || 15));
                        source.light.transform.position.y = ((Math.random() - 0.5) * (dancingLightOptions.fireMovement || 15));
                        // canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].light.transform.skew.x = ((Math.random() - 0.5) / 50);
                        // canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].light.transform.skew.y = ((Math.random() - 0.5) / 50);
                    } catch (e) {}
                }
            }
            /* Monkeypatch block end */
            return source;
        }

        // ? -> 0.6.2 -> 0.6.4
        /*
         update(alpha=null) {
             const d = canvas.dimensions;
             const c = this.lighting;

             // Draw darkness layer
             this._darkness = alpha !== null ? alpha : canvas.scene.data.darkness;
             c.darkness.clear();
             const darknessPenalty = 0.8;
             let darknessColor = canvas.scene.getFlag("core", "darknessColor") || CONFIG.Canvas.darknessColor;
             if ( typeof darknessColor === "string" ) darknessColor = colorStringToHex(darknessColor);
             c.darkness.beginFill(darknessColor, this._darkness * darknessPenalty)
               .drawRect(0, 0, d.width, d.height)
               .endFill();

             // Draw lighting atop the darkness
             c.lights.clear();
             for ( let s of canvas.sight.sources.lights.values() ) {
               if ( s.darknessThreshold <= this._darkness ) {
                 c.lights.beginFill(s.color, s.alpha).drawPolygon(s.fov).endFill();
               }
             }
           }
        */

        canvas.lighting.update = function (alpha = null) {
            const d = canvas.dimensions;
            const c = this.lighting;

            // Draw darkness layer
            this._darkness = alpha !== null ? alpha : canvas.scene.data.darkness;
            c.darkness.clear();
            const darknessPenalty = 0.8;
            let darknessColor = canvas.scene.getFlag("core", "darknessColor") || CONFIG.Canvas.darknessColor;
            if (typeof darknessColor === "string") darknessColor = colorStringToHex(darknessColor);
            c.darkness.beginFill(darknessColor, this._darkness * darknessPenalty)
                .drawRect(0, 0, d.width, d.height)
                .endFill();

            // Draw lighting atop the darkness
            c.lights.clear();
            for (let s of canvas.sight.sources.lights.values()) {
                /* Monkeypatch block */
                let dancingLightOptions;
                let childID;
                canvas.lighting.objects.children.forEach((child) => {
                    if (child.x == s.x && child.y == s.y && child.data.flags.world) {
                        dancingLightOptions = child.data.flags.world.dancingLights;
                        childID = child.id;
                    }
                });
                if (s.darknessThreshold <= this._darkness) {
                    if (dancingLightOptions && dancingLightOptions.enabled) {
                        if (dancingLightOptions.type === 'fire') {
                            canvas.lighting.lighting.lights.beginFill(DancingLights.getFireColor(childID, dancingLightOptions.startColor || '#ffc08f', dancingLightOptions.endColor || '#f8e0af'), dancingLightOptions.animateDimAlpha ? 1 - (1 - (DancingLights.lastAlpha[childID])) / 4 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                        } else if (dancingLightOptions.type === 'fade' && dancingLightOptions.blinkFadeColorEnabled !== 'none') {
                            if (dancingLightOptions.blinkFadeColorEnabled == 'two') {
                                canvas.lighting.lighting.lights.beginFill(DancingLights.getFadeColor(childID, [dancingLightOptions.blinkFadeColor1 || '#ff0000', dancingLightOptions.blinkFadeColor2 || '#00ff00']), dancingLightOptions.animateDimAlpha ? 1 - (1 - (DancingLights.lastAlpha[childID])) / 2 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                            } else if (dancingLightOptions.blinkFadeColorEnabled == 'three') {
                                canvas.lighting.lighting.lights.beginFill(DancingLights.getFadeColor(childID, [dancingLightOptions.blinkFadeColor1 || '#ff0000', dancingLightOptions.blinkFadeColor2 || '#00ff00', dancingLightOptions.blinkFadeColor3 || '#0000ff']), dancingLightOptions.animateDimAlpha ? 1 - (1 - (DancingLights.lastAlpha[childID])) / 2 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                            }
                        } else if (dancingLightOptions.type === 'blink' && dancingLightOptions.blinkFadeColorEnabled !== 'none') {
                            if (dancingLightOptions.blinkFadeColorEnabled == 'two') {
                                canvas.lighting.lighting.lights.beginFill(DancingLights.getBlinkColor(childID, [dancingLightOptions.blinkFadeColor1 || '#ff0000', dancingLightOptions.blinkFadeColor2 || '#00ff00']), dancingLightOptions.animateDimAlpha ? 1 - (1 - (DancingLights.lastAlpha[childID])) / 2 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                            } else if (dancingLightOptions.blinkFadeColorEnabled == 'three') {
                                canvas.lighting.lighting.lights.beginFill(DancingLights.getBlinkColor(childID, [dancingLightOptions.blinkFadeColor1 || '#ff0000', dancingLightOptions.blinkFadeColor2 || '#00ff00', dancingLightOptions.blinkFadeColor3 || '#0000ff']), dancingLightOptions.animateDimAlpha ? 1 - (1 - (DancingLights.lastAlpha[childID])) / 2 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                            }
                        } else {
                            canvas.lighting.lighting.lights.beginFill(s.color, dancingLightOptions.animateDimAlpha ? 1 - (1 - DancingLights.lastAlpha[childID]) / 2 || s.alpha : s.alpha).drawPolygon(s.fov).endFill();
                        }
                    } else {
                        canvas.lighting.lighting.lights.beginFill(s.color, s.alpha).drawPolygon(s.fov).endFill();
                    }
                }
                /* Monkeypatch block end */
            }

            /* Fix for Pathfinder 1 'DarkVision' dimness in scenes with dark overlay set */
            if(game.system.id === 'pf1') {
                if (canvas.sight.hasDarkvision) {
                    canvas.lighting.updateDarkvision();
                }
            }
            /* PF1e fix end */
        }
    }
}
Hooks.on("renderLightConfig", DancingLights.onRenderLightConfig);
Hooks.on("updateAmbientLight", DancingLights.onUpdateAmbientLight);
Hooks.on("createAmbientLight", DancingLights.forceReinit);
Hooks.on("closeTokenConfig", DancingLights.forceReinit);
Hooks.once("canvasReady", DancingLights.patchLighting);
Hooks.on("init", DancingLights.onInit);
Hooks.on("canvasReady", DancingLights.forceReinit);