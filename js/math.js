


    /****************************************************
    *  													*
    *	Author:		James Marion Lynch			 		*
    *  	Date:		01-10-2021                          *
    * 	Version:	Alpha 1.0.0.0                      	*
    * 	Title:		3D Graphics Library math          	*
    *  	Filename:	js/math.js             				*
    * 	Language:	JavaScript ES7 2017            		*
    *                                                   *
    *****************************************************


    NOTES:

    'utils.js' relies on 'math.js' being loaded before;

    <script type="text/javascript" src="js/math.js"></script>
    <script type="text/javascript" src="js/utils.js"></script>

    (line 82 of 'utils.js'; const objOrigin = new Vec3(0, 0, -8);)

    This file contains the following JavaScript (ES6 2015) class definitions:

    Camera(fieldOfView, aspectRatio, nearPlane = NEAR_PLANE, farPlane = FAR_PLANE);
    Vec3(x = 0, y = 0, z = 0);
    Vec4(x = 0, y = 0, z = 0, w = 1);
    Mat4();
    Quat();
    Color = Vec4;

    Define global constants & small utility functions.

*/


const ONE_SECOND = 1000,
      FAR_PLANE = 200.0,
      NEAR_PLANE = 0.1,
      EPSILON = 0.000001,
      PI = Math.PI,
      PI2 = 2 * PI,
      DEGREE = PI / 180,
      RADIAN = 180 / PI;

// Every web-page needs to log events which occur.
const logEvent=(msg)=>
{
	// Get element by id.
	const e = document.getElementById('log_div');

	if (e)
	{
		// Appends msg plus 2 returns, inside of element.
		e.innerHTML += msg + '<br><br>';
	}
};

// Set a value between min & max.
const setValue=(value, minVal, maxVal)=>
{
	if (value < minVal)
	{
		value = minVal;
	}
	else if (value > maxVal)
	{
		value = maxVal;
	}
	return value;
};

// Wrap theta value to 180 degrees.
const wrapPi=(theta)=>
{
	theta += PI;
	theta = Math.floor(theta * 1 / PI2) * PI2;
	theta -= PI;
	return theta;
};

class Camera
{
  constructor(fieldOfView, aspectRatio, nearPlane = NEAR_PLANE, farPlane = FAR_PLANE)
  {
    // Floating point decimal numbers
    this.fieldOfView = fieldOfView;
    this.aspectRatio = aspectRatio;
    this.nearPlane = nearPlane;
    this.farPlane = farPlane;
    
    // Vec3 class objects.
    this.origin = new Vec3();          // origin of camera lens.
    this.lookAt = new Vec3();          // object origin focal point.
    this.up = new Vec3(0, 1, 0);       // Unit vector up direction.
	
    // Mat4() class objects.
    this.proj = new Mat4();
    this.camera = new Mat4();
    this.view = new Mat4();
    this.viewProj = new Mat4();
	this.world = new Mat4();
  }
  
  setup(origin, lookAt, up)
  {

    // Set the 3 camera Vec3()s.
    this.origin.set(origin);
    this.lookAt.set(lookAt);
    this.up.set(up);

    // Mat4() class objects.
    this.proj.set(Mat4.perspective(this.fieldOfView, this.aspectRatio, this.nearPlane, this.farPlane));
    this.camera.set(Mat4.lookAt(this.origin, this.lookAt, this.up));
    this.view.set(Mat4.inverse(this.camera));
    this.viewProj.set(Mat4.multiply(this.proj, this.view));
  }
  
  update(angleInRadians, axis)
  {
    this.world.rotate(angleInRadians, axis);
  }

}

function getIcosahedronVerticesIndicesNormals()
{

	var phi = (1 + Math.sqrt(5)) / 2, 
		a = 1,
		b = 1 / phi, 
		i = 0;
	
	var positions = 	[
						0, b, -a, -b, a, 0, b, a, 0, -b, a, 0, 0, b, a, b, a, 0, 0, -b,
						a, 0, b, a, -a, 0, b, a, 0, b, 0, b, a, 0, -b, a, 0, -b, -a, 0, b, -a, a, 0, -b,
						-a, 0, -b, 0, b, -a, 0, -b, -a, b, -a, 0, 0, -b, a, -b, -a, 0, -b, -a, 0, 0, -b,
						-a, b, -a, 0, -a, 0, b, -b, a, 0, -a, 0, -b, -a, 0, -b, -b, -a, 0, -a, 0, b, a, 
						0, -b, b, a, 0, a, 0, b, a, 0, b, b, -a, 0, a, 0, -b, -a, 0, b, 0, b, a, -b, a,
						0, b, a, 0, 0, b, a, a, 0, b, -b, a, 0, 0, b, -a, -a, 0, -b, a, 0, -b, 0, b, -a,
						b, a, 0, -a, 0, -b, 0, -b, -a, -b, -a, 0, b, -a, 0, 0, -b, -a, a, 0, -b, -b, -a,
						0, 0, -b, a, -a, 0, b, a, 0, b, 0, -b, a, b, -a, 0
					];
	
	
	// This assumes a & b are 3 Dimensional vectors stored in an array
	function subtract(a, b)
	{ 
		return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; 
	}; 
 
	function crossProduct(a, b)
	{ 
		return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ]; 
	};
	
	// To normalize a vector is to trim it to 1 unit in length.
	// It is Pythagoras therom c = Math.sqrt(x*x + y*y + z*z);
	// If the zero vector is passed in, a divide by zero error would occur.
	// Therefore the test for magnitude having a zero length.
	function normalize(a)
	{ 
		var magnitude = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
		
		if (magnitude != 0)
		{
			var magInverse = 1 / magnitude;
			return [a[0] * magInverse, a[1] * magInverse, a[2] * magInverse];
		}
		else
		{
			return a;
		}
	}; 

	var normals = [],
		normal  = null,
		len = positions.length,
		indices = new Array(len / 3);
	
	for (i=0; i<len; i += 9) 
	{
		a = [positions[i], positions[i + 1], positions[i + 2]];
		b = [positions[i + 3], positions[i + 4], positions[i + 5]];
		c = [positions[i + 6], positions[i + 7], positions[i + 8]];

		normal = normalize(crossProduct(subtract(a, b), subtract(a, c))); 
		normals = normals.concat(normal, normal, normal); 
	}

	len =  indices.length;
	for (i=0; i<len; ++i)
		indices[i] = i;	

	return { positions: positions, indices: indices, normals: normals };
}

