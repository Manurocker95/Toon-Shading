"use strict";
//out.println();

Synthclipse.debugMode = true;

Synthclipse.setGLVersion(3, 3);
Synthclipse.load("gl-matrix-min.js");

var vShader = "../shaders/myShaders/toonShading.vert";
var fShader = "../shaders/myShaders/toonShading.frag";

//! <group name="Main"/>
var currentShapeID 	=  0; //! combobox[0, "Cone", "Sphere", "Torus", "Box", "Teapot", "Axes", "Cylinder", "Trefoil Knot", "Torus Knot", "Line", "Quad", "Plane" ]
var lastShapeID 	= -1;

//! <group name="Cone"/>
var coneRadius 			= 0.5; //! slider[0.1, 3, 10]
var coneHeight 			= 1; //! slider[0.1, 5, 10]
var coneTessellation 	= 16; //! islider[8, 32, 64]

//! <group name="Sphere"/>
var sphereRadius 		= 3; //! slider[1, 3, 10]
var sphereTessellation 	= 16; //! islider[4, 24, 64]

//! <group name="Torus"/>
var torusInnerRadius 	= 0.5; //! slider[0.1, 1, 10]
var torusOuterRadius 	= 1; //! slider[0.1, 2, 10]
var torusRings 			= 16; //! islider[4, 24, 64]
var torusSides 			= 16; //! islider[4, 24, 64]

//! <group name="Box"/>
var boxLengthX = 1; //! slider[0.1, 5, 10]
var boxLengthY = 1; //! slider[0.1, 5, 10]
var boxLengthZ = 1; //! slider[0.1, 5, 10]

//! <group name="Teapot"/>
var teapotTessellation = 4; //! islider[1, 4, 16]

//! <group name="Cylinder"/>
var cylinderRadius 			= 0.5; //! slider[0.1, 2, 10]
var cylinderHeight 			= 1; //! slider[0.1, 5, 10]
var cylinderTessellation 	= 16; //! islider[8, 32, 64]

//! <group name="TrefoilKnot"/>
var trefoilSlices = 128; //! islider[16, 128, 256]
var trefoilStacks = 32; //! islider[16, 32, 128]

//! <group name="TrousKnot"/>
var torusKnotP 				= 3; //! islider[1, 3, 16]
var torusKnotQ 				= 4; //! islider[1, 4, 16]
var torusKnotNumSegments 	= 64; //! islider[16, 64, 256]
var torusKnotNumRings 		= 64; //! islider[16, 64, 256]
var torusKnotRadius 		= 1;  //! slider[0.1, 1, 10]
var torusKnotDistance 		= 5; //! slider[1, 5, 25]

//! <group name="Plane"/>
var planeSizeX 			= 100; //! slider[1, 150, 200]
var planeSizeZ 			= 100; //! slider[1, 150, 200]
var planeTessellationX 	= 20; //! slider[1, 20, 50]
var planeTessellationZ 	= 20; //! slider[1, 20, 50]

//! <group name="Quad"/>
var quadHalfLength = 1; //! slider[1, 4, 15];

//! <group name="Line"/>
var lineP1 = Native.newVector3(-10, -10, -10); //! slider[(-10,-10,-10), (-10,-10,-10), (10,10,10)]
var lineP2 = Native.newVector3(10, 10, 10); //! slider[(-10,-10,-10), (10,10,10), (10,10,10)]

//! <group name="Axes"/>
var axesLength = 100; //! slider[1, 100, 100]

var program = null;

var backgroundColor = Native.newColorRGB(); //! color[0, 0, 0]

var renderable = {};
var modelToRender = null;

function drawScene() 
{
	gl.clearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if (lastShapeID != currentShapeID) 
	{
		switchModels(currentShapeID);
		lastShapeID = currentShapeID;
	}	
	program.use();
	
	applyParameters() ;	
	program.applyUniforms();
	
	modelToRender.render(program);
}

function Model(nativeModel, x, y, z) 
{
	this.obj = nativeModel;

	this.obj.transform.translate(x, y, z);

	this.render = function(program) 
	{
		program.setUniform("ModelMatrix", nativeModel.transform);
		nativeModel.render();
	};
}

