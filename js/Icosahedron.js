/*

Author:		        James Marion Lynch			
Date:		        09-15-2020
Version:	        Alpha 1.0
Title:		        Demo of WebGL 3D Platonic Solids.		
Filename:	        Icosahedron.js
Languages:	        HTML5, CSS3 & JavaScript ES6 2015, WebGL and GLSL.

Dependencies:	    (Shown in the order they must be loaded in.)

Filenames			Description

Icosahedron.html	The main web page document.
normalize.css		The Cascading Style Sheet (generic from w3schoools.com free download.)
style.css	    	The Cascading Style Sheet (specific, all my code.)
math.js				The class definition file for Camera, Vec3, Vec4, Quat, Mat4, (3D graphics matrix math library.)
utils.js			Utility library of functions.
Icosahedron.js		(this file.)

Icosahedron using math.js & utils.js

An Icosahedron has 12 vertices & 20 faces.

Notes: 

1       After body loads, <body onload="setupWebGL();"> you are sent to function setupWebGL() in utils.js.
        It sets up canvas & gl variables, adds event listeners, ... & calls below. 

2       Next you are sent to function setupGraphicsPipeline() in CubeImg.js.
        The shaders are loaded, compiled & WebGL commands are called.
        
Shaders run compiled code directly on the graphics card!

DOES NOT CALL ON ANY createIcosa function, doing the work in pure WebGL calls.



*/

rotation = 0.0;
objOrigin.z = -15;

const positions = [ 0,0,-1.902, 0,0,1.902, -1.701,0,-0.8507, 1.701,0,0.8507, 1.376,-1.000,-0.8507,
	1.376,1.000,-0.8507,	-1.376,-1.000,0.8507, -1.376,1.000,0.8507, -0.5257,-1.618,-0.8507, 
	-0.5257,1.618,-0.8507, 0.5257,-1.618,0.8507,0.5257,1.618,0.8507 ],

	indices = [ [1,11,7],[1,7,6],[1,6,10],[1,10,3],[1,3,11],[4,8,0],[5,4,0],[9,5,0],[2,9,0],[8,2,0],
	[11,9,7],[7,2,6],[6,8,10],[10,4,3],[3,5,11],[4,10,8],[5,3,4],[9,11,5],[2,7,9],[8,6,2] ],

    modelViewMatrix = new Mat4();

var nFaces = indices.length,
    normalLocation,
    modelViewMatrixLocation,
    normals = [];

function setupGraphicsPipeline()
{
   var app = [], i = j = n = nx = ny = nz = v0 = v1 = v2 = 0;
   
   const prog = gl.createProgram(), 
         indicesBuffer = gl.createBuffer(),
         positionsBuffer = gl.createBuffer(),
         projectionMatrix = Mat4.perspective(fieldOfView, aspectRatio, NEAR_PLANE, FAR_PLANE);
         
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
   gl.bindBuffer(gl.ARRAY_BUFFER,         positionsBuffer);

   gl.attachShader(prog, getShader(gl, 'vsSource'));
   gl.attachShader(prog, getShader(gl, 'fvSource'));
   gl.linkProgram(prog);
   gl.useProgram(prog);

   var positionsLocation = gl.getAttribLocation(prog, 'aVertexPosition');
   gl.enableVertexAttribArray(positionsLocation);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
   gl.vertexAttribPointer(positionsLocation, 3, gl.FLOAT, false, 0, 0);

   for(i=0; i<nFaces; i++) { app = app.concat(indices[i]); }

   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(app), gl.STATIC_DRAW);
   normalLocation = gl.getUniformLocation(prog,'uNormalMatrix');
   
   for(i=0; i<nFaces; i++)
   {
     j = 3*indices[i][0];
     v0 = positions.slice(j,j+3);
     j = 3*indices[i][1];
     v1 = positions.slice(j,j+3);
     j = 3*indices[i][2];
     v2 = positions.slice(j,j+3);
     nx = (v1[1]-v0[1])*(v2[2]-v0[2]) - (v2[1]-v0[1])*(v1[2]-v0[2]);
     ny =-(v1[0]-v0[0])*(v2[2]-v0[2]) + (v2[0]-v0[0])*(v1[2]-v0[2]);
     nz = (v1[0]-v0[0])*(v2[1]-v0[1]) - (v2[0]-v0[0])*(v1[1]-v0[1]);
     n = Math.sqrt(nx*nx + ny*ny + nz*nz);
     normals[i] = [nx/n, ny/n, nz/n];
   }

   gl.uniformMatrix4fv(gl.getUniformLocation(prog,'uProjectionMatrix'), false, projectionMatrix);
   modelViewMatrixLocation = gl.getUniformLocation(prog,'uModelViewMatrix');
   gl.clearDepth(1.0);
   gl.enable(gl.DEPTH_TEST);
   gl.clearColor(0.0, 0.0, 0.0, 0.0);

   drawScene();
}

function drawScene()
{
    var i = off = 0;
      
/*

objOrigin is a new Vec3() class object created in utils.js.

var objOrigin = new Vec3(0, 0, -5);

My 3D Graphics Library for matrix math is file: 'math.js' & accepts Vec3(), Vec4(), & Array[]'s.
The origin is a get set accessor!

rotation is the amount of angle rotation in radians.

    (x, y, z)
The {1, 0, 0] is the axis to rotate about (x-axis.)
The {0, 1, 0] is the axis to rotate about (y-axis.)
The {0, 0, 1] is the axis to rotate about (z-axis.)

*/   
    modelViewMatrix.origin = objOrigin;
    modelViewMatrix.rotate(xRot/5,    [1, 0, 0]);  
    modelViewMatrix.rotate(yRot/5,    [0, 1, 0]);
    modelViewMatrix.rotate(zRot,      [0, 0, 1]);
    
    xRot = yRot = zRot = 0.0;
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);

    for(i=0; i<nFaces; i++)
    {
      gl.uniform3fv(normalLocation, normals[i]);
      gl.drawElements(gl.TRIANGLE_FAN, indices[i].length, gl.UNSIGNED_SHORT, off);
      off += 2 * indices[i].length;
    }
    gl.flush();
}

// eof