function calcNormals(positions)
{
	if (Array.isArray(positions) & positions.length > 9)
	{

		// This assumes a & b are 3 Dimensional vectors stored in an array
		function subtract(a, b)
		{ 
			return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; 
		}; 
 
		function crossProduct(a, b)
		{ 
			return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ]; 
		};
	
		// To normalize a vector is to trim it to 1 unit in length.
		// It is Pythagoras therom c = Math.sqrt(x*x + y*y + z*z);
		// If the zero vector is passed in, a divide by zero error would occur.
		// Therefore the test for magnitude having a zero length.
		function normalize(a)
		{ 
			var magnitude = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
		
			if (magnitude != 0)
			{
				var magInverse = 1 / magnitude;
				return [a[0] * magInverse, a[1] * magInverse, a[2] * magInverse];
			}
			else
			{
				return a;
			}
		}; 

		var normals = [],
			normal  = null,
			len = positions.length,
			indices = new Array(len / 3);
	
		for (i=0; i<len; i += 9) 
		{
			a = [positions[i], positions[i + 1], positions[i + 2]];
			b = [positions[i + 3], positions[i + 4], positions[i + 5]];
			c = [positions[i + 6], positions[i + 7], positions[i + 8]];

			normal = normalize(crossProduct(subtract(a, b), subtract(a, c))); 
			normals = normals.concat(normal, normal, normal); 
		}

		return normals;
	
	}
	else
	{
		return null;
	}
}


// ********************************************   Vec3   ******************************************************
 
 
class Vec3 extends Float32Array
{
  constructor(x = 0, y = 0, z = 0)
  {
	  super([x, y, z]);
  }

  // Accessors.
  get x() { return this[0]; }
  get y() { return this[1]; }
  get z() { return this[2]; }

  get roll(){ return this[0]; }
  get pitch(){ return this[1]; }
  get yaw(){ return this[2]; }

  get heading(){ return this[0]; }
  get bank(){ return this[2]; }

  set x(value){ this[0] = value; }
  set y(value){ this[1] = value; }
  set z(value){ this[2] = value; }

  set roll(value){ this[0] = value; }
  set pitch(value){ this[1] = value; }
  set yaw(value){ this[2] = value; }

  set heading(value){ this[0] = value; }
  set bank(value){ this[2] = value; }

  toString(){ return '(' + this[0] + ', ' + this[1] + ', ' + this[2] + ')'; }

  static addition(a, b){ return new Vec3(a[0] + b[0], a[1] + b[1], a[2] + b[2]); }
  static create(){ return new Vec3(); }
  static crossProduct(a, b){ return new Vec3(a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]); }
  static magnitude(v){ return Math.hypot(v[0], v[1], v[2]); }
  static divide(a, b){ return new Vec3(a[0] / b[0], a[1] / b[1], a[2] / b[2]); }
  static dotProduct(a, b){ return a[0] * b[0] + a[1] * b[1] +a[2] * b[2]; }
  static isVec3(obj){ return Object.getPrototypeOf(obj).constructor.name === this.name; }
  static modulus(a, b){ return new Vec3(a[0] % b[0], a[1] % b[1], a[2] % b[2]); }
  static multiply(a, b){ return new Vec3(a[0] * b[0], a[1] * b[1], a[2] * b[2]); }
  static subtract(a, b){ return new Vec3(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }

  static normalize(v) {
	
	// We do the magSq() code directly within the function to avoid a function call.
    let magSq = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    
    if (magSq !== 0){
      let mag = Math.sqrt(magSq),    // The magnitude of a vector
          m = 1 / mag;                 // The inverse of the magnitude cached away so we multiply.

      v[0] *= m;      
      v[1] *= m;      
      v[2] *= m;
    }
    return v;
  }
 
  static toQuat(vec){
    
    /* 
	   As taken from wiki page on converting Euler Angles to Unit Quaternions.
       The orient of Obj3 is converted into a Quaternion to create a rotation matrix.
       This function accepts any type of array full of numbers with a length of 3 or more.
       Normal use is a Vec3 class object which is a Float32Array & a property of Obj3 objects named orient.
       (roll, pitch, yaw) order. Accessors provide the proper names if needed.
	*/
	
    let cos = Math.cos,
       sin = Math.sin,
       cr = cos(vec[0]) * 0.5,  // half of cos(roll)
       sr = sin(vec[0]) * 0.5,  // half of sin(roll)
       cp = cos(vec[1]) * 0.5,  // half of cos(pitch)
       sp = sin(vec[1]) * 0.5,  // half of sin(pitch)
       cy = cos(vec[2]) * 0.5,  // half of cos(yaw)
       sy = sin(vec[2]) * 0.5,  // half of sin(yaw)
       q = new Quat();

    q.w = cy * cp * cr + sy * sp * sr;
    q.x = cy * cp * sr - sy * sp * cr;
    q.y = sy * cp * sr + cy * sp * cr;
    q.z = sy * cp * cr - cy * sp * sr;

    return q;
  }  

  clone(){
	/*  
	  
    let array = new Vec3();
    array.set(this);
    return array;
   */
   return new Vec3().copy(this);
  
  }

  copy(v){
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    return this;
  }

  magSq(){ return this[0] * this[0] + this[1] * this[1] + this[2] * this[2]; }

  // The magnitude of a vector (x, y, z) origin is the distance to the zero origin.
  // When you need the distance between 2 vectors you subtract one from the other.
  // This has the effect of being a single vector which we want the magnitude of.  
  mag(){ return Math.hypot(this[0], this[1], this[2]); }

  toRandom(num){
    this[0] = rand(num);
    this[1] = rand(num);
    this[2] = rand(num);
  }
  
  toRandomEuler(){
    this[0] = rand(180);
    this[1] = rand(180);
    this[2] = rand(90);
  }

  // Swap the sign of all values.
  // Note it will turn negative numbers into positive numbers.
  toNegate(){
    this[0] *= -1;
    this[1] *= -1;
    this[2] *= -1;
    return this;
  }

  // Makes the calling 'this' Vec3() object a length of one.
  // This is a Unit Vector of length one.
  toNorm(){
    let magSq = this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
    
    if (magSq !== 0){
      let mag = Math.sqrt(magSq),    // The magnitude of a vector
          m = 1 / mag;                 // The inverse of the magnitude cached away so can we multiply.

      this[0] *= m;      
      this[1] *= m;      
      this[2] *= m;
    }
    return this;
  }

  // Tests for exact equalness.
  isEqual(v){ return this[0] === v[0] && this[1] === v[1] && this[2] === v[2]; }
  
  isZero(){ return this[0] === 0 && this[1] === 0 && this[2] === 0; }

  toZero(){
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
  }

  add(v){
    this[0] += v[0];
    this[1] += v[1];
    this[2] += v[2];
    return this;
  }
  sub(v) {
    this[0] -= v[0];
    this[1] -= v[1];
    this[2] -= v[2];
    return this;
  }
  mul(v) {
    this[0] *= v[0];
    this[1] *= v[1];
    this[2] *= v[2];
    return this;
  }
  div(v) {
    this[0] /= v[0];
    this[1] /= v[1];
    this[2] /= v[2];
    return this;
  }
  mod(v){
    this[0] %= v[0];
    this[1] %= v[1];
    this[2] %= v[2];
    return this;
  }  
  cross(v){
    this[0] = this[1] * v[2] - this[2] * v[1];
    this[1] = this[2] * v[0] - this[0] * v[2];
    this[2] = this[0] * v[1] - this[1] * v[0];
    return this;
  }

  dot(v){ return this[0] * v[0] + this[1] * v[1] + this[2] * v[2]; }

  dist(v){ return Math.hypot(this[0] - v[0], this[1] - v[1], this[2] - v[2]); }

  slerp(v, fraction){ return v.sub(this).mul(fraction).add(this); }

  // Functions that are passed a scalar value (decimal.) 
  addScalar(scalar){
    this[0] += scalar;
    this[1] += scalar;
    this[2] += scalar;
    return this;
  }

  subScalar(scalar){
    this[0] -= scalar;
    this[1] -= scalar;
    this[2] -= scalar;
    return this;
  }  

  divScalar(scalar){
    this[0] /= scalar;
    this[1] /= scalar;
    this[2] /= scalar;
    return this;
  }  

  mulScalar(scalar){
    this[0] *= scalar;
    this[1] *= scalar;
    this[2] *= scalar;
    return this;
  }

  modScalar(scalar){
    this[0] %= scalar;
    this[1] %= scalar;
    this[2] %= scalar;
    return this;
  }

  mulMat3(matrix){
    let x = this[0], y = this[1], z = this[2];
    this[0] = matrix[ 0 ] * x + matrix[ 3 ] * y + matrix[ 6 ] * z;
    this[1] = matrix[ 1 ] * x + matrix[ 4 ] * y + matrix[ 7 ] * z;
    this[2] = matrix[ 2 ] * x + matrix[ 5 ] * y + matrix[ 8 ] * z;
    return this;
  }

  mulMat4(mat4){
    let w = 1 / (mat4[ 3 ] * this[0] + mat4[ 7 ] * this[1] + mat4[ 11 ] * this[2] + mat4[ 15 ]);
    this[0] = (mat4[ 0 ] * this[0] + mat4[ 4 ] * this[1] + mat4[ 8 ] * this[2] + mat4[ 12 ]) * w;
    this[1] = (mat4[ 1 ] * this[0] + mat4[ 5 ] * this[1] + mat4[ 9 ] * this[2] + mat4[ 13 ]) * w;
    this[2] = (mat4[ 2 ] * this[0] + mat4[ 6 ] * this[1] + mat4[ 10 ] * this[2] + mat4[ 14 ]) * w;
    return this;
  }

  mulQuat(q){
    let x = this[0], y = this[1], z = this[2];
    let qx = q.x, qy = q.y, qz = q.z, qw = q.w;

    // calculate quat * vector
    let ix = qw * x + qy * z - qz * y;
    let iy = qw * y + qz * x - qx * z;
    let iz = qw * z + qx * y - qy * x;
    let iw = - qx * x - qy * y - qz * z;
    
    // calculate result * inverse quat
    this[0] = ix * qw + iw * - qx + iy * - qz - iz * - qy;
    this[1] = iy * qw + iw * - qy + iz * - qx - ix * - qz;
    this[2] = iz * qw + iw * - qz + ix * - qy - iy * - qx;

    return this;
  }

  sum() { return this[0] + this[1] + this[2]; }
  
  canonize() {

    let pi = Math.Pi,
      halfPi = pi * 0.5;
 
     wrapPi(this[1]);
     if (this[1] < halfPi) {
       this[0] += pi;
       this[1] = -pi - this[1];
       this[2] += pi;
    } else if (this[1] > halfPi) {
      this[0] += pi;
      this[1] = pi - this[1];
      this[2] += pi;
    }
    
    if (Math.abs(this[1]) > (halfPi - 0.0001)) {
      this[0] += this[2];
      this[2] = 0;
    } else {
      wrapPi(this[2]);
    }
    
    wrapPi(this[0]);
  }
}

