//canvas.sight.sources.lights.get("Light.bBkKnYXQtnACDkF9").fov.points
//canvas.sight.light.bright.children[0].fov.geometry.points
// This is how we can link lights
// or
//canvas.sight.sources.lights.get().x .y
//canvas.sight.light.bright.children[0].light.geometry.graphicsData[0].shape.x .y

// var currentLightOffset = 0;
// var reverseOffset = false;

// var test = ()=>{
// setTimeout(()=>{
// canvas.sight.light.bright.alpha = 1 - currentLightOffset;
// canvas.sight.light.bright.filters = [new PIXI.filters.BlurFilter(40)]
// if(currentLightOffset > 0.5){
// reverseOffset = true;
// }
// if(currentLightOffset <= 0) {
// reverseOffset = false;
// }
// if(reverseOffset){
// currentLightOffset -= 0.1;
// } else {
// currentLightOffset += 0.1;
// }
// test();
// }, 50);
// }

// test();

// Hook into renderLightConfig
// Add new elements:
// Blur check
// Blur amount slider
// Dance Dropdown
//      Fire
//      Blink
//      Fade
//      Custom - How to do? Textbox with alpha:seconds
//                          eg. 1:1,.9:1,.8:1,.7:1

// DRAW COLOR TINTS
//canvas.lighting.lighting.lights.clear();
// for ( let s of canvas.sight.sources.lights.values() ) {
//     c.lights.beginFill(s.color, s.alpha).drawPolygon(s.fov).endFill();
// }

//canvas.lighting.lighting.lights.clear();
// for ( let s of canvas.sight.sources.lights.values() ) {
//     c.lights.beginFill(s.color, s.alpha).drawPolygon(s.fov).endFill();
// }


// var color1 = 0xFF0000;
// var color2 = 0x00FF00;
// var swatch = false;
// setInterval(()=>{canvas.lighting.lighting.lights.clear();
//     swatch = !swatch;
//     for ( let s of canvas.sight.sources.lights.values() ) {
//         canvas.lighting.lighting.lights.beginFill(swatch?color1:color2, s.alpha).drawPolygon(s.fov).endFill();
//     }
//                 }, 50);

const danceTimerTick = 80;
var danceFrameCounter = 0;
class DancingLights {

    static brightPairs = {};
    static lastAlpha = {};
    static timers = [];

    static animationFrame = {};
    static fireAnim = [0.969,
        0.951,
        0.932,
        0.914,
        0.896,
        0.878,
        0.861,
        0.844,
        0.827,
        0.811,
        0.794,
        0.777,
        0.761,
        0.729,
        0.69,
        0.65,
        0.61,
        0.57,
        0.603,
        0.737,
        0.792,
        0.792,
        0.792,
        0.792,
        0.761,
        0.684,
        0.607,
        0.53,
        0.446,
        0.338,
        0.249,
        0.273,
        0.297,
        0.321,
        0.365,
        0.473,
        0.581,
        0.69,
        0.766,
        0.819,
        0.871,
        0.88,
        0.869,
        0.859,
        0.845,
        0.763,
        0.672,
        0.551,
        0.484,
        0.446,
        0.408,
        0.37,
        0.354,
        0.42,
        0.486,
        0.554,
        0.641,
        0.695,
        0.739,
        0.784,
        0.822,
        0.851,
        0.88,
        0.881,
        0.874,
        0.867,
        0.862,
        0.857,
        0.852,
        0.824,
        0.773,
        0.722,
        0.672,
        0.621,
        0.587,
        0.595,
        0.603,
        0.611,
        0.619,
        0.749,
        0.898,
        0.869,
        0.84,
        0.811,
        0.782,
        0.753,
        0.724,
        0.653,
        0.567,
        0.481,
        0.395,
        0.476,
        0.68,
        0.769,
        0.858,
        0.947

    ]

