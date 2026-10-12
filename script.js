import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* =================================
   PERSONALIZA TU GALAXIA AQUÍ
================================= */

const nombre = "MI NIÑA HERMOSA";

const frases = [
  "Te amo infinitamente ❤️",
  "Eres mi universo 🌌",
  "Mi niña hermosa 💗",
  "Siempre te elegiría ✨",
  "Mi lugar favorito eres tú",
  "Tú y yo, para siempre 💞",
  "Eres mi sueño más bonito",
  "Mi corazón es tuyo ❤️",
  "Eres mi estrella favorita",
  "Contigo todo es más bonito",
  "Mi amor eterno 💕",
  "Te volvería a elegir mil veces"
];

// Coloca tus fotos en la carpeta fotos/
const fotos = [
  "fotos/foto1.jpg",
  "fotos/foto2.jpg",
  "fotos/foto3.jpg",
  "fotos/foto4.jpg"
];

/* =================================
   ESCENA Y CÁMARA 3D
================================= */

const contenedor = document.getElementById("galaxia");

const escena = new THREE.Scene();
escena.background = new THREE.Color("#03020b");
escena.fog = new THREE.FogExp2("#10051d", 0.0015);

const camara = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  3000
);

camara.position.set(0, 35, 180);

const renderizador = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
});

renderizador.setPixelRatio(Math.min(devicePixelRatio, 2));
renderizador.setSize(innerWidth, innerHeight);
renderizador.outputColorSpace = THREE.SRGBColorSpace;
contenedor.appendChild(renderizador.domElement);

const controles = new OrbitControls(
  camara,
  renderizador.domElement
);

controles.enableDamping = true;
controles.dampingFactor = 0.06;
controles.enablePan = false;
controles.minDistance = 65;
controles.maxDistance = 360;
controles.target.set(0, 0, 0);
controles.autoRotate = true;
controles.autoRotateSpeed = 0.45;

/* =================================
   ILUMINACIÓN
================================= */

escena.add(new THREE.AmbientLight(0xffffff, 1.8));

const luzRosa = new THREE.PointLight(0xff168e, 1400, 260);
luzRosa.position.set(0, 8, 12);
escena.add(luzRosa);

const luzVioleta = new THREE.PointLight(0x7c31ff, 1000, 300);
luzVioleta.position.set(-45, -20, -35);
escena.add(luzVioleta);

/* Grupo principal: toda la galaxia gira */
const galaxia = new THREE.Group();
escena.add(galaxia);

/* =================================
   ESTRELLAS EN ESPIRAL 3D
================================= */

const cantidad = 7000;
const posiciones = [];
const colores = [];
const tamanos = [];

const colorRosa = new THREE.Color("#ff65d4");
const colorAzul = new THREE.Color("#9fbbff");
const colorDorado = new THREE.Color("#ffe1a1");

for (let i = 0; i < cantidad; i++) {
  const radio = 5 + Math.random() * 105;
  const brazo = Math.floor(Math.random() * 4);
  const angulo =
    brazo * Math.PI * 2 / 4 +
    radio * 0.075 +
    (Math.random() - 0.5) * 0.8;

  const x = Math.cos(angulo) * radio;
  const z = Math.sin(angulo) * radio;
  const y = (Math.random() - 0.5) * (12 + radio * 0.12);

  posiciones.push(x, y, z);

  const color =
    Math.random() < 0.65 ? colorRosa :
    Math.random() < 0.75 ? colorDorado : colorAzul;

  colores.push(color.r, color.g, color.b);
  tamanos.push(Math.random());
}

const geometriaEstrellas = new THREE.BufferGeometry();

geometriaEstrellas.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(posiciones, 3)
);

geometriaEstrellas.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(colores, 3)
);

