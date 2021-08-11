


	/****************************************************
	*  													*
	*	Author:		James Marion Lynch			 		*
	*  	Date:		01-07-2020                          *
	* 	Version:	Alpha 1.0.0.0                      	*
	* 	Title:		Utility helper library           	*
	*  	Filename:	js/utils.js             			*
	* 	Language:	JavaScript = ECMAScript ES7 2017    *
	*                                                   *
	*****************************************************


	Notes: ECMA = European Computer Manufacturers Association


List of functions:

hide(id);
show(id);
rand(num);
isPowerOf2();
navFunctionUtils();
showDivs(n);
plusDivs(n);
setupWebGL(id = "JML_canvas", type = "webgl");
setClock();
format(command, value);
setUrl();
allowDrop(ev);
drag(ev);
startTouch(evt);
continueTouch(evt);
stopTouch();
cmdProgressBar(id = "myBar", maxBarWidth = 100, delayInMilliseconds = 80)
mouseDown(ev);
mouseUp(ev);
mouseMove(ev);
mouseUp(ev);
wheelHandler(ev);
setupVideo(id = "Cube.mp4");
initTexture(gl);
loadTexture(gl, url);
updateTexture(gl, texture, video);
cmdFullScreen();
cmdGetGPS();
showPosition(position);
cmdOpenFile();
cmdCloseFile();
cmdToggleVid();
cmdOpacity();
cmdCardType();
cmdToggleLog();
disableButton(id);
enableButton(id);
createCube(gl);
createCubeBuffers(gl);
createCubeWithNormals(gl);
createDiv(id, className);
createIcosa60(gl);
createIcosaFan(gl);
createParticle(x, y);
createShaderProgram(gl, type, source);
createShip(gl);
startTouch(ev);
continueTouch(ev);
stopTouch();
mouseDown(ev);
mouseUp(ev);
mouseMove(ev);
wheelHandler(ev);
rotateX(m, angle);
rotateY(m, angle);
initAudio();

Globals defined next.

*/

logEvent("Entering filename: 'utils.js'");
logEvent("This file contains function setupWebGL() which is called from <body onload=>");

let   canvas = gl = null,                                                
      AMORTIZATION = 0.95,
      dragEle = false, 
      startingWidth = PHI = THETA = fiTouch = rTouch = idTouch0 = old_x = old_y = 0.0,
      xOffs = yOffs = rotation = xRot = yRot = zRot = then = i = 0.0,
	  aspectRatio = 1.0,
	  fieldOfView = 45 * DEGREE,
	  slideIndex = 1;
	
const objOrigin = new Vec3(0, 0, -6),
      hide=(id)=>  document.getElementById(id).style.visibility = "hidden",
      show=(id)=>  document.getElementById(id).style.visibility = "visible",
      rand=(num)=> Math.floor(Math.random() * num),
      isPowerOf2=(value)=> (value & (value - 1)) == 0,
	  acc = document.getElementsByClassName("accordion");
	  
let len = acc.length;

for (i=0; i<len; i++)
{
	// Arrow ()=> do not have a 'this' referencce!
	acc[i].addEventListener("click", function()
	{
		this.classList.toggle("active");
		const panel = this.nextElementSibling;
		panel.style.display = (panel.style.display === "block") ? "none" : "block";
	});
}

const navFunctionUtils=()=>
{
	const x = document.getElementById("myTopnav");
	if (x)
	{
		if (x.className === "topnav")
			x.className += " responsive";
		else
			x.className = "topnav";
	}
};

// Slide-show functions
const plusDivs=(index = 1)=>
{
    showDivs(slideIndex += index);
};

const showDivs=(index = 1)=>
{
    
    const x = document.getElementsByClassName("mySlides");
    if (x)
    {
        let i = 0;
        if (index > x.length) {slideIndex = 1}
        if (index < 1) {slideIndex = x.length}
        
        let len = x.length;
        for (i=0; i<len; i++)
        {
            x[i].style.display = "none";  
        }
        x[slideIndex-1].style.display = "block";
    }
};

