/*

Author:		        James Marion Lynch			
Date:		        10-01-2020
Version:	        Alpha Beta Bag 1.0
Title:		        Demo of WebGL 3D Platonic Solids.		
Filename:	        IcosaFan.js
Languages:	        HTML5, CSS3 & JavaScript ES6 2015, WebGL and GLSL.

IcosaFan.js for the 3 draw calls WebGL makes to draw the Top & Bottom using TRIANGLE_FAN & Middle using TRIANGLE_STRIP.
gl.drawElements(gl.TRIANGLE_FAN,   vertexCount, type, offset);  // Top
gl.drawElements(gl.TRIANGLE_FAN,   vertexCount, type, offset);  // Bottom
gl.drawElements(gl.TRIANGLE_STRIP, vertexCount, type, offset);  // Middle
Hence, the name of the creation function is:
createIcosaFan(gl)   in the createIcosaFan.js file.

You will see the other draw I use where 60 triangles are drawn in one call.
gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_SHORT, 0);

function createIcosa60(gl)
The author Frank Luna who wrote 4 versions of Microsoft DirectX 8-12 I read.

*/

function drawScene(gl, programInfo, buffers, deltaTime)
{
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const projectionMatrix =Mat4.perspective(fieldOfView, aspectRatio, NEAR_PLANE, FAR_PLANE),
        modelViewMatrix = new Mat4();

  modelViewMatrix.origin = objOrigin;
  modelViewMatrix.rotate(rotation,       [1, 0, 0]);
  modelViewMatrix.rotate(rotation,       [0, 1, 0]);
  modelViewMatrix.rotate(rotation * 0.7, [0, 0, 1]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Draw Top Fan
  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
  gl.drawElements(gl.TRIANGLE_FAN, 7, gl.UNSIGNED_SHORT, 0);
  
  // Draw Bottom Fan
  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
  gl.drawElements(gl.TRIANGLE_FAN, 7, gl.UNSIGNED_SHORT, 14);
  
  // Draw Middle Strip
  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
  gl.drawElements(gl.TRIANGLE_STRIP, 12, gl.UNSIGNED_SHORT, 28);

  rotation += deltaTime;
}

function setupGraphicsPipeline()
{
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

// Fragment shader program
const fsSource = `
varying lowp vec4 vColor;
void main(void) {
  gl_FragColor = vColor;
}`;

  const shaderProgram = createShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  const buffers = createIcosaFan(gl);
  then = 0;

  function render(now)
  {
    now *= 0.001;
    const deltaTime = now - then;
    then = now;
    drawScene(gl, programInfo, buffers, deltaTime);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}