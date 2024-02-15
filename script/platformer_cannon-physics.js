var physicsWorld;
var rigidBodies = [];

var setupPhysicsWorld = function(){
    physicsWorld = new CANNON.World();
    physicsWorld.gravity.set(0, -9.8, 0);
};

var startCannonjs = function(callback) {
    console.log("startCannonjs");
    setupPhysicsWorld();
    callback();
};

var addGeometry = function(mesh, isRigidBody) {
    var geometry = mesh.geometry;

    var verticesPos = geometry.getAttribute("position").array;

    var vertices = [];
    var indices = [];

    for (var n = 0; n < verticesPos.length; n += 3) {
        var vect = new CANNON.Vec3(
            verticesPos[n],
            verticesPos[n + 1],
            verticesPos[n + 2]
        );
        vertices.push(vect);
    }

    for (var n = 0; n < vertices.length; n += 3) {
        indices.push([
            vertices[n].x,
            vertices[n].y,
            vertices[n].z
        ]);
    }

    // Cannonjs Section
    var shape = new CANNON.Trimesh(vertices, indices);
    var body = new CANNON.Body({ mass: (isRigidBody ? 1 : 0) });
    body.addShape(shape);
    body.position.x = mesh.position.x;
    body.position.y = mesh.position.y;
    body.position.z = mesh.position.z;

    physicsWorld.addBody(body);

    if (isRigidBody) {
        mesh.userData.physicsBody = body;
        rigidBodies.push(mesh);
    }
};

var addIndexedGeometry = function(mesh, isRigidBody) {
    var geometry = mesh.geometry;

    var verticesPos = geometry.getAttribute("position").array;
    var indicesPos = geometry.index.array;

    var vertices = [];
    var indices = [];

    for (var n = 0; n < verticesPos.length; n += 3) {
        var vect = new CANNON.Vec3(
            verticesPos[n],
            verticesPos[n + 1],
            verticesPos[n + 2]
        );
        vertices.push(vect);
    }

    for (var n = 0; n < indicesPos.length; n += 3) {
        indices.push([ 
            indicesPos[n],
            indicesPos[n + 1],
            indicesPos[n + 2]
        ])
    }

    // Cannonjs Section
    var shape = new CANNON.Trimesh(vertices, indices);
    var body = new CANNON.Body({ mass: (isRigidBody ? 1 : 0) });
    body.addShape(shape);
    body.position.x = mesh.position.x;
    body.position.y = mesh.position.y;
    body.position.z = mesh.position.z;

    physicsWorld.addBody(body);

    if (isRigidBody) {
        mesh.userData.physicsBody = body;
        rigidBodies.push(mesh);
    }
};

var physicsIterations = 0;
var updateCannonjs = function() {
    var deltaTime = clock.getDelta();

    // Step world
    physicsWorld.step(deltaTime);

    updateArr(rigidBodies);

    physicsIterations++;
};

var updateArr = function(rigidBodies) {
    // Update rigid bodies
    for (var n = 0; n < rigidBodies.length; n++) {
        if (rigidBodies[n].userData.pausePhysics) continue;

        var objThree = rigidBodies[n];
        var objCannon = objThree.userData.physicsBody;

        objThree.position.set(
            objCannon.position.x,
            objCannon.position.y,
            objCannon.position.z
        );

        objThree.quaternion.set(
            objCannon.quaternion.x,
            objCannon.quaternion.y,
            objCannon.quaternion.z,
            objCannon.quaternion.w
        );
    }
};