const sendMsg=(msg = "JML 3D Studios")=>
{
	const title = document.getElementById("title_bar");
	if (title) { title.innerHTML += msg + "<br>"; }
};

// This sets up our canvas & gl context for us called by body onload event.
function setupWebGL(id = "JML_canvas", type = "webgl")
{
	let msg = "Declare.";

	// Place the code inside a try catch block to catch any errors.
	try
	{
		canvas = document.getElementById(id);
        if (canvas && (type == 'webgl' || type == '2d' || type == 'experimental-webgl'))
        {
            gl = canvas.getContext(type);
        }
        else
        {
			msg = "No canvas element was found? id: " + id;
			console.log(msg);
			sendMsg(msg);
            logEvent(msg);
            alert(msg); 
        }
	}
	catch(e)
	{
		msg = "Error in try catch block setupWebGL() " + e.message;
		console.log(msg);
		sendMsg(msg);
		logEvent(msg);
		alert(msg);
	}

    if (typeof initAudio === 'function') initAudio($('#playlist li:first-child'));
    
   setClock();

    // add the canvas element event listeners.
	if (canvas && gl)
	{
        aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;

		canvas.addEventListener("DOMMouseScroll", wheelHandler,  false);
		canvas.addEventListener("mousewheel",     wheelHandler,  false);
		canvas.addEventListener("mousedown",      mouseDown,     false);
		canvas.addEventListener("mouseup",        mouseUp,       false);
		canvas.addEventListener("mousemove",      mouseMove,     false);	
		canvas.addEventListener("touchstart", 	  startTouch,    false);
		canvas.addEventListener("touchmove",      continueTouch, false);
		canvas.addEventListener("touchend",       stopTouch,     false);

		if (setupGraphicsPipeline !== null) setupGraphicsPipeline();	
	}
	else
	{
        // error condition.
		alert("No canvas element or WebGL context()");
	}
	
		
}

function setClock()
{
	const clock = document.getElementById("clock");
	if (!!clock)
	{
		setInterval(()=> clock.innerHTML = "JML 3D Studios: "  + new Date().toLocaleTimeString(), ONE_SECOND); 
	}
}

/* This is for the text editor web page.  */
function format(command, value)
{
    document.execCommand(command, false, value);
}

function setUrl()
{
    let url = document.getElementById('txtUrl').value,
        sText = document.getSelection();

    document.execCommand('insertHTML', false, '<a href="' + url + '" target="_blank">' + sText + '</a>');
    // format('createlink', url);
}

function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }

function drop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

function startTouch(evt)
{
  let evList = evt.touches;
  if(evList.length == 1){
    xOffs = evList[0].pageX; 
	yOffs = evList[0].pageY;
    dragEle = 1;
  }
  else if(evList.length == 2)
  {
    idTouch0 = evList[0].identifier;
    let dx = evList[1].pageX - evList[0].pageX,
        dy = evList[1].pageY - evList[0].pageY;
    rTouch = Math.sqrt(dx*dx + dy*dy);
    fiTouch = Math.atan2(dy, dx);
    dragEle = 2;
  }
  evt.preventDefault();
}

function continueTouch(evt)
{
  if(dragEle == 1)
  {
    let x = evt.touches[0].pageX,  y = evt.touches[0].pageY;
    yRot = x - xOffs; 
	xRot = y - yOffs;
    xOffs = x; 
	yOffs = y;
    if (drawScene !== null) drawScene();
  }
  else if(dragEle == 2)
  {
    let dx = evt.touches[1].pageX - evt.touches[0].pageX,
        dy = evt.touches[1].pageY - evt.touches[0].pageY,
        r = Math.sqrt(dx*dx + dy*dy),
        fi;
    if (idTouch0 == evt.touches[0].identifier) fi = Math.atan2(dy, dx);
    else fi = Math.atan2(-dy, -dx);
    objOrigin.z *= rTouch / r;
    zRot = RADIAN * (fiTouch - fi);
    rTouch = r;
    fiTouch = fi;
    if (drawScene !== null) drawScene();
  }
}

