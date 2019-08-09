var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
function init() {
    canvas = document.getElementById("canvas");
    anim_container = document.getElementById("animation_container");
    dom_overlay_container = document.getElementById("dom_overlay_container");
    var comp = AdobeAn.getComposition("EC05673F2EF8E74999333A4D42C1E38A");
    var lib = comp.getLibrary();
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", function (evt) {
        handleFileLoad(evt, comp)
    });
    loader.addEventListener("complete", function (evt) {
        handleComplete(evt, comp)
    });
    var lib = comp.getLibrary();
    if (lib.properties.manifest.length == 0) {
        handleComplete(null, comp);
    } else {
        loader.loadManifest(lib.properties.manifest);
    }
}
function handleFileLoad(evt, comp) {
    var images = comp.getImages();
    if (evt && (evt.item.type == "image")) {
        images[evt.item.id] = evt.result;
    }
}
function handleComplete(evt, comp) {
    //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
    var lib = comp.getLibrary();
    var ss = comp.getSpriteSheet();
    if (evt !== null) {
        var queue = evt.target;
        var ssMetadata = lib.ssMetadata;

        for (i = 0; i < ssMetadata.length; i++) {
            ss[ssMetadata[i].name] = new createjs.SpriteSheet({
                "images": [queue.getResult(ssMetadata[i].name)],
                "frames": ssMetadata[i].frames
            })
        }
    }
    exportRoot = new lib.adtemplate();
    stage = new lib.Stage(canvas);
    stage.enableMouseOver();
    var ad = new createjs.AdHelper(stage);
    //Registers the "tick" event listener.
    fnStartAnimation = function () {
        stage.addChild(exportRoot);
        createjs.Ticker.setFPS(lib.properties.fps);
        createjs.Ticker.addEventListener("tick", stage);
    };
    //Code to support hidpi screens and responsive scaling.
    AdobeAn.makeResponsive(false, 'both', false, 1, [canvas, anim_container, dom_overlay_container]);
    AdobeAn.compositionLoaded(lib.properties.id);
    fnStartAnimation();
    ad.highDPI().timeSync(lib.properties.fps);
}