    /* Input form */
    static getFormElement(label, hint, inputType, name, value, dType, opt) {
        let element = `<div class="form-group">
        <label>${label}</label>
        <div class="form-fields">`;
        if (inputType === "range") {
            element += `<input type="range" name="flags.world.dancingLights.${name}" value="${value}" min="${opt.min}" max=${opt.max}"" step="${opt.step}" data-dtype="${dType}">
            <span class="range-value">${value}</span>`;
        } else if (inputType === "select") {
            element += `<select name="flags.world.dancingLights.${name}">`;
            opt.values.forEach(value => {
                element += `<option value="${value}">${value}</option>`
            });
            element += `</select>`;

        } else {
            element += `<input type="${inputType}" name="flags.world.dancingLights.${name}" value="${value}" data-dtype="${dType}" ${inputType=='checkbox' && value === true?'checked':''}>`;
        }
        element += `</div>
        <p class="hint">${hint}</p>
    </div>`;

        return element;
    }

    static onRenderLightConfig(lightConfig, html, data) {
        let element = html.find(".window-content")
        DancingLights.addConfig(element, lightConfig);
        $("#light-config").attr('style', function (i, style) {
            return style && style.replace(/height[^;]+;?/g, '');
        });
        $("#light-config").css('max-height', window.innerHeight - 400);
    }

    static addConfig(element, lightConfig) {
        if (!lightConfig.object.data.flags.world) {
            lightConfig.object.data.flags.world = {};
        }
        if (!lightConfig.object.data.flags.world.dancingLights) {
            lightConfig.object.data.flags.world.dancingLights = {};
        }

        let dancingLightsHeader = `<h2>Dancing Lights config</h2>`;
        let dancingLightsEnabled = DancingLights.getFormElement("Enable Dancing Lights", "", "checkbox", "enabled", lightConfig.object.data.flags.world.dancingLights.enabled || "false", "Boolean");
        let blurEnabled = DancingLights.getFormElement("Enable Blur", "", "checkbox", "blurEnabled", lightConfig.object.data.flags.world.dancingLights.blurEnabled || "false", "Boolean");
        let blurAmount = DancingLights.getFormElement("Blur Amount", "", "range", "blurAmount", lightConfig.object.data.flags.world.dancingLights.blurAmount || 1, "Number", {
            min: 0,
            max: 100,
            step: 1
        });
        let danceType = DancingLights.getFormElement("Dancing Lights Type", "", "select", "type", lightConfig.object.data.flags.world.dancingLights.type || "fire", "String", {
            values: ["fire", "blink", "fade", "electricfault", "none"]
        });
        let speed = DancingLights.getFormElement("Fade Speed", "The speed of the 'animations'. Lower is faster. Note that the movement of the 'fire' is not affected by this, only the alpha changes.", "range", "speed", lightConfig.object.data.flags.world.dancingLights.speed || 1, "Number", {
            min: 1,
            max: 10,
            step: 1
        });

        $('button[name ="submit"]').before(`${dancingLightsHeader}${dancingLightsEnabled}${blurEnabled}${blurAmount}${danceType}${speed}`)
    }
    /* Input form end */

    static destroyAllTimers() {
        DancingLights.brightPairs = {};
        DancingLights.timers.forEach(timer => {
            clearInterval(timer);
        });
    }

    static getAnimationFrame(id, type, speed) {
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
                    DancingLights.animationFrame[id].frame = Math.floor(Math.random() * DancingLights.fireAnim.length);
                    DancingLights.animationFrame[id].alreadyPlaying = true;
                }
                    DancingLights.animationFrame[id].timesShown++;
                if(DancingLights.animationFrame[id].timesShown >= speed){
                    DancingLights.animationFrame[id].timesShown = 0;
                    DancingLights.animationFrame[id].frame++;
                }
                if (DancingLights.animationFrame[id].frame >= DancingLights.fireAnim.length) {
                    DancingLights.animationFrame[id].frame = 0;
                }
                return DancingLights.fireAnim[DancingLights.animationFrame[id].frame];