function stopTouch()
{
  dragEle = 0;
}

function mouseDown(ev)
{
  dragEle  = 1;
  xOffs = ev.clientX;  yOffs = ev.clientY;
}

function mouseUp(ev)
{
  dragEle  = 0;
}

function mouseMove(ev)
{
  if (dragEle == 0) return;
  if (ev.shiftKey)
  {
    objOrigin.z *= 1 + (ev.clientY - yOffs) / 1000;
    zRot = (xOffs - ev.clientX)*.3;
  }
  else
  {
    yRot = - xOffs + ev.clientX;  
	xRot = - yOffs + ev.clientY; 
  }
  xOffs = ev.clientX;   
  yOffs = ev.clientY;
  if (drawScene !== null) drawScene();
}

function wheelHandler(ev)
{
  let del = 1.1;
  if (ev.shiftKey) del = 1.01;
  let ds = ((ev.detail || ev.wheelDelta) > 0) ? del : (1 / del);
  objOrigin.z *= ds;
  ev.preventDefault();
  if (drawScene !== null) drawScene();
}

function cmdProgressBar(id = "myBar", maxBarWidth = 100, delayInMilliseconds = 80)
{
	const elem = document.getElementById(id);
	if (elem && startingWidth === 0)
	{
		let intervalID = setInterval(updateProgress, delayInMilliseconds),
		    width = 1;
			
		startingWidth = 1;
		show(id);
		show("displayProgress");
		show("myProgress");

		function updateProgress()
		{
			if (width >= maxBarWidth)
			{
				clearInterval(intervalID);
				startingWidth = 0;
				
				setTimeout(()=>
				{
					hide(id);
					hide("displayProgress");
					hide("myProgress");
				}, ONE_SECOND * 2);
			
			}
			else
			{
				elem.style.width = ++width + "%";
				document.getElementById("displayProgress").innerHTML = "Progress: " + width.toString() + "%";
			}
		}
	}
}

function setupVideo(id = "Cube.mp4")
{
  const vid = document.createElement("video");

  let playing = false,
      timeupdate = false;

  vid.autoplay = true;
  vid.loop = true;
  
  // Our event handler routines.
  vid.addEventListener("playing", function()
  {
     playing = true;
     checkReady();
  }, true);

  vid.addEventListener("timeupdate", function()
  {
     timeupdate = true;
     checkReady();
  }, true);

  vid.src = id;
  vid.play();

  function checkReady()
  {
    if (playing && timeupdate)
    {
      copyVideo = true;
    }
  }
  return vid;
}