/*
 *  end of class definition for Vec3 objects.
 *
 *  math functions: where v, a & b are Vec3(), Vec4(), Quat() or Array class object.
 *
 *  isEqual(v)                returns bool (true or false)
 *  isZero()                    returns bool
 *  isVec4(obj)               returns bool
 *  add(v)                    return 'this' (after altering its values.)
 *  sub(v)                    return 'this'
 *  mul(v)                    return 'this'
 
 *  mulMat3(v)                multiply vector times matrix 3x3
 *  mulMat4(v)                multiply vector times matrix 4x4
 *  mulQuat(v)                multiply vector times quaternion
 *
 *  cross(v)                  cross product
 *  dist(v)                   distance between 2 vectors
 *  div(v)                    division
 *  dot(v)                    dot product
 *  mod(v)                    modulus
 *  slerp()                     spherical linear interpretation
 *
 *  static subtract(a, b)     return new Vec4
 *  static addition(a, b)     return new Vec4
 *  static multiply(a, b)     return new Vec4
 *  static crossProduct(a, b) return new Vec4
 *  static distance(a, b)     return new Vec4
 *  static divide(a, b)       return new Vec4
 *  static dotProduct(a, b)    return new Vec4
 *  static modulus(a, b)      return new Vec4
 *  static normalize(v)       normalizes v & returns it
 *
 *  addScalar(scalar)         scalar is a floating point decimal number, all return a new Vec4() class object.
 *  subScalar(scalar)
 *  divScalar(scalar)
 *  mulScalar(scalar)
 *  modScalar(scalar)
 *
 *  toQuat()                    taken from wiki page converting Euler Angles to Quaterions
 *  toZero()                    sets 'this' object to all zeros
 *  toNorm()                    normalized the 'this' self reference object {Vec4}, call vec.toNorm();
 *  canonize()                  use to normailze Euler Angles, needs work!
 *  sum()                       add up all values, sum();
 *  mag()                       the magnitude of a vector in 3 dimensions (dist of vector from (0, 0, 0) origin)
 *  magSq()                     the magnitude squared function
 *  toRandom()                  (rand(n), rand(n), rand(n))
 *  toEulerRandom()             (rand(180), rand(180), rand(90))
 *
 *  Vec4 has accessor get & set functions for the (x, y, z) (heading, pitch, bank) (roll, pitch, yaw) elements of the array.
 *  Speed is not the main concern at early development stages.
 *
 *  The math class objects work as a team of math objects. 
 *  All Vec3, Vec4, Math4 & Quat extend the Float32Array built-in type.
 *  (To be added Vec2, Math3 for semi-completeness.)
 *
 *  There are accessors for everything you may need.
 *
 */

 
 
 
// ********************************************   Vec4   ******************************************************
 
 
 
 
class Vec4 extends Float32Array
{
  
