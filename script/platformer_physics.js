var physicsWorld;

const FLAGS = {
    CF_KINEMATIC_OBJECT: 2
};
const STATE = {
    ACTIVE : 1,
    ISLAND_SLEEPING : 2,
    WANTS_DEACTIVATION : 3,
    DISABLE_DEACTIVATION : 4,
    DISABLE_SIMULATION : 5
};

var rigidBodies = [], 
       rigidBodies2 = [], 
       tmpTrans;

var ammoTmpPos;
var ammoTmpQuat;

var tmpPos;
var tmpQuat;

var setup = function() {
    console.log("setup");
    rigidBodies = [];
    tmpTrans = new Ammo.btTransform();
    ammoTmpPos = new Ammo.btVector3();
    ammoTmpQuat = new Ammo.btQuaternion();
    tmpPos = new THREE.Vector3();
    tmpQuat = new THREE.Quaternion();
};

var setupPhysicsWorld = function(){

    var collisionConfiguration = 
    new Ammo.btDefaultCollisionConfiguration(),
    dispatcher = 
    new Ammo.btCollisionDispatcher(collisionConfiguration),
    overlappingPairCache =
    new Ammo.btDbvtBroadphase(),
    solver =
    new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld =
    new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));

};

var startAmmojs = function() {
    console.log("startAmmojs");
    setupPhysicsWorld();

    //addGround(plane, { x: 7*1.1, y: 7*1.1, z: 0.1 });

    //startGyroscopeMonitor();
};

var addGeometry = function(mesh, isRigidBody) {
    var geometry = mesh.geometry;

    var pos = mesh.position;
    var scale = { x: 1, y: 1, z: 1 };
    var quat = mesh.quaternion;
    var mass = isRigidBody ? 1 : 0;

    var triangleMesh = new Ammo.btTriangleMesh();

    var vectA = new Ammo.btVector3(0, 0, 0);
    var vectB = new Ammo.btVector3(0, 0, 0);
    var vectC = new Ammo.btVector3(0, 0, 0);

    var verticesPos = geometry.getAttribute("position").array;
    var triangles = [];
    for (let i = 0; i < verticesPos.length; i += 3) {
        triangles.push({
                x: verticesPos[i],
                y: verticesPos[i + 1],
                z: verticesPos[i + 2]
        })
    }

    for (var i = 0; i < triangles.length - 3; i += 3) {
        vectA.setX(triangles[i].x);
        vectA.setY(triangles[i].y);
        vectA.setZ(triangles[i].z);

        vectB.setX(triangles[i + 1].x);
        vectB.setY(triangles[i + 1].y);
        vectB.setZ(triangles[i + 1].z);

        vectC.setX(triangles[i + 2].x);
        vectC.setY(triangles[i + 2].y);
        vectC.setZ(triangles[i + 2].z);

        triangleMesh.addTriangle(vectA, vectB, vectC, true);
    }

    //Ammojs Section
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var shape = 
    new Ammo.btBvhTriangleMeshShape(triangleMesh, true);
    geometry.verticesNeedUpdate = true
    shape.setMargin(0.05);

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    shape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    body.threeObject = mesh;
    physicsWorld.addRigidBody( body );

    mesh.userData.physicsBody = body;
    mesh.userData.tag = "ground";

    if (isRigidBody)
    rigidBodies.push(mesh);
};