            case 'blink':
                // TODO: Allow options to unsync these
                DancingLights.animationFrame[id].alreadyPlaying = true;
                DancingLights.animationFrame[id].timesShown++;
               
                if(DancingLights.animationFrame[id].timesShown >= speed){
                    DancingLights.animationFrame[id].timesShown = 0;
                    DancingLights.animationFrame[id].frame++;
                }
                if(DancingLights.animationFrame[id].frame >= 2){
                    DancingLights.animationFrame[id].frame = 0;
                }
                return DancingLights.animationFrame[id].frame;
                break;
            case 'fade':
                //TODO: Finish animations
                //TODO: Implement color changes, as they look dope.
                break;
            case 'electricfault':
                break;
            case 'none':
                break;

            default:
                return 1;
        }


    }

    static createTimers() {
        canvas.lighting.objects.children.forEach((child) => {
            if (child.data.flags.world.dancingLights.enabled) {
                DancingLights.timers.push(setInterval(() => {
                    if (!DancingLights.brightPairs || DancingLights.brightPairs[child.id] == undefined) {
                        canvas.sight.light.bright.children.forEach((channelChild, index) => {
                            if (channelChild.light.geometry.graphicsData[0].shape.x === child.x && channelChild.light.geometry.graphicsData[0].shape.y === child.y) {
                                DancingLights.brightPairs[child.id] = index;
                            }
                        });
                    } else {
                        if (danceFrameCounter++ >= 1000) {
                            danceFrameCounter = 0;
                        }

                        canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].alpha = DancingLights.getAnimationFrame(child.id, child.data.flags.world.dancingLights.type, child.data.flags.world.dancingLights.speed || 1);
                        if (child.data.flags.world.dancingLights.type === 'fire') {
                            // Move the fire animation
                            canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].light.transform.position.x = ((Math.random() - 0.5) * 15);
                            canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].light.transform.position.y = ((Math.random() - 0.5) * 15);
                        }
                        DancingLights.lastAlpha[child.id] = canvas.sight.light.bright.children[DancingLights.brightPairs[child.id]].alpha;
                    }
                }, danceTimerTick));
            }
        });
    }

    static onCreateAmbientLight(scene, light, temp, sceneID) {
        DancingLights.destroyAllTimers();
        DancingLights.createTimers();
    }

    static onUpdateAmbientLight(scene, light, custom, changes, sceneID) {
        DancingLights.destroyAllTimers();
        DancingLights.createTimers();
    }
}
Hooks.on("renderLightConfig", DancingLights.onRenderLightConfig);
Hooks.on("updateAmbientLight", DancingLights.onUpdateAmbientLight);
Hooks.on("createAmbientLight")
Hooks.once("canvasReady", () => {
    // Forgive me
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
            if (hex === 0 && child.x == x && child.y == y && child.data.flags.world) {
                dancingLightOptions = child.data.flags.world.dancingLights;
                childID = child.id;
            }
        });
        /* Monkeypatch block end */
        let source = new PIXI.Container();
        source.light = source.addChild(new PIXI.Graphics());
        source.light.beginFill(hex, 1.0).drawCircle(x, y, radius).endFill();
        source.fov = source.addChild(new PIXI.Graphics());
        source.fov.beginFill(0xFFFFFF, 1.0).drawPolygon(fov).endFill();
        source.light.mask = source.fov;

        /* Monkeypatch block */
        if (dancingLightOptions && dancingLightOptions.enabled) {
            if (dancingLightOptions.blurEnabled) {
                source.filters = [new PIXI.filters.BlurFilter(dancingLightOptions.blurAmount)]
            }
            source.alpha = DancingLights.lastAlpha[childID]
            try {
                source.light.transform.position.x = ((Math.random() - 0.5) * 15);
                source.light.transform.position.y = ((Math.random() - 0.5) * 15);
            } catch (e) {}
        }
        /* Monkeypatch block end */
        return source;
    }
});
Hooks.on("canvasReady", () => {
    DancingLights.destroyAllTimers();
    DancingLights.createTimers();
});