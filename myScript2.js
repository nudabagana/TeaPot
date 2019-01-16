let gui;
let texture = new THREE.TextureLoader().load( "tile.png" );
window.onload =  () =>
{
    // GUI
    var robotControllVars = function() {
        this.dirX = 0.5;
        this.dirY = 0.0;
        this.shin = 30.0;
    };
    
      
    var robotVars = new robotControllVars();
    var gui = new dat.GUI();
    gui.add(robotVars, 'dirX', -1.0, 1.0, 0.01);    
    gui.add(robotVars, 'dirY', -1.0, 1.0, 0.01);    
    gui.add(robotVars, 'shin', 1.0, 60.0, 1);  

    // Setup
    var scene = new THREE.Scene();

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 1 );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    document.querySelector('#container').appendChild( renderer.domElement );

    // Camera 
    var camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 100;
    camera.lookAt( 0,0,0 );
    // scene.add(camera);
    // selectedCamera = camera;

    var orbit = new THREE.OrbitControls( camera, renderer.domElement );
    orbit.enableZoom = true;

    // Lights
    var lights = [];
    lights[ 0 ] = new THREE.DirectionalLight( 0xffffff );
    lights[ 1 ] = new THREE.SpotLight( 0xffffff);

    lights[ 0 ].position.set( -100, -100, 0 );
    lights[ 1 ].position.set( 100, 100, 100 );

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    // helpers
    // scene.add( new THREE.AxesHelper( 20 ) );

    // Shapes    
     
    let material = new THREE.ShaderMaterial( {
        uniforms: { 
			uDirX: {type: 'f', value:  0.0}, 
			uDirY: {type: 'f', value:  0.0}, 
            uShininess: {type: 'f', value:  30.0},
            texture1: { type: "t", value: texture}
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent  
    } );

    let ConeRadius = 15;
    let ConeHeight = 40;

    let materialCone = new THREE.ShaderMaterial( {
        uniforms: { 
			uDirX: {type: 'f', value:  0.0}, 
			uDirY: {type: 'f', value:  0.0}, 
            uShininess: {type: 'f', value:  30.0},
            uConeHeight: {type: 'f', value: ConeHeight},
        },
        vertexShader: document.getElementById( 'vertexShaderCone' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShaderCone' ).textContent  
    } );
     
	//size, segments, bottom, lid, body, fitLid, blinn
	var teapotSize = 15; //400;
	var segments = 20;
    geo = new THREE.TeapotBufferGeometry(teapotSize, segments, true, true, true, true, true);
	let mesh = new THREE.Mesh(geo, material); 
    scene.add( mesh );
    
    var geometry = new THREE.ConeBufferGeometry( ConeRadius, ConeHeight, 100, 100 );
    
    var cone = new THREE.Mesh( geometry, materialCone );
    cone.position.x = 50;
    scene.add( cone );
 
    // End of Shapes

    // Render
    let render = () =>
    {
        material.uniforms.uDirX.value = robotVars.dirX; 
        material.uniforms.uDirY.value = robotVars.dirY; 
        material.uniforms.uShininess.value = robotVars.shin;

        materialCone.uniforms.uDirX.value = robotVars.dirX; 
        materialCone.uniforms.uDirY.value = robotVars.dirY; 
        materialCone.uniforms.uShininess.value = robotVars.shin; 
        renderer.render( scene, camera );
        requestAnimationFrame( render );
    };

    window.addEventListener( 'resize', function () {
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }, false );

    render();

}