function initTexture(gl)
{
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0,
        internalFormat = gl.RGBA,
        width = 1,
        height = 1,
        border = 0,
        srcFormat = gl.RGBA,
        srcType = gl.UNSIGNED_BYTE,
        pixel = new Uint8Array([0, 0, 255, 255]);

  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0,
        internalFormat = gl.RGBA,
        width = 1,
        height = 1,
        border = 0,
        srcFormat = gl.RGBA,
        srcType = gl.UNSIGNED_BYTE,
        pixel = new Uint8Array([0, 0, 255, 255]);

  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

  const image = new Image();
  image.onload = function()
  {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

    if (isPowerOf2(image.width) && isPowerOf2(image.height))
    {
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;
  return texture;
}

function updateTexture(gl, texture, video)
{
  const level = 0,
        internalFormat = gl.RGBA,
        srcFormat = gl.RGBA,
        srcType = gl.UNSIGNED_BYTE;

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, video);
}

function cmdGetGPS()
{
  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else
  {
	document.getElementById("title_bar").innerHTML += " Geolocation is not supported by this browser.";
  }
  document.getElementById("cmd_get_gps").focus = false;
}

function showPosition(position)
{
	document.getElementById("title_bar").innerHTML += " Latitude: " + position.coords.latitude + "  Longitude: " + position.coords.longitude;
}

function cmdCloseFile()
{
	const div = document.getElementById("editor_content");
	if (div)
	{
		if(typeof(Storage) !== "undefined")
		{
			localStorage.setItem("editor_file_contents", div.innerHTML);
			div.innerHTML = "";
		}
	}
}

function cmdOpenFile()
{
	const div = document.getElementById("editor_content");
	if (div)
	{
		if(typeof(Storage) !== "undefined")
		{
			div.innerHTML = localStorage.getItem("editor_file_contents");
		}
	}
}

function cmdToggleVid()
{
	const vid = document.getElementById("video_element"),
		  btn = document.getElementById("cmd_toggle_vid");

    if (btn && vid)
    {
        if (vid.paused)
        {
            vid.play();
            btn.innerHTML = "Stop?";
			show("video_container");
			show("video_element");
        }
        else
        {
            vid.pause();
            btn.innerHTML = "Video?";
			hide("video_container");
		    hide("video_element");
        }
        btn.focus = false;
    }
}

function cmdOpacity()
{
	// The slider input element.
	const slider_input = document.getElementById("cmd_opacity");
    if (slider_input)
    {   
        const vid = document.getElementById("video_element");
        if (vid)
        {
			// We convert it to an Integer and divide by twenty, then turn it into a string data type.
			// We divide by 20 because that is the max on input element, max="20"
            vid.style.opacity = (parseInt(slider_input.value, 10) * 0.05).toString();
        }
        slider_input.focus = false;
    }
}

function cmdCardType()
{
	const btn = document.getElementById("cmd_cardtype");
	if (btn)
	{
		// This toggles on and on the switch.
		btn.innerHTML = (gblUnicodeCards) ? "Images" : "Unicode";
		gblUnicodeCards = !gblUnicodeCards;
	}
	else
	{
		logEvent("Button for cmdCardType() not found?");
	}
}

function cmdFullScreen()
{
	let doc = window.document, 
		docEl = doc.documentElement,
		requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen,
		cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen,
        btn = document.getElementById("cmd_full_screen");
    
    if (btn)
    {
        if(!doc.FullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement)
        {
            btn.innerHTML = "Exit?";
            requestFullScreen.call(docEl);
        }
        else
        { 
            btn.innerHTML = "Mode?";
            cancelFullScreen.call(doc);
        }
        btn.focus = false;
    }
}

function cmdToggleLog()
{
	const btn = document.getElementById("cmd_toggle_log");
	if (btn)
	{
		const e = document.getElementById("log_div");
		if (e)
		{
			if (e.style.visibility === "visible")
			{
				btn.innerHTML = "View?";
				e.style.visibility = "hidden";
			}
			else
			{
				btn.innerHTML = "Close?";
				e.style.visibility = "visible";
			}
		}
		else
		{
			logEvent("The log_div element not found?");
		}
		btn.focus = false;
	}
	else
	{
		logEvent("Button for cmdToggleLog() not found?");
	}
}

function disableButton(id)
{
	const btn = document.getElementById(id);
	if (btn)
		btn.disabled = true;
}

function enableButton(id)
{
	const btn = document.getElementById(id);
	if (btn)
		btn.disabled = false;
}

function getShader(gl, id)
{
   let shaderScript = document.getElementById(id);
   if (shaderScript)
   {
       let shader = null,
           str = "",
           k = shaderScript.firstChild;
           
        while (k)
        {
            if (k.nodeType == 3) str += k.textContent;
            k = k.nextSibling;
        }
   
        if (shaderScript.type == "x-shader/x-fragment")
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        else if (shaderScript.type == "x-shader/x-vertex")
            shader = gl.createShader(gl.VERTEX_SHADER);
        else return null;

        gl.shaderSource(shader, str);
        gl.compileShader(shader);
   
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == 0)
        {
            let msg = id + "\n" + gl.getShaderInfoLog(shader);
            alert(msg);
            logEvent(msg); 
        }
        return shader;
    }
    else
    {
        logEvent("getShader(), Shader script element not found: " + id);
        return null;
    }
}

