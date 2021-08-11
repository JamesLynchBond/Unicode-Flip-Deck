/****************************************************
*  													*
*	Author:		James Marion Lynch			 		*
*  	Date:		12-07-2020                          *
* 	Version:	Alpha 1.0.0.0                      	*
* 	Title:		Icosahedron 3D sample graphics     	*
*  	Filename:	js/Icosa.js             			*
* 	Language:	JavaScript, WebGL & GLSL.      		*
*                                                   *
*****************************************************

Dependencies:	    (Shown in the order they must be loaded in.)

Filenames:			Description

Icosa.html			The main web page document.
normalize.css		The Cascading Style Sheet (generic from w3schoools.com free download.)
style.css	    	The Cascading Style Sheet (specific, all my code.)
math.js			   	The class definition file for Camera, Vec3, Vec4, Quat, Mat4, (3D graphics matrix math library.)
utils.js			Utility library of functions.
Icosa.js		    The 3D data set for geometry, GLSL shader programs & WebGL code.

Icosahedron using math.js & utils.js

An Icosahedron has 12 vertices & 20 faces.

Notes: 

1       After body loads, <body onload="setupWebGL();"> you are sent to function setupWebGL() in utils.js.
        It sets up canvas & gl variables, adds event listeners, ... & calls below. 

2       Next you are sent to function setupGraphicsPipeline() in CubeImg.js.
        The shaders are loaded, compiled & WebGL commands are called.
        
Shaders run compiled code directly on the graphics card!

Calls on a 60 triangle draw creation routine.
gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_SHORT, 0);

File utils.js has 

function createIcosa60(gl)
This comes from Frank Luna DirectX8-12 Author.

There is also an Icosahedron creation routine which draws 3 times for Top, Bottom & Middle fans
function createIcosaFan(gl)

*/

rotation = 0.0;
objOrigin.z = -5;

function setupGraphicsPipeline()
{

	logEvent("Entering function setupGraphicsPipeline();");

const vsSource = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying lowp vec4 vColor;
void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexColor;
}`;

const fsSource = `
varying lowp vec4 vColor;
void main(void) {
  gl_FragColor = vColor;
}`;

  const shader = createShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shader,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shader, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shader, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shader, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shader, 'uModelViewMatrix'),
    }
  };

  // Found in utils.js meaning 60 triangles drawn at one time
  const buffers = createIcosa60(gl);
  then = 0;

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.DEPTH_TEST);  
  gl.enable(gl.CULL_FACE);
  gl.depthFunc(gl.LEQUAL);

  const render=(now)=>
  { 
    now *= 0.001;
    const deltaTime = now - then;
    then = now;

    const projectionMatrix = Mat4.perspective(fieldOfView, aspectRatio, NEAR_PLANE,  FAR_PLANE);
    const modelViewMatrix = new Mat4();

/*

objOrigin is a new Vec3() class object created in utils.js.

var objOrigin = new Vec3(0, 0, -5);

My 3D Graphics Library for matrix math is file: 'math.js' & accepts Vec3(), Vec4(), & Array[]'s.
The origin is a get set accessor!

rotation is the amount of angle rotation in radians.

    (x, y, z) see a 3x3 Identity matrix
The {1, 0, 0] is the axis to rotate about (x-axis.)
The {0, 1, 0] is the axis to rotate about (y-axis.)
The {0, 0, 1] is the axis to rotate about (z-axis.)

*/   

    modelViewMatrix.origin = objOrigin;
    modelViewMatrix.rotate(rotation,       [1, 0, 0]);
    modelViewMatrix.rotate(rotation,       [0, 1, 0]);
    modelViewMatrix.rotate(rotation * 0.7, [0, 0, 1]);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    gl.clearDepth(1.0);  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);   
    gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_SHORT, 0);

    rotation += deltaTime;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

// oef
