var sw = 360; //window.innerWidth;
var sh = 669; //window.innerHeight;

var cameraParams = {
   fov: 75, aspectRatio: (sw/sh), near: 0.1, far: 50
};
var lightParams = {
   color: 0xffffff, intensity: 1, distance: 100, decay: 3
};
var $;
var renderer, scene, light, camera, box, eye;

/*import { StereoscopicEffects } from 'threejs-StereoscopicEffects';*/
//import { Interaction } from 'three.interaction';

var load3D = function() {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, preserveDrawingBuffer: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    // default THREE.PCFShadowMap
    renderer.setSize(sw, sh);

    renderer.enable3d = 1;
    renderer.domElement.style.position = "absolute";
    //renderer.domElement.style.display = "none";
    renderer.domElement.style.left = (0)+"px";
    renderer.domElement.style.top = (0)+"px";
    renderer.domElement.style.width = (sw)+"px";
    renderer.domElement.style.height = (sh)+"px";
    //renderer.domElement.style.border = "1px solid #fff";
    //renderer.domElement.style.borderRadius = "50%";
    //renderer.domElement.style.scale = "0.8";
    //renderer.domElement.style.border = "2px solid #ccc";
    renderer.domElement.style.zIndex = "25";
    document.body.appendChild( renderer.domElement ); 

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    renderer.domElement.onclick = function(e) {
        mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, virtualCamera );

        // calculate objects intersecting the picking ray
        console.log(scene.children);

        var intersects = raycaster.intersectObjects( scene.children );
        console.log(intersects.length);

        if (intersects.length > 0) {
            controls.target = 
            new THREE.Vector3(0, 0, (1+Math.sqrt(2)));
            controls.update();
        };
    };

    scene = new THREE.Scene();
    //scene.background = null;
    scene.background = new THREE.Color("#000"); 

    light = new THREE.PointLight(
        lightParams.color,
        lightParams.intensity,
        lightParams.distance,
        lightParams.decay
    );

    light.position.set(0, 2.5, 2.5);
    light.castShadow = true;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default

    lightObj = new THREE.Group();
    //lightObj.add(light);

    virtualCamera = new THREE.PerspectiveCamera( 
        cameraParams.fov, 
        cameraParams.aspectRatio, 
        cameraParams.near, 
        cameraParams.far 
    );
    virtualCamera.add(light);

    scene.add(lightObj);
    scene.add(virtualCamera);

    group = new THREE.Group();
    //group.rotation.x = -(Math.PI/2);
    scene.add(group);

    var geometry = new THREE.SphereGeometry(0.01, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var sphere = new THREE.Mesh(geometry, material );
    group.add(sphere);

    rec = new CanvasRecorder(renderer.domElement);

    cameraTargetGroup = new THREE.Group();
    cameraTargetGroup.position.y = 1.5;
    cameraTargetGroup.position.z = 2.9;

    var geometry = new THREE.SphereGeometry(0.01, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    cameraTarget = new THREE.Mesh(geometry, material);
    cameraTarget.position.y = 0;
    scene.add(cameraTarget);

    virtualCamera.position.set(
        cameraTargetGroup.position.x, 
        cameraTargetGroup.position.y, 
        cameraTargetGroup.position.z
    );

    var worldPos = new THREE.Vector3();
    cameraTarget.getWorldPosition(worldPos);
    virtualCamera.lookAt(
        worldPos.x,
        worldPos.y,
        worldPos.z,
    );

    controls = new THREE.OrbitControls(virtualCamera,
    renderer.domElement);
    controls.target = cameraTarget.position;
    controls.update();

    変数 = sw/1.2;

    const defaultEffect = 0; // Single view left
    //const defaultEffect = 21; // Anaglyph RC half-colors

    stereofx = new StereoscopicEffects(renderer, defaultEffect);
    stereofx.setSize(sw, sh);

    renderer.domElement.style.width = (sw)+"px";
    renderer.domElement.style.height = (sh)+"px";

    modes = StereoscopicEffects.effectsListForm();
    modes.value = defaultEffect;
    modes.style.position = 'absolute';
    //modes.style.display = "none";
    modes.style.fontFamily = "Khand";
    modes.style.textAlign = "center";
    modes.style.background = "#fff";
    modes.style.left = (((sw-変数)/2)+(sw/2)-(sw/2))+"px";+"px";
    modes.style.top = (10)+"px";
    modes.style.width = (変数)+"px";
    modes.style.height = (sw/9)+"px";
    modes.style.zIndex = "25";
    modes.addEventListener('change', () => {
        stereofx.setEffect(modes.value);
    });
    document.body.appendChild(modes);

    eyeSep = document.createElement("input");
    eyeSep.type = "range";
    //eyeSep.style.display = "none";
    eyeSep.min = -0.05;
    eyeSep.step = 0.05;
    eyeSep.max = 1;
    eyeSep.value = 0;
    eyeSep.style.position = 'absolute';
    eyeSep.style.background = "#fff";
    eyeSep.style.left = (((sw-変数)/2)+(sw/2)-(sw/2))+"px";
    eyeSep.style.top = (20+(sw/9))+"px";
    eyeSep.style.width = (変数)+"px";
    eyeSep.style.height = (sw/9)+"px"
    eyeSep.style.zIndex = "25";
    eyeSep.addEventListener('change', () => {
        stereofx.setEyeSeparation(eyeSep.value);
    });
    stereofx.setEyeSeparation(eyeSep.value);
    document.body.appendChild(eyeSep);

    var canTexture = false;

    render = true;
    iterations = 9999999999;
    animateThreejs = function() {
        iterations -= 1;
        if (iterations > 0 && render)
        req = requestAnimationFrame( animateThreejs );

        if (cannonStarted) {
            updateCannonjs();

            /*
            cameraTargetGroup.position.x = ball0.position.x;
            cameraTargetGroup.position.y = ball0.position.y;
            cameraTargetGroup.position.z = ball0.position.z;

            virtualCamera.position.set(
                cameraTargetGroup.position.x, 
                cameraTargetGroup.position.y, 
                cameraTargetGroup.position.z
            );*/
        }

        group.rotateZ(analogPosition.x*(Math.PI/180));

        controls.update();
        if (renderer.enable3d == 0) {
            renderer.render( scene, virtualCamera );
        }
        else if (renderer.enable3d == 1) {
            if (eyeSep.value < 0) 
            renderer.render( scene, virtualCamera );
            else stereofx.render( scene, virtualCamera );
        }
    };

    createMap();
    animateThreejs();
}

var startAnimation = function() {
    render = true;
    animateThreejs();
};

var pauseAnimation = function() {
    render = false;
};

THREE.Object3D.prototype.loadTexture = 
function(url, callback, type="D") {
var rnd = Math.random();
new THREE.TextureLoader().load(url, 
    texture => {
        //Update Texture
        if (this.material) {
        if (type == "D") {
            //console.log("loaded texture");
            this.material.transparent = true;
            this.material.map = texture;
            this.material.needsUpdate = true;
        }
        else if (type == "N") {
            this.material.transparent = true;
            this.material.normalMap = texture;
            this.material.needsUpdate = true;
        }
        else if (type == "O") {
            this.material.transparent = true;
            this.material.alphaMap = texture;
            this.material.needsUpdate = true;
        }
        }
        else {
        if (type == "D") {
            //console.log("loaded texture obj");
            this.children[0].material.transparent = true;
            this.children[0].material.map = texture;
            this.children[0].material.needsUpdate = true;
        }
        else if (type == "N") {
            this.children[0].material.transparent = true;
            this.children[0].material.normalMap = texture;
            this.children[0].material.needsUpdate = true;
        }
        else if (type == "O") {
            this.children[0].material.transparent = true;
            this.children[0].material.alphaMap = texture;
            this.children[0].material.needsUpdate = true;
        }
        }

        if (callback)
        callback();
    },
    xhr => {
       //Download Progress
       console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    error => {
       //Error CallBack
        console.log("An error happened", error);
    });
};

var loadOBJ = function(path, callback) {
    var loader = new THREE.OBJLoader();
    // load a resource
    // resource URL
    // called when resource is loaded
    loader.load(path, callback,
    // called when loading is in progresses
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
    // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
};

var cannonStarted = false;

var createMap = function() {
    var sphereGeometry = 
    new THREE.SphereGeometry(2, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );

    sphereGeometry.applyMatrix4(
    new THREE.Matrix4().makeTranslation(0, 1.7, 0));

    var sphere = 
    new THREE.Mesh(sphereGeometry, material );
    sphere.position.y = 1;

    var boxGeometry = 
    new THREE.BoxGeometry(2, 0.3, 2); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );
    var box = 
    new THREE.Mesh(boxGeometry, material );

    var curveCSG = CSG.fromMesh(sphere);
    var boxCSG = CSG.fromMesh(box);

    var stadiumCSG = boxCSG.subtract(curveCSG);
    var stadiumGeometry = CSG.toGeometry(stadiumCSG);

    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );
    var stadium0 = 
    new THREE.Mesh(stadiumGeometry, material);
    stadium0.position.y = -1;

    var sphereGeometry = 
    new THREE.SphereGeometry(1.5, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );

    sphereGeometry.applyMatrix4(
    new THREE.Matrix4().makeTranslation(0, 1.43, 0));

    var sphere = 
    new THREE.Mesh(sphereGeometry, material );
    sphere.position.y = 1;

    var boxGeometry = 
    new THREE.BoxGeometry(2, 0.3, 2); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );
    var box = 
    new THREE.Mesh(boxGeometry, material );

    var curveCSG = CSG.fromMesh(sphere);
    var boxCSG = CSG.fromMesh(box);

    var stadiumCSG = boxCSG.subtract(curveCSG);
    var stadiumGeometry = CSG.toGeometry(stadiumCSG);

    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );
    var stadium1 = 
    new THREE.Mesh(stadiumGeometry, material);
    stadium1.position.y = -1.3;

    var boxGeometry = 
    new THREE.BoxGeometry(3, 0.6, 3); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );
    var box0 = 
    new THREE.Mesh(boxGeometry, material );

    var boxGeometry = 
    new THREE.BoxGeometry(2, 0.6, 2); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );
    var box1 = 
    new THREE.Mesh(boxGeometry, material );

    var box0CSG = CSG.fromMesh(box0);
    var box1CSG = CSG.fromMesh(box1);

    var stadiumCSG = box0CSG.subtract(box1CSG);
    var stadiumGeometry = CSG.toGeometry(stadiumCSG);

    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );
    var stadium2 = 
    new THREE.Mesh(stadiumGeometry, material);
    stadium2.position.y = -1.15;

    var cone0Geometry = 
    new THREE.CylinderGeometry(0.25, 0.001, 0.15, 8); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xff9900,
        opacity: 1,
        transparent: true
    } );

    var cone0 = 
    new THREE.Mesh(cone0Geometry, material);

    var cone1Geometry = 
    new THREE.CylinderGeometry(0.1, 0.1, 0.1, 8); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xff9900,
        opacity: 1,
        transparent: true
    } );

    cone1Geometry.applyMatrix4(
    new THREE.Matrix4().makeTranslation(0, 0.1, 0));

    var cone1 = 
    new THREE.Mesh(cone1Geometry, material);

    var cone0CSG = CSG.fromMesh(cone0);
    var cone1CSG = CSG.fromMesh(cone1);

    var coneCSG = cone0CSG.subtract(cone1CSG);
    var coneGeometry = CSG.toGeometry(coneCSG);

    csg0 = 
    new THREE.Mesh(coneGeometry, material);
    csg0.position.x = -0.5

    csg1 = csg0.clone();
    csg1.material = csg0.material.clone();
    csg1.material.color = new THREE.Color("rgb(100, 100, 255)");
    csg1.position.x = 0.5

    group.add(csg0);
    group.add(csg1);

    group.add(stadium0);
    group.add(stadium1);
    group.add(stadium2);

    var cubeGeometry = 
    new THREE.BoxGeometry(0.25, 0.25, 0.25); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0x5555ff,
        opacity: 1,
        wireframe: true
    } );

    var cube = 
    new THREE.Mesh(cubeGeometry, material);

    cube.position.x = 1.25;
    cube.position.z = -1.25;

    group.add(cube);

    var planeGeometry = 
    new THREE.PlaneGeometry(3, 3, 8, 8); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0x5555ff,
        opacity: 0.5,
        wireframe: true
    } );

    var plane = 
    new THREE.Mesh(planeGeometry, material);
    plane.rotation.x = -(Math.PI/2);
    plane.position.y = -1.15;

    group.add(plane);

    startCannonjs(function() {
        addGeometry(csg0, true);
        addGeometry(csg1, true);

        //addIndexedGeometry(cube, true);
        addBox(cube, [ 0.25, 0.25, 0.25 ] , true);

        addGeometry(stadium0);
        addGeometry(stadium1);
        addGeometry(stadium2);

        addPlane(plane);

        clock = new THREE.Clock();

        setTimeout(function() {
            cannonStarted = true;
        }, 1000);
    });
};