function loadShader(gl, type, source)
{
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
  {
    logEvent("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createDiv(id, className)
{
	const div = document.getElementById(id);
	if (!div)
	{
		div = document.createElement("div");
		div.className = className;
		div.id = id;
		document.body.appendChild(div);
	}
	return div;
}

function createShaderProgram(gl, vsSource, fsSource)
{
  let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource),
	  fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource),
	  shader = gl.createProgram();
  
  gl.attachShader(shader, vertexShader);
  gl.attachShader(shader, fragmentShader);
  gl.linkProgram(shader);

  if (!gl.getProgramParameter(shader, gl.LINK_STATUS))
  {
    console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
    return null;
  }
  return shader;
}

/*

*********************   The 5 Platonic solids geometry data sets  *********************************

1   Cube
2   Dodecahedron
3   Icosahedron
4   Octahedron
5   Tetrahedron

*/

function createIcosa60(gl)
{
  const x = 0.525731,
        z = 0.850651,
        colorBuffer = gl.createBuffer(),
        indexBuffer = gl.createBuffer(),
        positionBuffer = gl.createBuffer(),
        positions = [
            -x, 0,  z,
            x, 0,  z, 
            -x, 0, -z, 
            x, 0, -z, 
            0,  z,  x,
            0,  z, -x,
            0, -z,  x,
            0, -z, -x,
            z,  x, 0,
            -z,  x, 0,
            z, -x, 0,
            -z, -x, 0              
        ],

        indices = [
            1, 4, 0,        4, 9, 0,      4, 5, 9,      8, 5, 4,      1, 8, 4,     1, 10, 8, 
            10, 3, 8,       8, 3, 5,      3, 2, 5,      3, 7, 2,      3, 10, 7,    10, 6, 7, 
            6, 11, 7,       6, 0, 11,     6, 1, 0,      10, 1, 6,     11, 0, 9,    2, 11, 9, 
            5, 2, 9,        11, 2, 7
  
        ],

        faceColors = [
            [ 1.0, 0.0, 0.0, 1.0 ],    // Color 1, index = 0, red
            [ 1.0, 0.5, 0.0, 1.0 ],    // Color 2, index = 1, orange
            [ 0.0, 0.0, 0.1, 1.0 ],    // Color 3, index = 2, yellow
            [ 0.7, 1.0, 0.3, 1.0 ],    // Color 4, index = 3, ltGreen
            [ 0.4, 0.4, 0.4, 1.0 ],    // Color 5, index = 4, green 
            [ 0.0, 0.5, 0.5, 1.0 ],    // Color 6, index = 5, springGreen
            [ 0.0, 0.6, 0.6, 1.0 ],    // Color 7, index = 6, cyan
            [ 0.0, 0.0, 0.7, 1.0 ],    // Color 8, index = 7, azure
            [ 0.0, 0.8, 1.0, 1.0 ],    // Color 9, index = 8, blue
            [ 0.0, 0.9, 0.9, 1.0 ],    // Color 10, index = 9, violet
            [ 1.0, 0.0, 0.0, 1.0 ],    // Color 11, index = 10, magenta
            [ 0.0, 1.0, 0.5, 1.0 ],    // Color 12, index = 11, rose
            [ 0.4, 0.4, 0.4, 1.0 ],    // Color 5, index = 4, green 
            [ 0.0, 0.5, 0.5, 1.0 ],    // Color 6, index = 5, springGreen
            [ 0.0, 0.6, 0.6, 1.0 ],    // Color 7, index = 6, cyan
            [ 0.0, 0.0, 0.7, 1.0 ],    // Color 8, index = 7, azure
            [ 0.0, 0.8, 1.0, 1.0 ],    // Color 9, index = 8, blue
            [ 0.0, 0.9, 0.9, 1.0 ],    // Color 10, index = 9, violet
            [ 1.0, 0.0, 0.0, 1.0 ],    // Color 11, index = 10, magenta
            [ 0.0, 1.0, 0.5, 1.0 ]     // Color 12, index = 11, rose
        ];

  let c = null, i = 0, colors = [], len = faceColors.length;
  for (i=0; i<len; ++i)
  {
    c = faceColors[i];
    colors = colors.concat(c, c, c);
  }

  gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW );
  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
  gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.STATIC_DRAW );
  gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( positions ), gl.STATIC_DRAW );

  return {
    color: colorBuffer,
    indices: indexBuffer,
    position: positionBuffer,
  };
}

