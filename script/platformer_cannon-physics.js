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
        vertices[n] = verticesPos[n];
        vertices[n + 1] = verticesPos[n + 1];
        vertices[n + 2] = verticesPos[n + 2];
    }

    for (var n = 0; n < vertices.length; n += 3) {
        indices[n] = n;
        indices[n + 1] = n+1;
        indices[n + 2] = n+2;
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
        vertices[n] = verticesPos[n];
        vertices[n + 1] = verticesPos[n + 1];
        vertices[n + 2] = verticesPos[n + 2];
    }

    for (var n = 0; n < indicesPos.length; n += 3) {
        indices[n] = indicesPos[n];
        indices[n + 1] = indicesPos[n + 1];
        indices[n + 2] = indicesPos[n + 2];
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

var addPlane = function(mesh, isRigidBody) {
    var shape = new CANNON.Plane();
    var body = new CANNON.Body({ mass: (isRigidBody ? 1 : 0) });
    body.addShape(shape);
    body.position.x = mesh.position.x;
    body.position.y = mesh.position.y;
    body.position.z = mesh.position.z;

    body.quaternion.set(
        mesh.quaternion.x,
        mesh.quaternion.y,
        mesh.quaternion.z,
        mesh.quaternion.w
    );

    physicsWorld.addBody(body);

    //if (isRigidBody) {
        mesh.userData.physicsBody = body;
        rigidBodies.push(mesh);
    //}
};

var addBox = function(mesh, size, isRigidBody) {
    var shape = new CANNON.Box(
        new CANNON.Vec3(size[0], size[1], size[2])
    );
    var body = new CANNON.Body({ mass: (isRigidBody ? 1 : 0) });
    body.addShape(shape);
    body.position.x = mesh.position.x;
    body.position.y = mesh.position.y;
    body.position.z = mesh.position.z;

    body.quaternion.set(
        mesh.quaternion.x,
        mesh.quaternion.y,
        mesh.quaternion.z,
        mesh.quaternion.w
    );

    physicsWorld.addBody(body);

    //if (isRigidBody) {
        mesh.userData.physicsBody = body;
        rigidBodies.push(mesh);
    //}
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