const materialEstrellas = new THREE.PointsMaterial({
  size: 1.15,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const estrellas = new THREE.Points(
  geometriaEstrellas,
  materialEstrellas
);

galaxia.add(estrellas);

/* =================================
   ESTRELLAS DE FONDO
================================= */

const fondoPosiciones = [];

for (let i = 0; i < 1800; i++) {
  fondoPosiciones.push(
    (Math.random() - 0.5) * 1200,
    (Math.random() - 0.5) * 900,
    -100 - Math.random() * 1000
  );
}

const geometriaFondo = new THREE.BufferGeometry();
geometriaFondo.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(fondoPosiciones, 3)
);

const estrellasFondo = new THREE.Points(
  geometriaFondo,
  new THREE.PointsMaterial({
    color: "#e7d9ff",
    size: 1.2,
    transparent: true,
    opacity: 0.8
  })
);

escena.add(estrellasFondo);

/* =================================
   CORAZÓN 3D EN EL CENTRO
================================= */

const forma = new THREE.Shape();

forma.moveTo(0, 3);
forma.bezierCurveTo(-2, 7, -10, 7, -10, 0);
forma.bezierCurveTo(-10, -5, -4, -10, 0, -14);
forma.bezierCurveTo(4, -10, 10, -5, 10, 0);
forma.bezierCurveTo(10, 7, 2, 7, 0, 3);

const geometriaCorazon = new THREE.ExtrudeGeometry(forma, {
  depth: 4,
  bevelEnabled: true,
  bevelSegments: 5,
  steps: 1,
  bevelSize: 1,
  bevelThickness: 1,
  curveSegments: 18
});

geometriaCorazon.computeVertexNormals();

const corazon = new THREE.Mesh(
  geometriaCorazon,
  new THREE.MeshPhysicalMaterial({
    color: "#ff174f",
    emissive: "#b90045",
    emissiveIntensity: 1.7,
    metalness: 0.2,
    roughness: 0.22,
    clearcoat: 1
  })
);

corazon.rotation.x = Math.PI;
corazon.scale.setScalar(1.1);
corazon.position.set(0, 0, 0);
galaxia.add(corazon);

/* Halo luminoso alrededor del corazón */
const halo = new THREE.Mesh(
  new THREE.SphereGeometry(19, 32, 32),
  new THREE.MeshBasicMaterial({
    color: "#ff168e",
    transparent: true,
    opacity: 0.07,
    side: THREE.BackSide
  })
);

galaxia.add(halo);

/* =================================
   TEXTO 3D COMO SPRITES
================================= */

function crearTexto(texto, color = "#ffd0f1", tamano = 42) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");
  ctx.font = `bold ${tamano}px Georgia`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fillStyle = color;
  ctx.fillText(texto, 256, 64, 490);

  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({
    map: textura,
    transparent: true,
    depthWrite: false
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(35, 8.75, 1);
  return sprite;
}

const nombreSprite = crearTexto(nombre, "#ffb2e8", 48);
nombreSprite.position.set(0, 20, 0);
galaxia.add(nombreSprite);

/* Frases en órbita */
const orbitasTexto = [];

frases.forEach((frase, i) => {
  const sprite = crearTexto(
    frase,
    i % 2 === 0 ? "#ffc1ec" : "#d0b0ff",
    30
  );

  const radio = 34 + (i % 4) * 15;
  const angulo = i * Math.PI * 2 / frases.length;

  galaxia.add(sprite);

  orbitasTexto.push({
    sprite,
    radio,
    angulo,
    velocidad: i % 2 === 0 ? 0.16 : -0.12,
    altura: Math.sin(i * 2) * 12
  });
});

/* =================================
   FOTOS FLOTANTES
================================= */

const cargador = new THREE.TextureLoader();
const grupoFotos = new THREE.Group();
galaxia.add(grupoFotos);

fotos.forEach((ruta, i) => {
  cargador.load(
    ruta,
    textura => {
      textura.colorSpace = THREE.SRGBColorSpace;

      const material = new THREE.MeshBasicMaterial({
        map: textura,
        side: THREE.DoubleSide
      });

      const foto = new THREE.Mesh(
        new THREE.PlaneGeometry(13, 13),
        material
      );

      const angulo = i * Math.PI * 2 / fotos.length;
      const radio = 47 + (i % 2) * 13;

      foto.position.set(
        Math.cos(angulo) * radio,
        Math.sin(i * 2) * 16,
        Math.sin(angulo) * radio
      );

      foto.userData = {
        angulo,
        radio,
        altura: foto.position.y,
        velocidad: i % 2 ? -0.18 : 0.18
      };

      grupoFotos.add(foto);
    },
    undefined,
    error => console.warn("No se pudo cargar la foto:", ruta, error)
  );
});

/* =================================
   ANIMACIÓN
================================= */

const reloj = new THREE.Clock();

function animar() {
  requestAnimationFrame(animar);

  const tiempo = reloj.getElapsedTime();

  corazon.scale.setScalar(1.1 + Math.sin(tiempo * 2.4) * 0.07);
  corazon.rotation.y = Math.sin(tiempo * 0.5) * 0.12;

  estrellas.rotation.y += 0.00015;

  orbitasTexto.forEach(item => {
    const a = item.angulo + tiempo * item.velocidad;

    item.sprite.position.set(
      Math.cos(a) * item.radio,
      item.altura + Math.sin(tiempo + item.angulo) * 2,
      Math.sin(a) * item.radio
    );
  });

  grupoFotos.children.forEach(foto => {
    const d = foto.userData;
    const a = d.angulo + tiempo * d.velocidad;

    foto.position.set(
      Math.cos(a) * d.radio,
      d.altura + Math.sin(tiempo * 1.2 + d.angulo) * 2,
      Math.sin(a) * d.radio
    );

    // Las fotografías miran hacia la cámara
    foto.lookAt(camara.position);
  });

  controles.update();
  renderizador.render(escena, camara);
}

animar();

/* =================================
   BOTONES
================================= */

document.getElementById("giro").addEventListener("click", () => {
  controles.autoRotate = !controles.autoRotate;

  document.getElementById("giro").textContent =
    controles.autoRotate ? "Pausar giro" : "Reanudar giro";
});

document.getElementById("reiniciar").addEventListener("click", () => {
  camara.position.set(0, 35, 180);
  controles.target.set(0, 0, 0);
  controles.update();
});

/* Adaptación a cambios de ventana */
addEventListener("resize", () => {
  camara.aspect = innerWidth / innerHeight;
  camara.updateProjectionMatrix();

  renderizador.setSize(innerWidth, innerHeight);
  renderizador.setPixelRatio(Math.min(devicePixelRatio, 2));
});