  constructor(x = 0, y = 0, z = 0, w = 1)
  {
	  super([x, y, z, w]);
  }    

  // Accessors for vectors, Eulers, ... in various forms.
  get x() { return this[0]; }
  get y() { return this[1]; }
  get z() { return this[2]; }
  get w() { return this[3]; }

  get roll() { return this[0]; }
  get pitch(){ return this[1]; }
  get yaw()  { return this[2]; }

  get heading(){ return this[0]; }
  get bank(){ return this[2]; }

  // Accessors for color values, (R = red, G = Green, B = blue, A = Alpha channel opacity.)
  get R() { return this[0]; }
  get G() { return this[1]; }
  get B() { return this[2]; }
  get A() { return this[3]; }

  set x(value){ this[0] = value; }
  set y(value){ this[1] = value; }
  set z(value){ this[2] = value; }
  set w(value){ this[3] = value; }

  set roll(value){ this[0] = value; }
  set pitch(value){ this[1] = value; }
  set yaw(value){ this[2] = value; }
  
  set heading(value){ this[0] = value; }
  set bank(value){ this[2] = value; }

  // Accessors for color values may be needed. (R = red, G = Green, B = blue, A = Alpha channel opacity.)
  set R(value){ this[0] = value; }
  set G(value){ this[1] = value; }
  set B(value){ this[2] = value; }
  set A(value){ this[3] = value; }


  toString(){ return '(' + this[0] + ', ' + this[1] + ', ' + this[2] + ', ' + this[3] + ')'; }
  
  static isVec4(obj){ return Object.getPrototypeOf(obj).constructor.name === this.name; }
  static addition(a, b){ return new Vec4(a[0] + b[0], a[1] + b[1], a[2] + b[2]); }
  static create(){ return new Vec4(); }
  static crossProduct(a, b){ return new Vec4(a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]); }
  static divide(a, b){ return new Vec4(a[0] / b[0], a[1] / b[1], a[2] / b[2]); }
  static dotProduct(a, b){ return a[0] * b[0] + a[1] * b[1] +a[2] * b[2]; }
  static modulus(a, b){ return new Vec4(a[0] % b[0], a[1] % b[1], a[2] % b[2]); }
  static multiply(a, b){ return new Vec4(a[0] * b[0], a[1] * b[1], a[2] * b[2]); }
  static magnitude(v){ return Math.hypot(v[0], v[1], v[2]); }
  static subtract(a, b){ return new Vec4(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }  
  static distance(a, b){ return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }

  static normalize(v){
    let magSq = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    
    if (magSq !== 0){
      let mag = Math.sqrt(magSq),    // The magnitude of a vector
          m = 1 / mag;                 // The inverse of the magnitude cached away so we multiply.

      v[0] *= m;      
      v[1] *= m;      
      v[2] *= m;
    }
    return v;
  }
 
  static toQuat(vec){
    
    /* 
	   As taken from wiki page on converting Euler Angles to Unit Quaternions.
       The orient of Obj3 is converted into a Quaternion to create a rotation matrix.
       This function accepts any type of array full of numbers with a length of 3 or more.
       Normal use is a Vec4 class object which is a Float32Array & a property of Obj3 objects named orient.
       (roll, pitch, yaw) order. Accessors provide the proper names if needed.
	*/
	
    let cos = Math.cos,
      sin = Math.sin,
      cr = cos(vec[0]) * 0.5,  // half of cos(roll)
      sr = sin(vec[0]) * 0.5,  // half of sin(roll)
      cp = cos(vec[1]) * 0.5,  // half of cos(pitch)
      sp = sin(vec[1]) * 0.5,  // half of sin(pitch)
      cy = cos(vec[2]) * 0.5,  // half of cos(yaw)
      sy = sin(vec[2]) * 0.5,  // half of sin(yaw)
      q = new Quat();
      
    q.w = cy * cp * cr + sy * sp * sr;
    q.x = cy * cp * sr - sy * sp * cr;
    q.y = sy * cp * sr + cy * sp * cr;
    q.z = sy * cp * cr - cy * sp * sr;
    
    return q;
  }  

  clone(){
    let array = new Vec4();
    array.set(this);
    return array;
  }

  copy(v){
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
	this[3] = v[3];
    return this;
  }

  magSq(){ return this[0] * this[0] + this[1] * this[1] + this[2] * this[2]; }
  mag(){ return Math.hypot(this[0], this[1], this[2]); }
  
  toRandom(num){
    this[0] = rand(num);
    this[1] = rand(num);
    this[2] = rand(num);
  }
  
  toRandomEuler(){
    this[0] = rand(180);
    this[1] = rand(180);
    this[2] = rand(90);
  }

  toNegate(){
    this[0] *= -1;
    this[1] *= -1;
    this[2] *= -1;
    return this;
  }

  toNorm(){
    let magSq = this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
    
    if (magSq !== 0){
      let mag = Math.sqrt(magSq),    // The magnitude of a vector
          m = 1 / mag;                 // The inverse of the magnitude cached away so can we multiply.

      this[0] *= m;      
      this[1] *= m;      
      this[2] *= m;
    }
    return this;
  }
   
  // Functions passed 'v' where 'v' is an array of length 3 or more.
  isEqual(v){ return this[0] === v[0] && this[1] === v[1] && this[2] === v[2]; }
  
  // Ignores the w portion, treated as Vec3 class object for all math functions.
  isZero(){ return this[0] === 0 && this[1] === 0 && this[2] === 0; }
  
  toZero(){
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
	this[3] = 0;
	return this;
  }

  add(v){
    this[0] += v[0];
    this[1] += v[1];
    this[2] += v[2];
    return this;
  }
  sub(v) {
    this[0] -= v[0];
    this[1] -= v[1];
    this[2] -= v[2];
    return this;
  }
  mul(v) {
    this[0] *= v[0];
    this[1] *= v[1];
    this[2] *= v[2];
    return this;
  }
  div(v) {
    this[0] /= v[0];
    this[1] /= v[1];
    this[2] /= v[2];
    return this;
  }
  mod(v){
    this[0] %= v[0];
    this[1] %= v[1];
    this[2] %= v[2];
    return this;
  }
  
  cross(v){
    this[0] = this[1] * v[2] - this[2] * v[1];
    this[1] = this[2] * v[0] - this[0] * v[2];
    this[2] = this[0] * v[1] - this[1] * v[0];
    return this;
  }

  dot(v){ return this[0] * v[0] + this[1] * v[1] + this[2] * v[2]; }
  dist(v){ return Math.hypot(this[0] - v[0], this[1] - v[1], this[2] - v[2]); }
  slerp(v, fraction){ return v.sub(this).mul(fraction).add(this); }

  // Functions that are passed a scalar value (decimal.) 
  addScalar(scalar){
    this[0] += scalar;
    this[1] += scalar;
    this[2] += scalar;
    return this;
  }

  subScalar(scalar){
    this[0] -= scalar;
    this[1] -= scalar;
    this[2] -= scalar;
    return this;
  }  

  divScalar(scalar){
    this[0] /= scalar;
    this[1] /= scalar;
    this[2] /= scalar;
    return this;
  }  

  mulScalar(scalar){
    this[0] *= scalar;
    this[1] *= scalar;
    this[2] *= scalar;
    return this;
  }

  modScalar(scalar){
    this[0] %= scalar;
    this[1] %= scalar;
    this[2] %= scalar;
    return this;
  }

  mulMat3(matrix){
    let x = this[0], y = this[1], z = this[2];
    this[0] = matrix[ 0 ] * x + matrix[ 3 ] * y + matrix[ 6 ] * z;
    this[1] = matrix[ 1 ] * x + matrix[ 4 ] * y + matrix[ 7 ] * z;
    this[2] = matrix[ 2 ] * x + matrix[ 5 ] * y + matrix[ 8 ] * z;
    return this;
  }

  mulMat4(mat4){
    let w = 1 / (mat4[ 3 ] * this[0] + mat4[ 7 ] * this[1] + mat4[ 11 ] * this[2] + mat4[ 15 ]);
    this[0] = (mat4[ 0 ] * this[0] + mat4[ 4 ] * this[1] + mat4[ 8 ] * this[2] + mat4[ 12 ]) * w;
    this[1] = (mat4[ 1 ] * this[0] + mat4[ 5 ] * this[1] + mat4[ 9 ] * this[2] + mat4[ 13 ]) * w;
    this[2] = (mat4[ 2 ] * this[0] + mat4[ 6 ] * this[1] + mat4[ 10 ] * this[2] + mat4[ 14 ]) * w;
    return this;
  }

  mulQuat(q){
    let x = this[0], y = this[1], z = this[2];
    let qx = q.x, qy = q.y, qz = q.z, qw = q.w;

    // calculate quat * vector
    let ix = qw * x + qy * z - qz * y;
    let iy = qw * y + qz * x - qx * z;
    let iz = qw * z + qx * y - qy * x;
    let iw = - qx * x - qy * y - qz * z;
    
    // calculate result * inverse quat
    this[0] = ix * qw + iw * - qx + iy * - qz - iz * - qy;
    this[1] = iy * qw + iw * - qy + iz * - qx - ix * - qz;
    this[2] = iz * qw + iw * - qz + ix * - qy - iy * - qx;

    return this;
  }

  sum() { return this[0] + this[1] + this[2]; }
  
  canonize() {

    let pi = Math.Pi,
      halfPi = pi * 0.5;
 
     wrapPi(this[1]);
     if (this[1] < halfPi) {
       this[0] += pi;
       this[1] = -pi - this[1];
       this[2] += pi;
    } else if (this[1] > halfPi) {
      this[0] += pi;
      this[1] = pi - this[1];
      this[2] += pi;
    }
    
    if (Math.abs(this[1]) > (halfPi - 0.0001)) {
      this[0] += this[2];
      this[2] = 0;
    } else {
      wrapPi(this[2]);
    }
    
    wrapPi(this[0]);
  }
}