var addIndexedGeometry = function(mesh, isRigidBody) {
    var geometry = mesh.geometry;

    var pos = mesh.position;
    var scale = { x: 1, y: 1, z: 1 };
    var quat = mesh.quaternion;
    var mass = isRigidBody ? 1 : 0;

    var triangleMesh = new Ammo.btTriangleMesh();

    var vectA = new Ammo.btVector3(0, 0, 0);
    var vectB = new Ammo.btVector3(0, 0, 0);
    var vectC = new Ammo.btVector3(0, 0, 0);

    var verticesPos = geometry.getAttribute("position").array;
    var indicesPos = geometry.index.array;

    var triangles = [];
    for (var n = 0; n < verticesPos.length; n += 3) {
        triangles.push({
            x: verticesPos[n],
            y: verticesPos[n + 1],
            z: verticesPos[n + 2]
        })
    }

    var indices = [];
    for (var n = 0; n < indicesPos.length; n += 3) {
        indices.push({
            a: indicesPos[n],
            b: indicesPos[n + 1],
            c: indicesPos[n + 2]
        })
    }

    for (var n = 0; n < indices.length; n ++) {
        var face = indices[n];

        vectA.setX(triangles[face.a].x);
        vectA.setY(triangles[face.a].y);
        vectA.setZ(triangles[face.a].z);

        vectB.setX(triangles[face.b].x);
        vectB.setY(triangles[face.b].y);
        vectB.setZ(triangles[face.b].z);

        vectC.setX(triangles[face.c].x);
        vectC.setY(triangles[face.c].y);
        vectC.setZ(triangles[face.c].z);

        triangleMesh.addTriangle(vectA, vectB, vectC, true);
    }

    //Ammojs Section
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var shape = 
    new Ammo.btBvhTriangleMeshShape(triangleMesh, true);
    geometry.verticesNeedUpdate = true
    shape.setMargin(0.05);

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    shape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    body.threeObject = mesh;
    physicsWorld.addRigidBody( body );

    mesh.userData.physicsBody = body;
    mesh.userData.tag = "ground";

    if (isRigidBody)
    rigidBodies.push(mesh);
};

var addGround = function(ground, size) {
    var pos = ground.position;
    var scale = size; //ground.scale;
    var quat = ground.quaternion;
    var mass = 0;

    //Ammojs Section
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
    colShape.setMargin( 0.05 );

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    body.threeObject = ground;
    physicsWorld.addRigidBody( body );

    ground.userData.physicsBody = body;
    ground.userData.tag = "ground";
};

var addCube = function(cube, size, kinematic=false) {
    //console.log(cube);

    var pos = cube.position;
    var scale = size; //{ x: 1, y: 1, z: 1 };
    var quat = cube.quaternion;
    var mass = 1;
       /*(cube.children[7].scale.x +
       cube.children[7].scale.y + 
       cube.children[7].scale.z) / 3;*/

    //Ammojs Section
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
    colShape.setMargin( 0.05 );

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    body.setActivationState(4);
    if (kinematic) body.setCollisionFlags(2);
    body.setRestitution(0);
    body.setFriction(50);

    //console.log(cube.userData.no);
    body.no = cube.userData.no;
    body.threeObject = cube;
    physicsWorld.addRigidBody( body );

    cube.userData.pausePhysics = false;
    cube.userData.physicsBody = body;
    cube.userData.tag = "cube";
    rigidBodies.push(cube);

    return body;
};

var addCone = function(cube, size, kinematic=false) {
    //console.log(cube);

    var pos = cube.position;
    var scale = size; //{ x: 1, y: 1, z: 1 };

    var clone = cube.clone();
    clone.rotation.z = -(Math.PI);

    var quat = clone.quaternion;
    var mass = 1;
       /*(cube.children[7].scale.x +
       cube.children[7].scale.y + 
       cube.children[7].scale.z) / 3;*/

    //Ammojs Section
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var colShape = new Ammo.btConeShape(0.25 * 0.25, 0.15 * 0.25);
    colShape.setMargin( 0.05 );

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    //console.log(cube.userData.no);
    body.no = cube.userData.no;
    body.threeObject = cube;
    physicsWorld.addRigidBody( body );

    cube.userData.pausePhysics = false;
    cube.userData.physicsBody = body;
    cube.userData.isCone = true;
    cube.userData.tag = "cube";
    rigidBodies.push(cube);

    return body;
};

var updateBody = function(threeObj, speed) {
   var physicsBody = threeObj.userData.physicsBody;
   physicsBody.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);

   threeObj.getWorldPosition(tmpPos);
   threeObj.getWorldQuaternion(tmpQuat);

    var ms = physicsBody.getMotionState();
    if (ms) {
        ammoTmpPos.setValue(tmpPos.x, tmpPos.y, tmpPos.z);
        ammoTmpQuat.setValue(tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w);

        tmpTrans.setIdentity();
        tmpTrans.setOrigin(ammoTmpPos); 
        tmpTrans.setRotation(ammoTmpQuat); 

        ms.setWorldTransform(tmpTrans);
    }

    //physicsBody.setCollisionFlags( 0 );
    //ammoTmpPos.setValue(speed.x, 0, speed.y);
    //physicsBody.setLinearVelocity(ammoTmpPos);
}

