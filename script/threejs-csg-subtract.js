var createMap = function() {
    var geometry = new THREE.PlaneGeometry(5, 5, 8, 8); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var plane = new THREE.Mesh(geometry, material );
    group.add(plane);
    plane.rotation.x = -(Math.PI/2);

    plane.position.y =  -(5/4);

    var vehicleGroup = new THREE.Group();
    scene.add(vehicleGroup);

    var geometry = 
    new THREE.CylinderGeometry(0.5, 0.5, 0.25, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var frontLeft_wheel = new THREE.Mesh(geometry, material );
    vehicleGroup.add(frontLeft_wheel);

    frontLeft_wheel.position.x = -1;
    frontLeft_wheel.position.z = 1;

    frontLeft_wheel.rotation.x = -(Math.PI/2);
    frontLeft_wheel.rotation.z = -(Math.PI/2);

    var geometry = 
    new THREE.CylinderGeometry(0.5, 0.5, 0.25, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var frontRight_wheel = 
    new THREE.Mesh(geometry, material );
    vehicleGroup.add(frontRight_wheel);

    frontRight_wheel.position.x = 1;
    frontRight_wheel.position.z = 1;

    frontRight_wheel.rotation.x = -(Math.PI/2);
    frontRight_wheel.rotation.z = -(Math.PI/2);

    var geometry = 
    new THREE.CylinderGeometry(0.5, 0.5, 0.25, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var backLeft_wheel = new THREE.Mesh(geometry, material );
    vehicleGroup.add(backLeft_wheel);

    backLeft_wheel.position.x = -1;
    backLeft_wheel.position.z = -1;

    backLeft_wheel.rotation.x = -(Math.PI/2);
    backLeft_wheel.rotation.z = -(Math.PI/2);

    var geometry = 
    new THREE.CylinderGeometry(0.5, 0.5, 0.25, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var backRight_wheel = 
    new THREE.Mesh(geometry, material );
    vehicleGroup.add(backRight_wheel);

    backRight_wheel.position.x = 1;
    backRight_wheel.position.z = -1;

    backRight_wheel.rotation.x = -(Math.PI/2);
    backRight_wheel.rotation.z = -(Math.PI/2);

    var geometry = 
    new THREE.BoxGeometry(1.65, 0.3, 2); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var box = new THREE.Mesh(geometry, material );
    vehicleGroup.add(box);

    base_group = new THREE.Group();
    vehicleGroup.add(base_group);

    var geometry = 
    new THREE.CylinderGeometry(0.5, 0.5, 0.25, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var center_wheel = new THREE.Mesh(geometry, material );
    vehicleGroup.add(center_wheel);

    center_wheel.position.y = 0.275;
    base_group.position.y = 0.275;

    var geometry = 
    new THREE.CylinderGeometry(0.25, 0.25, 1, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var arm_base = 
    new THREE.Mesh(geometry, material );
    vehicleGroup.add(arm_base);

    arm_base.position.y = 0.9;

    join0_group = new THREE.Group();
    base_group.add(join0_group);

    var geometry = 
    new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var arm_joint0 = 
    new THREE.Mesh(geometry, material );
    base_group.add(arm_joint0);

    arm_joint0.position.y = 1.4+(0.5/4);
    join0_group.position.y = 1.4+(0.5/4);

    arm_joint0.rotation.z = -(Math.PI/2);

    var geometry = 
    new THREE.CylinderGeometry(0.25, 0.25, 1, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    arm_extension0 = 
    new THREE.Mesh(geometry, material );
    join0_group.add(arm_extension0);

    arm_extension0.position.y = 0.5+(0.5/2);

    join1_group = new THREE.Group();
    base_group.add(join1_group);

    var geometry = 
    new THREE.SphereGeometry(0.5, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var arm_joint1 = 
    new THREE.Mesh(geometry, material );
    join0_group.add(arm_joint1);

    arm_joint1.position.y = 1+(0.5/2)+(0.5/2);
    join1_group.position.y = 1+(0.5/2)+(0.5/2);
};

var createMap2 = function() {
    var geometry = new THREE.PlaneGeometry(10, 10, 8, 8); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var plane = new THREE.Mesh(geometry, material );
    group.add(plane);
    plane.rotation.x = -(Math.PI/2);

    plane.position.y =  -(5/4);

    var geometry = 
    new THREE.CylinderGeometry(2.5, 2.5, 0.25, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    } );
    var center_wheel = new THREE.Mesh(geometry, material );
    group.add(center_wheel);

    center_wheel.position.y = 0.275;

    pictureArr = [];

    for (var n = 0; n < 12; n++) {
    var geometry = new THREE.PlaneGeometry(1, 1, 8, 8); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );
    var picture = new THREE.Mesh(geometry, material );
    group.add(picture);

    var c = {
        x: 0,
        y: 0
    };
    var p = {
        x: c.x,
        y: c.y-3
    };
    var rp = _rotate2d(c, p, n*(360/12));

    picture.rotateY(n*((Math.PI*2)/12));

    picture.position.x = rp.x;
    picture.position.y =  1;
    picture.position.z = rp.y;

    //picture.loadTexture("img/line-draw-"+n+".png");
    pictureArr.push(picture);
    }

    // instantiate a loader
    loadOBJ("img/officechair-0.obj",
    function ( object ) {
        for (var n = 0; n < 12; n++) {
            var clone = object.clone();

            var c = {
        x: 0,
        y: 0
    };
    var p = {
        x: c.x,
        y: c.y-3.5
    };
    var rp = _rotate2d(c, p, n*(360/12));

    clone.rotateY((n*((Math.PI*2)/12))-Math.PI);

    clone.position.x = rp.x;
    clone.position.y =  -1;
    clone.position.z = rp.y;

             group.add(clone);
        }
    });
}

var ammoStarted = false;
var physicsIterations = 0;

var swing = new THREE.Group();
swing.position.x = 0;
swing.position.y = 5;

var swingRotationX = -((Math.PI*2)/30);

var createMap3 = function() {
    scene.add(swing);

    var geometry = 
    new THREE.SphereGeometry(0.45, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );
    var ball = 
    new THREE.Mesh(geometry, material );
    ball.position.y = -0.8;

    scene.add(ball);
    addSphere(ball, 1);

    var geometry = 
    new THREE.CircleGeometry(1, 32); 
    var material = new THREE.MeshBasicMaterial( {
        side: THREE.DoubleSide,
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );
    var circle = 
    new THREE.Mesh(geometry, material );
    circle.position.y = -0.8;
    circle.loadTexture("img/stripe-pattern-0_texture-0.png");

    scene.add(circle);

    var geometry = 
    new THREE.CircleGeometry(1, 32); 
    var material = new THREE.MeshBasicMaterial( {
        side: THREE.DoubleSide,
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );
    var circle = 
    new THREE.Mesh(geometry, material );
    circle.position.y = -0.8;
    //circle.position.z = 0.1;
    circle.loadTexture("img/stripe-pattern-0_texture-1.png");

    scene.add(circle);

    var sphereGeometry = 
    new THREE.SphereGeometry(0.5, 32); 
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        opacity: 1,
        transparent: true
    } );

    sphereGeometry.applyMatrix4(
    new THREE.Matrix4().makeTranslation(0, 0.5, 0));

    var sphere = 
    new THREE.Mesh(sphereGeometry, material );
    sphere.position.y = 1;

    var boxGeometry = 
    new THREE.BoxGeometry(1, 0.3, 1); 
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
    var stadium = 
    new THREE.Mesh(stadiumGeometry, material );
    stadium.position.y = -3;

    group.add(stadium);

    addGeometry(stadium);
};