// ********************************************   Color   ******************************************************

const Color = Vec4;

/* 
 *
 *  end of class definition Vec4().
 *
 *  begining of Mat4 class defintion
 *
 *  Extends built-in data type Float32Array, 16 floating point decimals.
 *  An identity matrix scales an object to size = 1, the 1's you see diagonally.
 *  With a matrix you can change the origin, orient & scale of all vectors in a wire frame mesh.
 *  You multiply matrices together & multiply the vectors by the final matrix to transform a mesh.
 *  This imports an Object Space mesh into your Virtual World Space.
 *  The super keyword calls the parent constructor (super class Float32Array() so you have all its functionallity.)
 *
 *  static functions on prototype:
 *
 *  static isMat4()                     returns bool true or false.
 *  static determinate(matrix)          returns scalar values (decimal number.)
 *  static lookAt(origin, lookAt, up)   returns Mat4 (All return a new Mat4() class object.)
 *  static inverse(matrix)              returns Mat4
 *  static invert()
 *  static transpose()
 *  static multipy(a, b)                returns Mat4 (where a & b are Mat4 or Array with a length >= 16.)
 *  static perspective(eye, target, up) returns Mat4 (where parameters are Vec4 class objects or Array with a length >= 3.)
 *  static rotationX(angleInRadians)    returns Mat4
 *  static rotationY(angleInRadians)    returns Mat4
 *  static rotationZ(angleInRadians)    returns Mat4
 *  static transpose(matrix)            returns Mat4
 *
 *  function on prototype which alter the 'this' reference object.
 *
 *  clone()                             returns Mat4 (does not alter 'this')
 *  identity()                          returns 'this'
 *  inverse()                           returns 'this'
 *  mul(a, b)                           returns 'this'
 *  rotate(rad, axis)                   returns 'this'
 *  rotateX(angleInradians)             returns 'this'
 *  rotateY(angleInradians)             returns 'this'
 *  rotateZ(angleInradians)             returns 'this'
 *
 *  Plus 20 accessors! Please read code below;
 *
 */

 
 
 
 
 
 
 
// ********************************************   Mat4  ******************************************************







class Mat4 extends Float32Array
{