var addSphere = function(sphere, size, kinematic=false) {
    var book = sphere;

    var pos = book.position;
    var scale = size;
    var quat = book.quaternion;
    var mass = 1;

    //Ammojs Section
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var colShape = new Ammo.btSphereShape( size );
    colShape.setMargin( 0.05 );

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    if (kinematic) {
        body.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);
    }
    body.setActivationState(STATE.DISABLE_DEACTIVATION);

    body.threeObject = book;
    physicsWorld.addRigidBody( body );

    book.userData.pausePhysics = false;
    book.userData.physicsBody = body;
    book.userData.n =  rigidBodies.length;
    rigidBodies.push(book);

    return body;
};

var removeBody = function(n) {
    physicsWorld.removeRigidBody(
        rigidBodies.splice(n, 1)
    );
}

var physicsIterations = 0;
var updateAmmojs = function() {
    var deltaTime = clock.getDelta();
    clock.sum += deltaTime;

    // Step world
    physicsWorld.stepSimulation( deltaTime, 10 );

    updateArr(rigidBodies);
    //updateArr(rigidBodies2);

    physicsIterations++;
    //console.clear();
    //console.log("iteration no: "+physicsIterations);
    //ws.send("BOOK-ORDER|"+playerId+"|AMMO|"+worldToJSON());
};

