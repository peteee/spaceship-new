import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
//import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
//import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';


let camera, scene, renderer;
window.ship = '';



init();

function init() {

    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    container.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 0, 500, 0 );

    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x00ffff );
    scene.environment = pmremGenerator.fromScene( environment ).texture;
    environment.dispose();

    const grid = new THREE.GridHelper( 500, 10, 0xffffff, 0xffffff );
    grid.material.opacity = 0.5;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    //scene.add( grid );

    // const ktx2Loader = new KTX2Loader()
    //     .setTranscoderPath( 'jsm/libs/basis/' )
    //     .detectSupport( renderer );

    const loader = new GLTFLoader().setPath( 'models/' );
    //loader.setKTX2Loader( ktx2Loader );
    //loader.setMeshoptDecoder( MeshoptDecoder );
    loader.load( 'spaceship-new.gltf', function ( gltf ) {

        // coffeemat.glb was produced from the source scene using gltfpack:
        // gltfpack -i coffeemat/scene.gltf -o coffeemat.glb -cc -tc
        // The resulting model uses EXT_meshopt_compression (for geometry) and KHR_texture_basisu (for texture compression using ETC1S/BasisLZ)

        //gltf.scene.position.y = 0;
        gltf.scene.position.set( 0, 0, 0 );
        gltf.scene.scale.set( 20, 20, 20 );

        scene.add( gltf.scene );
        window.ship = gltf.scene;
        
        gsap.fromTo(window.ship.position, {y:0}, {y:13, ease:Linear.easeNone, repeat:-1, yoyo: true, duration: 0.2})
        //render();
        animate();

    } );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 40;
    controls.maxDistance = 10000;
    controls.target.set( 10, 90, - 6 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

//

function render() {

    renderer.render( scene, camera );

}

function animate() {

    requestAnimationFrame(animate);
    render();

}

let shipX = 0;
let shipY = 0;
// let shipRot = 0;

let buzz = new Audio('sounds/sci-fi-sound-effect-designed-circuits-sfx-32-202043.mp3')

window.addEventListener("keydown", event => {

    if(event.key == "ArrowLeft") {
        console.log("left");
        shipX -= 150;
    } else if(event.key == "ArrowRight") {
        console.log("right");
        shipX += 150;
    } else if(event.key == "ArrowUp") {
        console.log("up");
        shipY += 150;
    } else if(event.key == "ArrowDown") {
        console.log("down");
        shipY -= 150;
    }

    gsap.to(window.ship.position, 0.5, {
        x: shipY,
        z: shipX,
        ease: Power3.easeInOut
    });
    buzz.pause();
    buzz.volume = 0.3;
    buzz.currentTime = 0;
    buzz.play();
    setTimeout(() => {
        buzz.pause();
    }, 1000);
})