const createIcosaFan=(gl)=>
{
  // Create a buffer for the icosahedron's vertex positions.
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the icosahedron.
  const vertices = [
    //Top Fan
    0.0, 1.0, 0.5,   // 0
    0.5, 0.0, 1.0,   // 1
    1.0, 0.5, 0.0,   // 2
    0.0, 1.0, -0.5,  // 3
    -1.0, 0.5, 0.0,  // 4
    -0.5, 0.0, 1.0,  // 5
    
    //Bottom Fan
    0.0, -1.0, -0.5, // 6
    -0.5, 0.0, -1.0, // 7
    0.5, 0.0, -1.0,  // 8
    1.0, -0.5, 0.0,  // 9
    0.0, -1.0, 0.5,  // 10
    -1.0, -0.5, 0.0, // 11
    
    //Middle Strip
    -1.0, -0.5, 0.0, // 12
    -1.0, 0.5, 0.0,  // 13
    -0.5, 0.0, -1.0, // 14
    0.0, 1.0, -0.5,  // 15
    0.5, 0.0, -1.0,  // 16
    1.0, 0.5, 0.0,   // 17
    1.0, -0.5, 0.0,  // 18
    0.5, 0.0, 1.0,   // 19
    0.0, -1.0, 0.5,  // 20
    -0.5, 0.0, 1.0,  // 21
  ]


  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.

  const colorsIco = [
    [0.90,  0.09,  0.29],    // 0 - Color 1
    [0.23,  0.70,  0.29],    // 1 - Color 2
    [1.00,  1.00,  0.09],    // 2 - Color 3
    [0.00,  0.50,  0.78],    // 3 - Color 4
    [0.96,  0.50,  0.18],    // 4 - Color 5
    [0.56,  0.11,  0.70],    // 5 - Color 6
    [0.27,  0.94,  0.94],    // 6 - Color 7
    [0.94,  0.19,  0.90],    // 7 - Color 8
    [0.66,  0.43,  0.15],    // 8 - Color 9
    [1.00,  0.98,  0.78],    // 9 - Color 10
    [0.50,  0.00,  0.00],    // 10- Color 11
    [0.00,  0.00,  0.50],    // 11- Color 12
    [0.00,  0.00,  0.50],    // 12
    [0.96,  0.50,  0.18],    // 13
    [0.94,  0.19,  0.90],    // 14
    [0.00,  0.50,  0.78],    // 15
    [0.66,  0.43,  0.15],    // 16
    [1.00,  1.00,  0.09],    // 17
    [1.00,  0.98,  0.78],    // 18
    [0.23,  0.70,  0.29],    // 19
    [0.50,  0.00,  0.00],    // 20
    [0.56,  0.11,  0.70],    // 21
  ];

  // Convert the array of colors into a table for all the vertices.

  let colors = [];

  for (let j = 0; j < colorsIco.length; ++j) {
    const c = colorsIco[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c);
  }

  const colorBuffer = gl.createBuffer();
  
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indicesIco = [
    //Top Fan
    0, 1, 2, 3, 4, 5, 1,
    //Bottom Fan
    6, 7, 8, 9, 10, 11, 7,
    //Middle Strip
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 12, 13,
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesIco), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
};