var updateArr = function(rigidBodies) {
    // Update rigid bodies
    for ( let i = 0; i < rigidBodies.length; i++ ) {
        if (rigidBodies[i].userData.pausePhysics) continue;
        var objThree = rigidBodies[ i ];
        var objAmmo = objThree.userData.physicsBody;
        var objHelper = objAmmo.helper;
        var ms = objAmmo.getMotionState();
        if (ms) {
            ms.getWorldTransform(tmpTrans);
            var p = tmpTrans.getOrigin();
            var q = tmpTrans.getRotation();
            var offset = objThree.userData.offset;

            objThree.position.set(p.x(), p.y(), p.z());
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

            if (objThree.userData.isCone)
            objThree.rotateZ(-(Math.PI));

            // Box for .obj
            if (objHelper) {
                objHelper.position.set(p.x(), p.y(), p.z());
                objHelper.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }
};

var jump = function(obj) {
    var objThree = obj; //rigidBodies[0];
    var objAmmo = objThree.userData.physicsBody;
    var physicsBody = objAmmo;

    var gravity = physicsWorld.getGravity();

    var fx = -((1/9.8) * gravity.x()) * 
    (Math.floor(Math.random()*30)+150);
    var fy = -((1/9.8) * gravity.y()) * 
    (Math.floor(Math.random()*30)+150);
    var fz = -((1/9.8) * gravity.z()) * 
    (Math.floor(Math.random()*30)+150);

    ammoTmpPos.setValue(fx, fy, fz);
    physicsBody.applyForce(ammoTmpPos);

    var rx = Math.floor(Math.random()*20)+10;
    var ry = Math.floor(Math.random()*20)+10;
    var rz = Math.floor(Math.random()*20)+10;

    ammoTmpPos.setValue(rx, ry, rz);
    physicsBody.applyTorque(ammoTmpPos);
};

var push = function(obj, from) {
    var objThree = obj; //rigidBodies[0];
    var objAmmo = objThree.userData.physicsBody;
    var physicsBody = objAmmo;

    var gravity = physicsWorld.getGravity();

    var fx = -((1/9.8) * gravity.x()) * (30);
    var fy = -((1/9.8) * gravity.y()) * (30);
    var fz = -((1/9.8) * gravity.z()) * (30);

    ammoTmpPos.setValue(fx, fy, fz);
    physicsBody.applyForce(ammoTmpPos);

    var rx = 0;
    var ry = 0;
    var rz = 0;

    console.log(from);

    if (from == 0) rz = -5;
    else if (from == 1) rx = 5;
    else if (from == 2) rz = 5;
    else if (from == 3) rx = -5;

    ammoTmpPos.setValue(rx, ry, rz);
    console.log(rx, ry, rz);
    physicsBody.applyTorque(ammoTmpPos);
};

var spin = function(obj) {
    var objThree = obj; //rigidBodies[0];
    var objAmmo = objThree.userData.physicsBody;
    var physicsBody = objAmmo;

    var fy = Math.floor(Math.random()*30)+10;

    ammoTmpPos.setValue(0, fy, 0);
    physicsBody.applyForce(ammoTmpPos);

    var rx = Math.floor(Math.random()*300)+10;
    var ry = Math.floor(Math.random()*300)+10;
    var rz = Math.floor(Math.random()*300)+10;

    ammoTmpPos.setValue(rx, ry, rz);
    physicsBody.applyTorque(ammoTmpPos);
};

var getDistance = function(body0, body1) {
    var tmpTrans0 = new Ammo.btTransform();
    var tmpTrans1 = new Ammo.btTransform();

    /*console.log(body0);
    console.log(body1);*/

    var ms0 = body0.getMotionState();
    var ms1 = body1.getMotionState();

    /*console.log(ms0);
    console.log(ms1);*/
    
    ms0.getWorldTransform(tmpTrans0);
    var p0 = tmpTrans0.getOrigin();
    var q0 = tmpTrans0.getRotation();

    ms1.getWorldTransform(tmpTrans1);
    var p1 = tmpTrans1.getOrigin();
    var q1 = tmpTrans1.getRotation();

    /*console.log(p0.x(), p0.y(), p0.z());
    console.log(p1.x(), p1.y(), p1.z());

    console.log(q0.x(), q0.y(), q0.z(), q0.w());
    console.log(q1.x(), q1.y(), q1.z(), q1.w());*/

    var x = Math.abs(p1.x() - p0.x());
    var y = Math.abs(p1.y() - p0.y());
    var z = Math.abs(p1.z() - p0.z());
    /*console.log(x, y, z);*/

    var h = Math.sqrt(
       Math.pow(x, 2)+
       Math.pow(z, 2));

    return Math.sqrt(Math.pow(h, 2)+Math.pow(y, 2));
};

var detectCollision = function(){
    var dispatcher = physicsWorld.getDispatcher();
    var numManifolds = dispatcher.getNumManifolds();

    for ( var i = 0; i < numManifolds; i ++ ) {
        var contactManifold = dispatcher.getManifoldByIndexInternal( i );
        var numContacts = contactManifold.getNumContacts();

        for ( let j = 0; j < numContacts; j++ ) {
            var contactPoint = contactManifold.getContactPoint( j );
            var distance = contactPoint.getDistance();

            if( distance > -0.03 ) continue;
            //console.log(distance);

            var rb0 = Ammo.castObject( contactManifold.getBody0(), Ammo.btRigidBody );
            var rb1 = Ammo.castObject( contactManifold.getBody1(), Ammo.btRigidBody );
            var threeObject0 = rb0.threeObject;
            var threeObject1 = rb1.threeObject;
            if ( ! threeObject0 && ! threeObject1 ) continue;
            var userData0 = threeObject0 ? threeObject0.userData : null;
            var userData1 = threeObject1 ? threeObject1.userData : null;
            var tag0 = userData0 ? userData0.tag : "none";
            var tag1 = userData1 ? userData1.tag : "none";

            if (threeObject0.dice != undefined)
            threeObject0.dice.collided = true;
            else if (threeObject1.dice != undefined)
            threeObject1.dice.collided = true;

            beepPool.play("audio/wood-hit.wav", function() {
                if (threeObject0.dice != undefined)
                threeObject0.dice.collided = false;
                else if (threeObject1.dice != undefined)
                threeObject1.dice.collided = false;
            });

            /*console.log({manifoldIndex: i, contactIndex: j, distance: distance});*/
        }
    }
}

var startGyroscopeMonitor = function() {
    motion = true;
    gyroUpdated = function(e) {
        physicsWorld.setGravity(
        new Ammo.btVector3(-e.accX, -e.accY, -e.accZ));
        return;
        var theta = Math.atan2(e.accY, e.accX);
        // range (-PI, PI]
        if (theta < 0) theta = (2*Math.PI) + theta; // range [0, 360)
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)

        $(renderer.domElement)
        .css("transform", "rotateZ("+(-theta+90)+"deg)");
    };
};

var stopGyroscopeMonitor = function() {
    motion = false;
    $(renderer.domElement)
    .css("transform", "initial");
};