// Import des dépendances et des fichiers CSS
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Récupération de l'élément canvas de la page HTML
const canvas = document.querySelector('canvas.webgl');

// Vérification de l'existence de l'élément canvas
if (canvas) {
    // Création de la scène
    const scene = new THREE.Scene();

    // Paramètres
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    // Caméra
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 5;
    camera.position.x = 5;
    scene.add(camera);

    // Contrôles
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Rendu
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setClearColor('#181c36'); // Fond blanc
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Lumière ambiante
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Lumière directionnelle
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Déclaration du mixer à l'extérieur de la fonction de chargement du modèle GLTF
    let mixer;

    // Chargement du modèle GLTF
    const loader = new GLTFLoader();
    loader.load(
        './scene1.glb',
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);

            // Obtention des animations du modèle
            const animations = gltf.animations;

            // Création du mixer pour gérer les animations
            mixer = new THREE.AnimationMixer(model);

            // Ajout de toutes les animations au mixer
            if (animations && animations.length) {
                animations.forEach((animation) => {
                    mixer.clipAction(animation).play();
                });
            }
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );

    // Redimensionnement de la scène lorsque la fenêtre est redimensionnée
    function onWindowResize() {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
    }
    window.addEventListener('resize', onWindowResize);

    // Animation de la scène
    function tick() {
        controls.update(); // Mise à jour des contrôles
        renderer.render(scene, camera); // Rendu de la scène
        requestAnimationFrame(tick); // Appel récursif pour l'animation

        // Mise à jour du mixer à chaque trame
        if (mixer) {
            mixer.update();
        }
    }
    tick(); // Lancement de l'animation
} else {
    console.error('Canvas element not found.');
}