function createCubeColors(gl)
{
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [

    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const faceColors = [
    [1.0,  1.0,  1.0,  1.0],
    [1.0,  0.0,  0.0,  1.0],
    [0.0,  1.0,  0.0,  1.0],
    [0.0,  0.0,  1.0,  1.0],
    [1.0,  1.0,  0.0,  1.0],
    [1.0,  0.0,  1.0,  1.0],
  ];

  let colors = [], c = j = 0, len = faceColors.length;

  for (j = 0; j<len; ++j)
  {
    c = faceColors[j];
    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // 6 faces with 4 vertices per side. (6 X 4 = 24.)
  // 36 total vertice colors with 12 triangles, 3 vertice per trianlge.
  const indices = [
    0,  1,  2,      0,  2,  3,
    4,  5,  6,      4,  6,  7,
    8,  9,  10,     8,  10, 11,
    12, 13, 14,     12, 14, 15, 
    16, 17, 18,     16, 18, 19, 
    20, 21, 22,     20, 22, 23,
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    color: colorBuffer,
    indices: indexBuffer,
    position: positionBuffer
  };
}


function createCube(gl)
{
  const colorsBuffer    = gl.createBuffer(),
        indicesBuffer   = gl.createBuffer(),
        positionsBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER,         colorsBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bindBuffer(gl.ARRAY_BUFFER,         positionsBuffer);
  
  const faceColors = [
    [1.0,  0.0,  0.0,  1.0],      // red
    [0.0,  1.0,  0.0,  1.0],      // green
    [0.0,  0.0,  1.0,  1.0],      // blue
    [1.0,  1.0,  1.0,  1.0],      // white
    [0.0,  0.0,  0.0,  1.0],      // black
    [0.5,  0.5,  0.5,  1.0]       // gray
  ];
  
  let c = i = 0, colors = [], len = faceColors.length;
  
  // Take note that cubes have 2 triangles per side & need 4 matching colors on each corner.
  // Icosahedron's has 12 vertices & 20 triangle faces, times 3 colors per triangle = 60 colors total, 20 solid colors!
  for (i=0; i<len; ++i)
  {
    c = faceColors[i];
    colors = colors.concat(c, c, c, c);
  }

  const indices = [
    0,  1,  2,      0,  2,  3,     // front
    4,  5,  6,      4,  6,  7,     // back
    8,  9,  10,     8,  10, 11,    // top
    12, 13, 14,     12, 14, 15,    // bottom
    16, 17, 18,     16, 18, 19,    // right
    20, 21, 22,     20, 22, 23     // left
  ];

/*

  There are 6 sides to a cube, 2 triangles per side, 12 triangles.
  To create 12 triangles we need one color value per vertice for every triangle.
  That is 12 times 3 colors per triangle face = 36 colors.
  
*/  

  const positions = [

    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(colors),    gl.STATIC_DRAW);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),    gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(positions), gl.STATIC_DRAW);

  return { colors: colorsBuffer, indices: indicesBuffer, positions: positionsBuffer };
}