function switchModels(id) 
{	
	switch (id) 
	{
		case 0://Cone
			var model = GeometryFactory.createCone(coneRadius, coneHeight, coneTessellation);
			modelToRender = new Model(model, 0, 0, 0);	
			break;
		case 1://Sphere			
			var model = GeometryFactory.createSphere(sphereRadius, sphereTessellation);
			modelToRender = new Model(model, 0, 0, 0);	
			break;
		case 2://Torus
			var model = GeometryFactory.createTorus(torusInnerRadius, torusOuterRadius, torusRings, torusSides);
			modelToRender = new Model(model, 0, 0, 0);	
			break;
		case 3://Box			
			var model = GeometryFactory.createBox(boxLengthX, boxLengthY, boxLengthZ);
			modelToRender = new Model(model, 0, 0, 0);	
			break;
		case 4://Teapot	
			var model = GeometryFactory.createTeapot(teapotTessellation);
			modelToRender = new Model(model, 0, 0, 0);	
			break;
		case 5://Axes		
			var model = GeometryFactory.createAxes(axesLength);
			modelToRender = new Model(model, 0, 0, 0);	
			break;
		case 6://Cylinder
			var model = GeometryFactory.createCylinder(cylinderRadius, cylinderHeight, cylinderTessellation);
			modelToRender = new Model(model, 0, 0, 0);	
			break;
		case 7://Trefoi
			var model = GeometryFactory.createTrefoilKnot(trefoilSlices, trefoilStacks);
			modelToRender = new Model(model, 0, 0, 0);	
			break;
		case 8://TorusKnot
			var model = GeometryFactory.createTorusKnot(torusKnotP, torusKnotQ, torusKnotNumSegments,
					torusKnotNumRings, torusKnotRadius, torusKnotDistance);
			//torusKnot.transform.scale(0.3);
			modelToRender = new Model(model, 0, 0, 0);	
			break;
		case 9://Line
			var model = GeometryFactory.createLine(lineP1, lineP2);
			modelToRender = new Model(model, 0, 0, 0);	
			break;
		case 10://Quad
			var model = GeometryFactory.createQuad(quadHalfLength);
			modelToRender = new Model(model, 0, 0, 0);	
			break;
		case 11://Plane	
			var model = GeometryFactory.createPlane(planeSizeX, planeSizeZ, planeTessellationX,
					planeTessellationZ);
			modelToRender = new Model(model, 0, 0, 0);	
			//modelToRender.material.useTexture = true;
			break;
		default:
			break;
	}
}

function applyParameters() 
{
	var model = modelToRender.obj;
	
	switch (currentShapeID) 
	{
		case 0://Cone
			model.radius = coneRadius;
			model.height = coneHeight;
			model.tessellation = coneTessellation;
		break;
		case 1://sphere 
			model.radius = sphereRadius;
			model.tessellation = sphereTessellation;
		break;
	
		case 2://torus	
			model.innerRadius = torusInnerRadius;
			model.outerRadius = torusOuterRadius;
			model.rings = torusRings;
			model.sides = torusSides;
		break;
		case 3://box
			model.lengthX = boxLengthX;
			model.lengthY = boxLengthY;
			model.lengthZ = boxLengthZ;
		break;	
		case 4://teapot	
			model.tessellation = teapotTessellation;
		break;

		case 6://Cylinder
			model.radius = cylinderRadius;
			model.height = cylinderHeight;
			model.tessellation = cylinderTessellation;
		break;
		case 7://Trefoil
			model.slices = trefoilSlices;
			model.stacks = trefoilStacks;
		break;
		case 8://Knot
			model.p = torusKnotP;
			model.q = torusKnotQ;
			model.numSegments = torusKnotNumSegments;
			model.numRings = torusKnotNumRings;
			model.radius = torusKnotRadius;
			model.distance = torusKnotDistance;
		break;
		default:
			break;
		}
}

function initShaders() 
{
	program = ProgramFactory.createProgram("GLSL testing");

	program.attachShader(vShader);	
	program.attachShader(fShader);		
	
	program.link();

    Synthclipse.createControls(program);
    Synthclipse.createScriptControls();
    
    program.loadPreset("Default");
    Synthclipse.loadPreset("Default");
}

renderable.init = function() 
{
	initShaders();
	
	switchModels(0);
	
	var sphericalCamera = CameraManager.getSphericalCamera();
	sphericalCamera.setPosition(0.0, 0.0, -6.0);

	CameraManager.useSphericalCamera();
	CameraManager.setZoomFactor(0.4);
	
	gl.enable(gl.DEPTH_TEST);
};

renderable.display = function() 
{	
	drawScene();
};

Synthclipse.setRenderable(renderable);

//! <preset file="main_practik_1.preset" />