  constructor()
  {
    // super() class constructor() function Float32Array() is called before using the 'this' reference.
    super([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  // Accessors functions on prototype.
  get origin(){ return new Vec3(this[12], this[13], this[14]); }
  get scale(){ return new Vec3(this[0], this[5], this[9]); }

  get m11(){ return this[0]; }
  get m12(){ return this[1]; }
  get m13(){ return this[2]; }
  get m14(){ return this[3]; }
  get m21(){ return this[4]; }
  get m22(){ return this[5]; }
  get m23(){ return this[6]; }
  get m24(){ return this[7]; }
  get m31(){ return this[8]; }  
  get m32(){ return this[9]; }  
  get m33(){ return this[10]; }  
  get m34(){ return this[11]; }
  get m41(){ return this[12]; }
  get m42(){ return this[13]; }  
  get m43(){ return this[14]; }  
  get m44(){ return this[15]; }  

  set m11(value){ this[0] = value; }
  set m12(value){ this[1] = value; }
  set m13(value){ this[2] = value; }
  set m14(value){ this[3] = value; }
  set m21(value){ this[4] = value; }
  set m22(value){ this[5] = value; }
  set m23(value){ this[6] = value; }
  set m24(value){ this[7] = value; }
  set m31(value){ this[8] = value; }
  set m32(value){ this[9] = value; }
  set m33(value){ this[10] = value; }
  set m34(value){ this[11] = value; }
  set m41(value){ this[12] = value; }
  set m42(value){ this[13] = value; }
  set m43(value){ this[14] = value; }
  set m44(value){ this[15] = value; }
  
  set origin(value){
    if (value instanceof Vec3 || value instanceof Vec4 || Array.isArray(value) && value.length >= 3){
      this[12] = value[0];
      this[13] = value[1];
      this[14] = value[2];
    }
  }

  set scale(value){
    if (value instanceof Vec3 || value instanceof Vec4 || Array.isArray(value) && value.length >= 3){
      this[0] = value[0];
      this[5] = value[1];
      this[9] = value[2];
    }
  }

// Static functions.

  static isMat4(obj){ return Object.getPrototypeOf(obj).constructor.name === this.name; }


  static determinate(matrix){ 
    let a00 = matrix[0], a01 = matrix[1], a02 = matrix[2], a03 = matrix[3],
        a10 = matrix[4], a11 = matrix[5], a12 = matrix[6], a13 = matrix[7],
        a20 = matrix[8], a21 = matrix[9], a22 = matrix[10], a23 = matrix[11],
        a30 = matrix[12], a31 = matrix[13], a32 = matrix[14], a33 = matrix[15],

       b00 = a00 * a11 - a01 * a10,
       b01 = a00 * a12 - a02 * a10,
       b02 = a00 * a13 - a03 * a10,
       b03 = a01 * a12 - a02 * a11,
       b04 = a01 * a13 - a03 * a11,
       b05 = a02 * a13 - a03 * a12,
       b06 = a20 * a31 - a21 * a30,
       b07 = a20 * a32 - a22 * a30,
       b08 = a20 * a33 - a23 * a30,
       b09 = a21 * a32 - a22 * a31,
       b10 = a21 * a33 - a23 * a31,
       b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant.
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }

  static inverse(matrix){

    let m00 = matrix[0],
        m01 = matrix[1],
        m02 = matrix[2],
        m03 = matrix[3],
        m10 = matrix[4],
        m11 = matrix[5],
        m12 = matrix[6],
        m13 = matrix[7],
        m20 = matrix[8],
        m21 = matrix[9],
        m22 = matrix[10],
        m23 = matrix[11],
        m30 = matrix[12],
        m31 = matrix[13],
        m32 = matrix[14],
        m33 = matrix[15],
    
        tmp_0 = m22 * m33,
        tmp_1 = m32 * m23,
        tmp_2 = m12 * m33,
        tmp_3 = m32 * m13,
        tmp_4 = m12 * m23,
        tmp_5 = m22 * m13,
        tmp_6 = m02 * m33,
        tmp_7 = m32 * m03,
        tmp_8 = m02 * m23,
        tmp_9 = m22 * m03,
        tmp_10 = m02 * m13,
        tmp_11 = m12 * m03,
        tmp_12 = m20 * m31,
        tmp_13 = m30 * m21,
        tmp_14 = m10 * m31,
        tmp_15 = m30 * m11,
        tmp_16 = m10 * m21,
        tmp_17 = m20 * m11,
        tmp_18 = m00 * m31,
        tmp_19 = m30 * m01,
        tmp_20 = m00 * m21,
        tmp_21 = m20 * m01,
        tmp_22 = m00 * m11,
        tmp_23 = m10 * m01,
  
        t0 = tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31),
        t1 = tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31),
        t2 = tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31),
        t3 = tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21),
        d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  
    matrix[0] = d * t0;
    matrix[1] = d * t1;
    matrix[2] = d * t2;
    matrix[3] = d * t3;
    matrix[4] = d * (tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30 - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
    matrix[5] = d * (tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30 - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
    matrix[6] = d * (tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30 - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
    matrix[7] = d * (tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20 - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
    matrix[8] = d * (tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33 - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
    matrix[9] = d * (tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33 - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
    matrix[10] = d * (tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33 - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
    matrix[11] = d * (tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23 - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
    matrix[12] = d * (tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12 - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
    matrix[13] = d * (tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22 - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
    matrix[14] = d * (tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02 - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
    matrix[15] = d * (tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12 - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
  
    return matrix;
  }

  // For setting a camera's matrix with 3 Vec3() class objects or 3 arrays.
  static lookAt(eye, target, up){

    let matrix = new Mat4(),
        xAxis = new Vec3(),
        yAxis = new Vec3(),
        zAxis = Vec3.subtract(eye, target);  // The static function subtract() returns a new Vec3() class object.

    zAxis.toNorm();                            // The method .toNorm() on the Vec3.prototype chain alter the 'this' calling objects data (zAxis).
	                                           // toNorm return 'this' after altering, a normalized vector with a length of 1.
    xAxis.set(Vec3.crossProduct(up, zAxis));   // I believe a cross product of 2 3d vectors yields a perpendicular vector?
    xAxis.toNorm();

    yAxis.set(Vec3.crossProduct(zAxis, xAxis)); 
    yAxis.toNorm();

    matrix[0] = xAxis[0];
    matrix[1] = xAxis[1];
    matrix[2] = xAxis[2];
    matrix[3] = 0;
    matrix[4] = yAxis[0];
    matrix[5] = yAxis[1];
    matrix[6] = yAxis[2];
    matrix[7] = 0;
    matrix[8] = zAxis[0];
    matrix[9] = zAxis[1];
    matrix[10] = zAxis[2];
    matrix[11] = 0;
    matrix[12] = eye[0];     // position of camera focal eye (apeture.)
    matrix[13] = eye[1];
    matrix[14] = eye[2];
    matrix[15] = 1;
    return matrix;
  }

  // Multiply a matrix times a matrix, no checking is done. Assumes a 4x4 matrix Array of length >= 16.
  static multiply(a, b) {
  
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],
        matrix = new Mat4();
  
    // Cache only the current line of the second matrix
    let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    matrix[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    matrix[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    matrix[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    matrix[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    matrix[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    matrix[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    matrix[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    matrix[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    matrix[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    matrix[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    matrix[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    matrix[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    matrix[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    matrix[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    matrix[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    matrix[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    return matrix;
  }
  


/*
  Computes a 4-by-4 orthographic projection matrix given the coordinates of the planes defining the axis-aligned, box-shaped viewing volume.  The matrix generated sends that box to the unit box.  Note that although left and right are x coordinates and bottom and top are y coordinates, near and far are not z coordinates, but rather they are distances along the negative z-axis.  We assume a unit box extending from -1 to 1 in the x and y


   dimensions and from -1 to 1 in the z dimension.
   @param {number} left The x coordinate of the left plane of the box.
   @param {number} right The x coordinate of the right plane of the box.
   @param {number} bottom The y coordinate of the bottom plane of the box.
   @param {number} top The y coordinate of the right plane of the box.
   @param {number} near The negative z coordinate of the near plane of the box.
   @param {number} far The negative z coordinate of the far plane of the box.
   @param {Matrix4} [dst] optional matrix to store result
   @return {Matrix4} dst or a new matrix if none provided
   @memberOf module:webgl-3d-math

 */
   
  orthographic(left, right, bottom, top, near, far)
 {
    var dst =  new Mat4();

    dst[ 0] = 2 / (right - left);
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = 2 / (top - bottom);
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = 2 / (near - far);
    dst[11] = 0;
    dst[12] = (left + right) / (left - right);
    dst[13] = (bottom + top) / (bottom - top);
    dst[14] = (near + far) / (near - far);
    dst[15] = 1;

    return dst;
  }

 
/*

    Computes a 4-by-4 perspective transformation matrix given the left, right,
   top, bottom, near and far clipping planes. The arguments define a frustum
   extending in the negative z direction. The arguments near and far are the
   distances to the near and far clipping planes. Note that near and far are not
   z coordinates, but rather they are distances along the negative z-axis. The
   matrix generated sends the viewing frustum to the unit box. We assume a unit
   box extending from -1 to 1 in the x and y dimensions and from -1 to 1 in the z
   dimension.
   @param {number} left The x coordinate of the left plane of the box.
   @param {number} right The x coordinate of the right plane of the box.
   @param {number} bottom The y coordinate of the bottom plane of the box.
    @param {number} top The y coordinate of the right plane of the box.
    @param {number} near The negative z coordinate of the near plane of the box.
   @param {number} far The negative z coordinate of the far plane of the box.
   @param {Matrix4} [dst] optional matrix to store result
    @return {Matrix4} dst or a new matrix if none provided
   @memberOf module:webgl-3d-math
   
  */
   




   frustum(left, right, bottom, top, near, far,) 
{
    var dst = new Mat4();

    var dx = right - left;
    var dy = top - bottom;
    var dz = far - near;

    dst[ 0] = 2 * near / dx;
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = 2 * near / dy;
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = (left + right) / dx;
    dst[ 9] = (top + bottom) / dy;
    dst[10] = -(far + near) / dz;
    dst[11] = -1;
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = -2 * near * far / dz;
    dst[15] = 0;

    return dst;
  }



/*
 @param {number} fov          Vertical field of view on the y axis in radians.
 @param {number} aspect       Aspect ratio of canvas viewport gl.canvas.width / gl.canvas.height.
  @param {number} nearPlane    Near plane boundry of the camera view frustum.
 @param {number} farPlane     Far plane boundry of the camera view frustum.
 @return new Mat4();
 
 Must be called Example:
 var mat = Mat4.perspective(fov, aspect, near, far);
 
 */
 
  static perspective(fov, aspect, near, far){

    let f = 1.0 / Math.tan(fov / 2),
        nf = 1 / (near - far),
        matrix = new Mat4();
    
    matrix[0] = f / aspect;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = 0;
    matrix[5] = f;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = 0;
    matrix[9] = 0;
    matrix[10] = (far + near) * nf;
    matrix[11] = -1;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = (2 * far * near) * nf;
    matrix[15] = 0;
    return matrix;
  }

  static rotationX(angleInRadians){
    
    let matrix = new Mat4(),
        c = Math.cos(angleInRadians),
        s = Math.sin(angleInRadians);
    
    matrix[0] = 1;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = 0;
    matrix[5] = c;
    matrix[6] = s;
    matrix[7] = 0;
    matrix[8] = 0;
    matrix[9] = -s;
    matrix[10] = c;
    matrix[11] = 0;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;
    matrix[15] = 1;
    return matrix;
  }

  static rotationY(angleInRadians){
    
    let matrix = new Mat4(),
        c = Math.cos(angleInRadians),
        s = Math.sin(angleInRadians);
    
    matrix[0] = c;
    matrix[1] = 0;
    matrix[2] = -s;
    matrix[3] = 0;
    matrix[4] = 0;
    matrix[5] = 1;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = s;
    matrix[9] = 0;
    matrix[10] = c;
    matrix[11] = 0;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;
    matrix[15] = 1;
    return matrix;
  }

  static rotationZ(angleInRadians){
    
    let matrix = new Mat4(),
        c = Math.cos(angleInRadians),
        s = Math.sin(angleInRadians);
    
    matrix[0] = c;
    matrix[1] = s;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = -s;
    matrix[5] = c;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = 0;
    matrix[9] = 0;
    matrix[10] = 1;
    matrix[11] = 0;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;
    matrix[15] = 1;
    return matrix;
  }

  
// Prototype functions.  

  clone(){
    let array = new Quat();
    array.set(this);
    return array;
  }

  copy(){
	let array = new Mat4(); 
	array.set(this);
    return array;	
  }

  identity() {
    this.set(
      [1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1]
 );
    return this;
  }

  
 
static transpose(out, a)
{
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a)
  {
    var a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a12 = a[6],
        a13 = a[7];
    var a23 = a[11];

    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  }
  else
  {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
}

	static invert(out, a)
	{
	let a00 = a[0],
		a01 = a[1],
		a02 = a[2],
		a03 = a[3],
	    a10 = a[4],
		a11 = a[5],
		a12 = a[6],
		a13 = a[7],
	    a20 = a[8],
		a21 = a[9],
		a22 = a[10],
		a23 = a[11],
	    a30 = a[12],
		a31 = a[13],
		a32 = a[14],
		a33 = a[15],
	
	    b00 = a00 * a11 - a01 * a10,
	    b01 = a00 * a12 - a02 * a10,
	    b02 = a00 * a13 - a03 * a10,
	    b03 = a01 * a12 - a02 * a11,
	    b04 = a01 * a13 - a03 * a11,
	    b05 = a02 * a13 - a03 * a12,
	    b06 = a20 * a31 - a21 * a30,
	    b07 = a20 * a32 - a22 * a30,
	    b08 = a20 * a33 - a23 * a30,
	    b09 = a21 * a32 - a22 * a31,
	    b10 = a21 * a33 - a23 * a31,
	    b11 = a22 * a33 - a23 * a32,

       // Calculate the determinant
       det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

   det = 1.0 / det;

   out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
   out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
   out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
   out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
   out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
   out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
   out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
   out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
   out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
   out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
   out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
   out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
   out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
   out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
   out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
   out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  }

  // Multiply a matrix times a matrix, no checking is done. Assumes a 4x4 matrix Array of length 16 or greater.
  mul(b)
  {
    let a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3],
      a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7],
      a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11],
      a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15];

    // Cache only the current line of the second matrix
    let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    return this;
  }

  /*
   * Rotates a Mat4 by the given angle in radians around the given unit vector axis
   *
   * @param {Number} angleInRadians the angle to rotate the matrix by
   * @param {Vec3} axis to rotate around as a unit vector (usually.)
   * @returns {Mat4} this, alters the calling Mat4 objects and chains.
   */

  rotate(angleInRadians, axis) { // Where angleInRadians is angle in radians, axis is a unit vector.
    let x = axis[0],
        y = axis[1],
        z = axis[2],
        len = Math.hypot(x, y, z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

       // If zero vector in other words, not a unit vector for axis to rotate about.
      if (len < EPSILON) {
       return null;
    }

    // Normalize the vector for sanity sake, just to be safe.
    len = 1 / len; // Multiply by the inverse to normalize. (Length of one.)
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(angleInRadians);
    c = Math.cos(angleInRadians);
    t = 1 - c;
    a00 = this[0];
    a01 = this[1];
    a02 = this[2];
    a03 = this[3];
    a10 = this[4];
    a11 = this[5];
    a12 = this[6];
    a13 = this[7];
    a20 = this[8];
    a21 = this[9];
    a22 = this[10];
    a23 = this[11]; // Construct the elements of the rotation matrix

    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

    this[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return this;
  }

  rotateX(angleInRadians)
  {

    let c = Math.cos(angleInRadians),
        s = Math.sin(angleInRadians);

    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = c;
    this[6] = s;
    this[7] = 0;
    this[8] = 0;
    this[9] = -s;
    this[10] = c;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }

  rotateY(angleInRadians)
  {
    let c = Math.cos(angleInRadians),
        s = Math.sin(angleInRadians);
    
    this[0] = c;
    this[1] = 0;
    this[2] = -s;
    this[3] = 0;
    this[4] = 0;
    this[5] = 1;
    this[6] = 0;
    this[7] = 0;
    this[8] = s;
    this[9] = 0;
    this[10] = c;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }


  rotateZ(angleInRadians)
  {
    
    let c = Math.cos(angleInRadians),
        s = Math.sin(angleInRadians);
    
    this[0] = c;
    this[1] = s;
    this[2] = 0;
    this[3] = 0;
    this[4] = -s;
    this[5] = c;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = 1;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
}

/*
 *  end of class definition for Mat4
 *
 *  clone()
 *  cross()
 *  copy(v)
 *  dot()
 *  isEqual(v)
 *  isZero()
 *  mag()
 *  magSq()
 *  toNegate()
 *  toNorm()
 *
 *  static isQuat()
 *  static magnitude(quat)    Quat.magnitude(quat)
 *  static multiply(a, b)     Quat.multiply(a, b)
 *  static slerp(a, b, t)     spherical linear interpolation, Quat.slerp(a, b, t)
 *  static toEuler(quat)    turns a quaternion into an Euler Angle, Quat.toEuler(quat)
 
 *******************************************   Quat   ******************************/
 
 
 
// The quaterion class object for special math dealing with angles.
class Quat extends Vec4
{

	constructor(x = 0, y = 0, z = 0, w = 1)
	{  
		super([ 0, 0, 0, 0, ]); 
	}

	static isQuat(obj){ return Object.getPrototypeOf(obj).constructor.name === this.name; }

	// Slerp = Spherical Linear Interpretation.
	// Meaning we plot points in between 2 quats. For drawing at different vectors in between.
	static slerp(a, b, t){
    
		let ax = a[0],
			ay = a[1],
			az = a[2],
			aw = a[3],
			bx = b[0],
			by = b[1],
			bz = b[2],
			bw = b[3],
			omega, cosom, sinom, scale0, scale1;           // calculate cosine

			cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

		if (cosom < 0.0) 
		{
			cosom = -cosom;
			bx = -bx;
			by = -by;
			bz = -bz;
			bw = -bw;
		} // calculate coefficients

		if (1.0 - cosom > EPSILON)
		{

		  // standard case (slerp)
		  omega = Math.acos(cosom);
		  sinom = Math.sin(omega);
		  scale0 = Math.sin((1.0 - t) * omega) / sinom;
		  scale1 = Math.sin(t * omega) / sinom;
		} 
		else 
		{
			// 'from' and 'to' quaternions are very close
			//  ... so we can do a linear interpolation
			scale0 = 1.0 - t;
			scale1 = t;
		}   // calculate final values

		this[0] = scale0 * ax + scale1 * bx;
		this[1] = scale0 * ay + scale1 * by;
		this[2] = scale0 * az + scale1 * bz;
		this[3] = scale0 * aw + scale1 * bw;
		return this;
	}

	  // Turns a passed in quaternion into an Euler Angle.
	  // Must be called Quat.toEuler(quat);
	  // returns an Euler Angle Vec3() class object with accessors for (roll, pitch, yaw) built-in.
	  static toEuler(quat){

		// roll, pitch & yaw order
		let euler = new Vec3(),
			sinr_cosp = 2 * (quat[3] * quat[0] + quat[1] * quat[2]),      // roll (x-axis rotation)
			cosr_cosp = 1 - 2 * (quat[0] * quat[0] + quat[1] * quat[1]);
		  
		euler.roll = Math.atan2(sinr_cosp, cosr_cosp);
		
		let  sinp = 2 * (quat[3] * quat[1] - quat[2] * quat[0]);

		if (Math.abs(sinp) >= 1){
		  euler.pitch = copysign(PI / 2, sinp); // use 90 degrees if out of range
		} else {
		  euler.pitch = Math.asin(sinp);

			// yaw (z-axis rotation)
			let siny_cosp = 2 * (quat[3] * quat[2] + quat[0] * quat[1]),
				cosy_cosp = 1 - 2 * (quat[1] * quat[1] + quat[2] * quat[2]);  
			euler.yaw = Math.atan2(siny_cosp, cosy_cosp);
		}
		return euler;
	}  

	mul(quat){
		let ax = this[0], ay = this[1], az = this[2], aw = this[3],
			bx = quat[0], by = quat[1], bz = quat[2], bw = quat[3];
		  
		this[0] = ax * bw + aw * bx + ay * bz - az * by;
		this[1] = ay * bw + aw * by + az * bx - ax * bz;
		this[2] = az * bw + aw * bz + ax * by - ay * bx;
		this[3] = aw * bw - ax * bx - ay * by - az * bz;
		return this;    
	}
	  
	static multiply(a, b){
		let ax = a[0], ay = a[1], az = a[2], aw = a[3],
			bx = b[0], by = b[1], bz = b[2], bw = b[3],
			quat = new Quat();
		  
		quat[0] = ax * bw + aw * bx + ay * bz - az * by;
		quat[1] = ay * bw + aw * by + az * bx - ax * bz;
		quat[2] = az * bw + aw * bz + ax * by - ay * bx;
		quat[3] = aw * bw - ax * bx - ay * by - az * bz;
		return quat;    
	}
}

Object.freeze(Camera, Vec3, Vec4, Mat4, Quat);

// eof