function createCubeBuffers(gl)
{
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  const vertexNormals = [
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  const indices = [
    0,  1,  2,      0,  2,  3, 
    4,  5,  6,      4,  6,  7,
    8,  9,  10,     8,  10, 11,
    12, 13, 14,     12, 14, 15,
    16, 17, 18,     16, 18, 19,
    20, 21, 22,     20, 22, 23,
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    normal: normalBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer
  };
}

function createCubeWithNormals(gl)
{
   const indicesBuffer       = gl.createBuffer(),
         normalsBuffer       = gl.createBuffer(),
         positionsBuffer     = gl.createBuffer(),
         textureCoordsBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bindBuffer(gl.ARRAY_BUFFER,         normalsBuffer);
  gl.bindBuffer(gl.ARRAY_BUFFER,         positionsBuffer);
  gl.bindBuffer(gl.ARRAY_BUFFER,         textureCoordsBuffer);

  const indices = [
    0,  1,  2,      0,  2,  3,
    4,  5,  6,      4,  6,  7,
    8,  9,  10,     8,  10, 11,
    12, 13, 14,     12, 14, 15,
    16, 17, 18,     16, 18, 19,
    20, 21, 22,     20, 22, 23 
  ];
  
  const positions = [
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];

  const normals = [

    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
  ];

  const textureCoords = [

    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),        gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(normals),       gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(positions),     gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(textureCoords), gl.STATIC_DRAW);

  return {
    indices:       indicesBuffer,
    normals:       normalsBuffer,
    positions:     positionsBuffer,
    textureCoords: textureCoordsBuffer
  };
}

function createShip(gl)
{
  const indicesBuffer = gl.createBuffer(),
        positionsBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bindBuffer(gl.ARRAY_BUFFER,         positionsBuffer);

  let x = 2.0, y = 0.5, z = 3.0,
      v0 = new Vec3(0, 0, z * 3);    // nose cone.

  // Create the 4 front box frame vectors
  let v1 = new Vec3(x, y, z),
      v2 = new Vec3(x, -y, z),
      v3 = new Vec3(-x, -y, z),
      v4 = new Vec3(-x, y, z),

  // Create the rear box frame vectors
      v5 = new Vec3(x, y, -z),       // upper right
      v6 = new Vec3(x, -y, -z),      // lower right
      v7 = new Vec3(-x, -y, -z),     // lower left
      v8 = new Vec3(-x, y, -z),      // upper left

      canopyX = x * 0.65, // temp variables
      canopyY = y * 4,

      v9 = new Vec3(-canopyX, canopyY, -z),  // rear left    
      v10 = new Vec3(canopyX, canopyY, -z),  // rear right    
      v11 = new Vec3(canopyX, canopyY, 0),  // front right        
      v12 = new Vec3(-canopyX, canopyY, 0),  // front left

  // Cache the value for the right wing tip z point
      rearZ = -z * 3.5,
      v13 = new Vec3(x * 3, -y * 4, rearZ),   // Right wing tip
      v14 = new Vec3(-x * 3, -y * 4, rearZ),  // Left wing tip
      v15 = new Vec3(0, 0, rearZ);            // Rear engine nozzle


  const positions = [ ...v0, ...v1, ...v2, ...v3, ...v4, ...v5, ...v6, ...v7, 
     ...v8, ...v9, ...v10, ...v11, ...v12, ...v13, ...v14, ...v15 ];

  // This array defines the indices into the positions array to link each triangle.
  const indices = [
    0, 1, 4,      0, 4, 3,        0, 3, 2,     0, 2, 1,   // 4 rows of 3 numbers x 6 columns = 12 x 6 = 72 numbers.
    12, 10, 9,    11, 10, 12,     11, 12, 4,   1, 11, 4,  // 72 / 3 = 24 triangle faces.
    13, 5, 1,     13, 1, 2,       13, 2, 6,    13, 6, 5,  // 16 vertices.
    14, 4, 8,     14, 8, 7,       14, 7, 3,    14, 3, 4, 
    15, 5, 6,     15, 6, 7,       15, 7, 8,    15, 8, 9, 
	15, 9, 10,    15, 10, 5,      2, 3, 6,     7, 6, 3
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),    gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER,         new Float32Array(positions), gl.STATIC_DRAW);
  
  return { indices: indicesBuffer, positions: positionsBuffer };
}

// eof
