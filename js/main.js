// Advanced 3D Solar System Explorer - Main Application
import { PhysicsEngine, LagrangePoints } from './physics.js';
import { SpacecraftManager } from './spacecraft.js';
import { CelestialBodyManager } from './celestialBodies.js';
import { GameModeManager } from './gameMode.js';

class AdvancedSolarSystem {
    constructor() {
        // Core Three.js components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.controls = null;
        
        // Advanced systems
        this.physics = new PhysicsEngine();
        this.spacecraftManager = new SpacecraftManager(this.scene, this.physics);
        this.celestialManager = new CelestialBodyManager(this.scene, this.physics);
        this.gameManager = new GameModeManager(this);
        
        // Core objects
        this.planets = [];
        this.moons = [];
        this.asteroids = [];
        this.stars = null;
        this.sun = null;
        
        // Animation and interaction
        this.animationSpeed = 1;
        this.timeScale = 1000000; // Speed up time for visible effects
        this.showOrbits = true;
        this.showLabels = true;
        this.showAsteroids = true;
        this.showTrajectories = true;
        this.enablePhysics = true;
        this.enableRelativity = false;
        
        // Interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedObject = null;
        this.cameraMode = 'free'; // free, follow, cockpit
        this.followTarget = null;
        
        // Performance monitoring
        this.stats = {
            fps: 0,
            frameCount: 0,
            lastTime: 0,
            objects: 0,
            triangles: 0
        };
        
        // Time management
        this.clock = new THREE.Clock();
        this.simulationTime = 0;
        this.realTime = Date.now();
        
        this.init();
        this.createAdvancedStarField();
        this.createAdvancedSun();
        this.createAdvancedPlanets();
        this.createAdvancedAsteroidBelt();
        this.createComets();
        this.createNebulae();
        this.setupAdvancedLighting();
        this.setupPostProcessing();
        this.setupEventListeners();
        this.createAdvancedUI();
        this.animate();
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
        
        console.log('Advanced Solar System initialized with', this.countObjects(), 'objects');
    }
    
    init() {
        // Enhanced renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.autoUpdate = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.physicallyCorrectLights = true;
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Enhanced camera setup
        this.camera.position.set(0, 100, 200);
        this.camera.far = 50000;
        this.camera.updateProjectionMatrix();
        
        // Advanced controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 10000;
        this.controls.minDistance = 1;
        this.controls.enablePan = true;
        this.controls.panSpeed = 2;
        this.controls.rotateSpeed = 1;
        this.controls.zoomSpeed = 1.2;
        
        // Scene setup
        this.scene.fog = new THREE.Fog(0x000000, 1000, 10000);
    }
    
    createAdvancedStarField() {
        // Multiple star layers for depth
        const starLayers = [
            { count: 15000, size: 0.5, distance: 5000, color: 0xffffff },
            { count: 8000, size: 1.0, distance: 8000, color: 0xffffcc },
            { count: 3000, size: 1.5, distance: 12000, color: 0xccccff }
        ];
        
        starLayers.forEach((layer, index) => {
            const starGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(layer.count * 3);
            const colors = new Float32Array(layer.count * 3);
            const sizes = new Float32Array(layer.count);
            
            for (let i = 0; i < layer.count; i++) {
                const i3 = i * 3;
                
                // Spherical distribution
                const radius = layer.distance + Math.random() * 2000;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = radius * Math.cos(phi);
                
                // Color variation
                const color = new THREE.Color(layer.color);
                color.r += (Math.random() - 0.5) * 0.2;
                color.g += (Math.random() - 0.5) * 0.2;
                color.b += (Math.random() - 0.5) * 0.2;
                
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
                
                sizes[i] = layer.size + Math.random() * 0.5;
            }
            
            starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const starMaterial = new THREE.PointsMaterial({
                size: layer.size,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: false
            });
            
            const stars = new THREE.Points(starGeometry, starMaterial);
            this.scene.add(stars);
        });
        
        // Add some bright stars (like Sirius, Vega, etc.)
        this.createBrightStars();
    }
    
    createBrightStars() {
        const brightStars = [
            { name: 'Sirius', position: [2000, 500, 1500], color: 0xaaccff, size: 3 },
            { name: 'Vega', position: [-1800, 800, -1200], color: 0xccccff, size: 2.5 },
            { name: 'Arcturus', position: [1200, -600, 2000], color: 0xffcc88, size: 2.8 },
            { name: 'Rigel', position: [-2200, 300, 800], color: 0xaaaaff, size: 3.2 }
        ];
        
        brightStars.forEach(star => {
            const starGeometry = new THREE.SphereGeometry(star.size, 16, 16);
            const starMaterial = new THREE.MeshBasicMaterial({
                color: star.color,
                transparent: true,
                opacity: 0.8
            });
            
            const starMesh = new THREE.Mesh(starGeometry, starMaterial);
            starMesh.position.set(...star.position);
            
            // Add glow effect
            const glowGeometry = new THREE.SphereGeometry(star.size * 2, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: star.color,
                transparent: true,
                opacity: 0.2
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            starMesh.add(glow);
            
            this.scene.add(starMesh);
        });
    }
    
    createAdvancedSun() {
        const sunGroup = new THREE.Group();
        
        // Main sun body with procedural texture
        const sunGeometry = new THREE.SphereGeometry(8, 64, 64);
        const sunMaterial = new THREE.MeshBasicMaterial({
            map: this.celestialManager.textures.sun,
            emissive: new THREE.Color(0xffaa00),
            emissiveIntensity: 0.8
        });
        
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sunGroup.add(sun);
        
        // Corona layers
        for (let i = 1; i <= 3; i++) {
            const coronaGeometry = new THREE.SphereGeometry(8 + i * 2, 32, 32);
            const coronaMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.1, 1, 0.5 + i * 0.1),
                transparent: true,
                opacity: 0.1 / i,
                side: THREE.BackSide
            });
            const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
            sunGroup.add(corona);
        }
        
        // Solar flares (particle system)
        this.createSolarFlares(sunGroup);
        
        // Solar wind
        this.createSolarWind(sunGroup);
        
        sunGroup.userData = {
            name: 'Sun',
            type: 'star',
            mass: 1.989e30,
            temperature: 5778,
            description: 'The Sun is the star at the center of our Solar System.',
            stats: 'Mass: 1.989 × 10³⁰ kg<br>Temperature: 5,778 K<br>Age: 4.6 billion years<br>Luminosity: 3.828 × 10²⁶ W'
        };
        
        this.scene.add(sunGroup);
        this.sun = sunGroup;
        
        // Add to physics engine
        this.physics.addBody({
            position: new THREE.Vector3(0, 0, 0),
            velocity: new THREE.Vector3(0, 0, 0),
            mass: 1.989e30,
            fixed: true,
            name: 'Sun'
        });
    }
    
    createSolarFlares(sunGroup) {
        const flareCount = 200;
        const flareGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(flareCount * 3);
        const colors = new Float32Array(flareCount * 3);
        const sizes = new Float32Array(flareCount);
        
        for (let i = 0; i < flareCount; i++) {
            const i3 = i * 3;
            const radius = 8 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            const intensity = Math.random();
            colors[i3] = 1.0;
            colors[i3 + 1] = 0.5 + intensity * 0.5;
            colors[i3 + 2] = intensity * 0.3;
            
            sizes[i] = Math.random() * 2 + 0.5;
        }
        
        flareGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        flareGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        flareGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const flareMaterial = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const flares = new THREE.Points(flareGeometry, flareMaterial);
        sunGroup.add(flares);
        sunGroup.userData.flares = flares;
    }
    
    createSolarWind(sunGroup) {
        const windCount = 1000;
        const windGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(windCount * 3);
        const velocities = new Float32Array(windCount * 3);
        
        for (let i = 0; i < windCount; i++) {
            const i3 = i * 3;
            const radius = 10 + Math.random() * 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Radial velocity
            const direction = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]).normalize();
            velocities[i3] = direction.x * (0.5 + Math.random() * 0.5);
            velocities[i3 + 1] = direction.y * (0.5 + Math.random() * 0.5);
            velocities[i3 + 2] = direction.z * (0.5 + Math.random() * 0.5);
        }
        
        windGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        windGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        const windMaterial = new THREE.PointsMaterial({
            color: 0xffaa00,
            size: 0.2,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const wind = new THREE.Points(windGeometry, windMaterial);
        sunGroup.add(wind);
        sunGroup.userData.solarWind = wind;
    }
    
    createAdvancedPlanets() {
        const planetData = [
            {
                name: 'Mercury',
                size: 1.2,
                distance: 25,
                speed: 0.02,
                color: 0x8c7853,
                mass: 3.301e23,
                rotationSpeed: 0.001,
                axialTilt: 0.034,
                eccentricity: 0.205,
                hasAtmosphere: false,
                hasMagneticField: true,
                moons: [],
                description: 'The smallest planet and closest to the Sun with extreme temperature variations.',
                stats: 'Diameter: 4,879 km<br>Day: 59 Earth days<br>Year: 88 Earth days<br>Temperature: -173°C to 427°C'
            },
            {
                name: 'Venus',
                size: 1.8,
                distance: 35,
                speed: 0.015,
                color: 0xffc649,
                mass: 4.867e24,
                rotationSpeed: -0.0004, // Retrograde rotation
                axialTilt: 177.4,
                eccentricity: 0.007,
                hasAtmosphere: true,
                atmosphereColor: 0xffcc00,
                hasMagneticField: false,
                moons: [],
                description: 'The hottest planet with a thick, toxic atmosphere of carbon dioxide.',
                stats: 'Diameter: 12,104 km<br>Day: 243 Earth days<br>Year: 225 Earth days<br>Temperature: 462°C'
            },
            {
                name: 'Earth',
                size: 2.0,
                distance: 45,
                speed: 0.01,
                color: 0x6b93d6,
                mass: 5.972e24,
                rotationSpeed: 0.004,
                axialTilt: 23.4,
                eccentricity: 0.017,
                hasAtmosphere: true,
                atmosphereColor: 0x87ceeb,
                hasMagneticField: true,
                moons: [
                    { name: 'Moon', size: 0.5, distance: 6, speed: 0.05, color: 0xaaaaaa, inclination: 5.1, eccentricity: 0.055 }
                ],
                description: 'Our home planet, the only known planet with life in the universe.',
                stats: 'Diameter: 12,756 km<br>Day: 24 hours<br>Year: 365.25 days<br>Temperature: -89°C to 58°C'
            },
            {
                name: 'Mars',
                size: 1.6,
                distance: 60,
                speed: 0.008,
                color: 0xc1440e,
                mass: 6.39e23,
                rotationSpeed: 0.004,
                axialTilt: 25.2,
                eccentricity: 0.094,
                hasAtmosphere: true,
                atmosphereColor: 0xcd853f,
                hasMagneticField: false,
                moons: [
                    { name: 'Phobos', size: 0.1, distance: 3, speed: 0.2, color: 0x666666, inclination: 1.1, eccentricity: 0.015 },
                    { name: 'Deimos', size: 0.08, distance: 5, speed: 0.1, color: 0x555555, inclination: 1.8, eccentricity: 0.0003 }
                ],
                description: 'The Red Planet with the largest volcano and canyon in the solar system.',
                stats: 'Diameter: 6,792 km<br>Day: 24.6 hours<br>Year: 687 Earth days<br>Temperature: -87°C to -5°C'
            },
            {
                name: 'Jupiter',
                size: 6.0,
                distance: 90,
                speed: 0.005,
                color: 0xd8ca9d,
                mass: 1.898e27,
                rotationSpeed: 0.01,
                axialTilt: 3.1,
                eccentricity: 0.049,
                hasAtmosphere: true,
                atmosphereColor: 0xdaa520,
                hasMagneticField: true,
                hasRings: false,
                moons: [
                    { name: 'Io', size: 0.6, distance: 12, speed: 0.08, color: 0xffff99, inclination: 0.05, eccentricity: 0.004 },
                    { name: 'Europa', size: 0.5, distance: 15, speed: 0.06, color: 0xccccff, inclination: 0.47, eccentricity: 0.009 },
                    { name: 'Ganymede', size: 0.8, distance: 20, speed: 0.04, color: 0x999999, inclination: 0.2, eccentricity: 0.001 },
                    { name: 'Callisto', size: 0.7, distance: 28, speed: 0.03, color: 0x666666, inclination: 0.19, eccentricity: 0.007 }
                ],
                description: 'The largest planet, a gas giant with over 80 moons and a Great Red Spot.',
                stats: 'Diameter: 142,984 km<br>Day: 9.9 hours<br>Year: 12 Earth years<br>Temperature: -108°C'
            },
            {
                name: 'Saturn',
                size: 5.2,
                distance: 120,
                speed: 0.004,
                color: 0xfad5a5,
                mass: 5.683e26,
                rotationSpeed: 0.009,
                axialTilt: 26.7,
                eccentricity: 0.057,
                hasAtmosphere: true,
                atmosphereColor: 0xf4a460,
                hasMagneticField: true,
                hasRings: true,
                rings: [
                    { inner: 6.5, outer: 12, opacity: 0.8 },
                    { inner: 12.5, outer: 15, opacity: 0.6 },
                    { inner: 15.5, outer: 18, opacity: 0.4 }
                ],
                moons: [
                    { name: 'Titan', size: 0.8, distance: 25, speed: 0.02, color: 0xcc9966, inclination: 0.35, eccentricity: 0.029 },
                    { name: 'Enceladus', size: 0.3, distance: 18, speed: 0.04, color: 0xffffff, inclination: 0.02, eccentricity: 0.005 }
                ],
                description: 'Famous for its prominent ring system and moon Titan with lakes of methane.',
                stats: 'Diameter: 120,536 km<br>Day: 10.7 hours<br>Year: 29 Earth years<br>Temperature: -139°C'
            },
            {
                name: 'Uranus',
                size: 3.2,
                distance: 150,
                speed: 0.003,
                color: 0x4fd0e7,
                mass: 8.681e25,
                rotationSpeed: -0.003, // Retrograde rotation
                axialTilt: 97.8, // Extreme tilt
                eccentricity: 0.046,
                hasAtmosphere: true,
                atmosphereColor: 0x40e0d0,
                hasMagneticField: true,
                hasRings: true,
                rings: [
                    { inner: 4, outer: 6, opacity: 0.3 }
                ],
                moons: [
                    { name: 'Miranda', size: 0.2, distance: 8, speed: 0.06, color: 0xaaaaaa, inclination: 4.2, eccentricity: 0.001 },
                    { name: 'Ariel', size: 0.3, distance: 12, speed: 0.04, color: 0xbbbbbb, inclination: 0.3, eccentricity: 0.001 }
                ],
                description: 'An ice giant that rotates on its side, possibly due to an ancient collision.',
                stats: 'Diameter: 51,118 km<br>Day: 17.2 hours<br>Year: 84 Earth years<br>Temperature: -197°C'
            },
            {
                name: 'Neptune',
                size: 3.1,
                distance: 180,
                speed: 0.002,
                color: 0x4b70dd,
                mass: 1.024e26,
                rotationSpeed: 0.004,
                axialTilt: 28.3,
                eccentricity: 0.011,
                hasAtmosphere: true,
                atmosphereColor: 0x4169e1,
                hasMagneticField: true,
                hasRings: true,
                rings: [
                    { inner: 4, outer: 5.5, opacity: 0.2 }
                ],
                moons: [
                    { name: 'Triton', size: 0.6, distance: 15, speed: -0.03, color: 0xcccccc, inclination: 157, eccentricity: 0.000 }
                ],
                description: 'The windiest planet with speeds up to 2,100 km/h and a retrograde moon Triton.',
                stats: 'Diameter: 49,528 km<br>Day: 16.1 hours<br>Year: 165 Earth years<br>Temperature: -201°C'
            }
        ];
        
        planetData.forEach((data, index) => {
            const planetGroup = this.celestialManager.createAdvancedPlanet(data);
            planetGroup.position.x = data.distance;
            
            // Enhanced planet data
            planetGroup.userData = {
                ...data,
                angle: Math.random() * Math.PI * 2,
                rotationAngle: 0,
                orbitHistory: [],
                lagrangePoints: this.calculateLagrangePoints(data)
            };
            
            // Create orbit visualization
            const orbitGeometry = new THREE.RingGeometry(data.distance - 0.2, data.distance + 0.2, 128);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(index * 0.1, 0.5, 0.5),
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            orbit.rotation.z = data.axialTilt * Math.PI / 180;
            
            // Create planet label
            const labelDiv = this.createPlanetLabel(data.name);
            
            // Create moon system
            const moons = this.celestialManager.createMoonSystem(planetGroup, data.moons);
            
            this.scene.add(planetGroup);
            this.scene.add(orbit);
            
            this.planets.push({
                mesh: planetGroup,
                orbit: orbit,
                label: labelDiv,
                moons: moons,
                data: planetGroup.userData
            });
            
            // Add to physics engine
            this.physics.addBody({
                position: planetGroup.position.clone(),
                velocity: new THREE.Vector3(0, 0, Math.sqrt(1000 / data.distance)), // Circular orbit velocity
                mass: data.mass,
                fixed: false,
                name: data.name
            });
        });
    }
    
    calculateLagrangePoints(planetData) {
        const sunMass = 1.989e30;
        const L1 = LagrangePoints.calculateL1(sunMass, planetData.mass, planetData.distance);
        const L2 = LagrangePoints.calculateL2(sunMass, planetData.mass, planetData.distance);
        const L4L5 = LagrangePoints.calculateL4L5(sunMass, planetData.mass, planetData.distance);
        
        return { L1, L2, L4: L4L5.L4, L5: L4L5.L5 };
    }
    
    createPlanetLabel(name) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'planet-label';
        labelDiv.textContent = name;
        labelDiv.style.cssText = `
            position: absolute;
            color: white;
            font-size: 14px;
            font-weight: bold;
            pointer-events: none;
            background: rgba(0,0,0,0.7);
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(5px);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        `;
        document.body.appendChild(labelDiv);
        return labelDiv;
    }
    
    createAdvancedAsteroidBelt() {
        const asteroidCount = 2000;
        const asteroidTypes = ['rocky', 'metallic', 'carbonaceous'];
        
        for (let i = 0; i < asteroidCount; i++) {
            const type = asteroidTypes[Math.floor(Math.random() * asteroidTypes.length)];
            const size = 0.05 + Math.random() * 0.3;
            const distance = 70 + Math.random() * 20; // Between Mars and Jupiter
            const angle = Math.random() * Math.PI * 2;
            const inclination = (Math.random() - 0.5) * 0.2; // Small inclination
            
            const asteroidGeometry = new THREE.DodecahedronGeometry(size, 0);
            const asteroidMaterial = new THREE.MeshLambertMaterial({
                color: this.getAsteroidColor(type),
                map: this.celestialManager.textures.asteroid
            });
            
            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            asteroid.position.x = Math.cos(angle) * distance;
            asteroid.position.z = Math.sin(angle) * distance;
            asteroid.position.y = Math.sin(inclination) * distance * 0.1;
            
            asteroid.castShadow = true;
            asteroid.receiveShadow = true;
            
            asteroid.userData = {
                name: `Asteroid-${i}`,
                type: type,
                distance: distance,
                angle: angle,
                speed: 0.006 + Math.random() * 0.002,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                composition: this.getAsteroidComposition(type)
            };
            
            this.scene.add(asteroid);
            this.asteroids.push(asteroid);
        }
        
        // Add some named asteroids
        this.createNamedAsteroids();
    }
    
    getAsteroidColor(type) {
        const colors = {
            rocky: 0x8b7355,
            metallic: 0x708090,
            carbonaceous: 0x2f2f2f
        };
        return colors[type] || 0x666666;
    }
    
    getAsteroidComposition(type) {
        const compositions = {
            rocky: 'Silicate minerals, olivine, pyroxene',
            metallic: 'Iron, nickel, platinum group metals',
            carbonaceous: 'Carbon compounds, water ice, organic materials'
        };
        return compositions[type] || 'Unknown composition';
    }
    
    createNamedAsteroids() {
        const namedAsteroids = [
            { name: 'Ceres', size: 1.5, distance: 75, angle: 0, type: 'dwarf planet' },
            { name: 'Vesta', size: 0.8, distance: 78, angle: 1.2, type: 'rocky' },
            { name: 'Pallas', size: 0.7, distance: 82, angle: 2.4, type: 'rocky' },
            { name: 'Hygiea', size: 0.6, distance: 85, angle: 3.6, type: 'carbonaceous' }
        ];
        
        namedAsteroids.forEach(data => {
            const geometry = new THREE.SphereGeometry(data.size, 16, 16);
            const material = new THREE.MeshLambertMaterial({
                color: this.getAsteroidColor(data.type),
                map: this.celestialManager.textures.asteroid
            });
            
            const asteroid = new THREE.Mesh(geometry, material);
            asteroid.position.x = Math.cos(data.angle) * data.distance;
            asteroid.position.z = Math.sin(data.angle) * data.distance;
            
            asteroid.userData = {
                name: data.name,
                type: data.type,
                distance: data.distance,
                angle: data.angle,
                speed: 0.005,
                isNamed: true
            };
            
            this.scene.add(asteroid);
            this.asteroids.push(asteroid);
        });
    }
    
    createComets() {
        const cometData = [
            { name: "Halley's Comet", position: new THREE.Vector3(200, 20, 100), velocity: new THREE.Vector3(-0.5, 0, -0.3) },
            { name: "Hale-Bopp", position: new THREE.Vector3(-150, -30, 200), velocity: new THREE.Vector3(0.3, 0.1, -0.4) },
            { name: "Encke", position: new THREE.Vector3(80, 10, -120), velocity: new THREE.Vector3(-0.2, 0, 0.6) }
        ];
        
        cometData.forEach(data => {
            this.celestialManager.createComet(data.name, data.position, data.velocity);
        });
    }
    
    createNebulae() {
        // Add some distant nebulae for visual appeal
        this.celestialManager.createNebula('emission', new THREE.Vector3(3000, 500, 2000), 800);
        this.celestialManager.createNebula('reflection', new THREE.Vector3(-2500, -800, 1500), 600);
        this.celestialManager.createNebula('planetary', new THREE.Vector3(1800, 1200, -2800), 400);
    }
    
    setupAdvancedLighting() {
        // Remove default lighting
        this.scene.children = this.scene.children.filter(child => !(child instanceof THREE.Light));
        
        // Ambient light (starlight)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
        this.scene.add(ambientLight);
        
        // Sun light (point light)
        const sunLight = new THREE.PointLight(0xffffff, 3, 2000);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.near = 1;
        sunLight.shadow.camera.far = 1000;
        this.scene.add(sunLight);
        
        // Directional light for better planet illumination
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 0, 0);
        directionalLight.target.position.set(100, 0, 0);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        this.scene.add(directionalLight.target);
        
        // Add some colored lights for atmosphere
        const coloredLights = [
            { color: 0xff4444, position: [500, 200, 300], intensity: 0.5 },
            { color: 0x4444ff, position: [-400, -150, 500], intensity: 0.5 },
            { color: 0x44ff44, position: [200, 400, -600], intensity: 0.5 }
        ];
        
        coloredLights.forEach(light => {
            const pointLight = new THREE.PointLight(light.color, light.intensity, 1000);
            pointLight.position.set(...light.position);
            this.scene.add(pointLight);
        });
    }
    
    setupPostProcessing() {
        // This would typically use EffectComposer for post-processing effects
        // For now, we'll use basic renderer settings
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    createAdvancedUI() {
        // Performance monitor
        this.createPerformanceMonitor();
        
        // Time control
        this.createTimeControl();
        
        // Camera modes
        this.createCameraModes();
        
        // Object inspector
        this.createObjectInspector();
        
        // Mini-map
        this.createMiniMap();
    }
    
    createPerformanceMonitor() {
        const perfMonitor = document.createElement('div');
        perfMonitor.id = 'performance-monitor';
        perfMonitor.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 200;
        `;
        document.body.appendChild(perfMonitor);
    }
    
    createTimeControl() {
        const timeControl = document.createElement('div');
        timeControl.id = 'time-control';
        timeControl.innerHTML = `
            <h4>⏰ Time Control</h4>
            <div>
                <label>Speed: </label>
                <input type="range" id="time-speed" min="0" max="10" step="0.1" value="1">
                <span id="time-speed-value">1x</span>
            </div>
            <div>
                <label>Scale: </label>
                <select id="time-scale">
                    <option value="1000000">Real Time (1M:1)</option>
                    <option value="100000">10x Faster</option>
                    <option value="10000">100x Faster</option>
                    <option value="1000">1000x Faster</option>
                </select>
            </div>
            <div>
                <button id="pause-time">⏸️ Pause</button>
                <button id="reset-time">🔄 Reset</button>
            </div>
        `;
        
        timeControl.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            z-index: 150;
        `;
        
        document.body.appendChild(timeControl);
    }
    
    createCameraModes() {
        const cameraModes = document.createElement('div');
        cameraModes.id = 'camera-modes';
        cameraModes.innerHTML = `
            <h4>📷 Camera Modes</h4>
            <button class="camera-btn active" data-mode="free">🎮 Free</button>
            <button class="camera-btn" data-mode="follow">👁️ Follow</button>
            <button class="camera-btn" data-mode="cockpit">🚀 Cockpit</button>
            <button class="camera-btn" data-mode="orbit">🌍 Orbit</button>
        `;
        
        cameraModes.style.cssText = `
            position: absolute;
            top: 200px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            z-index: 150;
        `;
        
        document.body.appendChild(cameraModes);
    }
    
    createObjectInspector() {
        const inspector = document.createElement('div');
        inspector.id = 'object-inspector';
        inspector.innerHTML = `
            <h4>🔍 Object Inspector</h4>
            <div id="inspector-content">
                <p>Click on an object to inspect it</p>
            </div>
        `;
        
        inspector.style.cssText = `
            position: absolute;
            bottom: 200px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            z-index: 150;
            max-width: 300px;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        document.body.appendChild(inspector);
    }
    
    createMiniMap() {
        const miniMap = document.createElement('canvas');
        miniMap.id = 'mini-map';
        miniMap.width = 200;
        miniMap.height = 200;
        miniMap.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.8);
            z-index: 150;
        `;
        
        document.body.appendChild(miniMap);
        this.miniMapCanvas = miniMap;
        this.miniMapCtx = miniMap.getContext('2d');
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Mouse interaction
        this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
        this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        
        // Keyboard controls
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
        
        // UI event listeners
        this.setupUIEventListeners();
    }
    
    setupUIEventListeners() {
        // Speed control
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.animationSpeed = parseFloat(e.target.value);
                speedValue.textContent = this.animationSpeed + 'x';
            });
        }
        
        // Time control
        const timeSpeed = document.getElementById('time-speed');
        const timeSpeedValue = document.getElementById('time-speed-value');
        if (timeSpeed) {
            timeSpeed.addEventListener('input', (e) => {
                this.animationSpeed = parseFloat(e.target.value);
                timeSpeedValue.textContent = this.animationSpeed + 'x';
            });
        }
        
        const timeScale = document.getElementById('time-scale');
        if (timeScale) {
            timeScale.addEventListener('change', (e) => {
                this.timeScale = parseInt(e.target.value);
            });
        }
        
        // Camera modes
        document.querySelectorAll('.camera-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.camera-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.setCameraMode(e.target.dataset.mode);
            });
        });
        
        // Toggle buttons
        const toggleButtons = [
            { id: 'toggle-orbits', property: 'showOrbits' },
            { id: 'toggle-labels', property: 'showLabels' },
            { id: 'toggle-asteroids', property: 'showAsteroids' },
            { id: 'toggle-trajectories', property: 'showTrajectories' }
        ];
        
        toggleButtons.forEach(({ id, property }) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    this[property] = !this[property];
                    this.updateVisibility();
                });
            }
        });
        
        // Reset camera
        const resetButton = document.getElementById('reset-camera');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetCamera();
            });
        }
    }
    
    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const allObjects = [
            this.sun,
            ...this.planets.map(p => p.mesh),
            ...this.asteroids,
            ...this.celestialManager.comets.map(c => c.mesh)
        ].filter(obj => obj);
        
        const intersects = this.raycaster.intersectObjects(allObjects, true);
        
        if (intersects.length > 0) {
            const selectedObject = this.findRootObject(intersects[0].object);
            this.selectObject(selectedObject);
        } else {
            this.deselectObject();
        }
    }
    
    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    onKeyDown(event) {
        switch(event.code) {
            case 'Space':
                event.preventDefault();
                this.animationSpeed = this.animationSpeed > 0 ? 0 : 1;
                break;
            case 'KeyR':
                this.resetCamera();
                break;
            case 'KeyF':
                if (this.selectedObject) {
                    this.focusOnObject(this.selectedObject);
                }
                break;
            case 'KeyP':
                this.enablePhysics = !this.enablePhysics;
                break;
            case 'Digit1':
                this.setCameraMode('free');
                break;
            case 'Digit2':
                this.setCameraMode('follow');
                break;
            case 'Digit3':
                this.setCameraMode('cockpit');
                break;
        }
    }
    
    findRootObject(object) {
        let current = object;
        while (current.parent && current.parent !== this.scene) {
            current = current.parent;
        }
        return current;
    }
    
    selectObject(object) {
        this.deselectObject();
        this.selectedObject = object;
        
        // Add selection indicator
        const geometry = new THREE.SphereGeometry(object.userData.size * 1.2 || 2, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        
        this.selectionIndicator = new THREE.Mesh(geometry, material);
        object.add(this.selectionIndicator);
        
        // Update inspector
        this.updateObjectInspector(object);
        
        // Trigger achievement
        if (object.userData.type === 'planet') {
            this.gameManager.modes.exploration.visitPlanet(object.userData.name);
        }
    }
    
    deselectObject() {
        if (this.selectedObject && this.selectionIndicator) {
            this.selectedObject.remove(this.selectionIndicator);
            this.selectionIndicator = null;
            this.selectedObject = null;
        }
    }
    
    updateObjectInspector(object) {
        const inspector = document.getElementById('inspector-content');
        if (!inspector || !object.userData) return;
        
        const data = object.userData;
        inspector.innerHTML = `
            <h5>${data.name || 'Unknown Object'}</h5>
            <p><strong>Type:</strong> ${data.type || 'Unknown'}</p>
            ${data.mass ? `<p><strong>Mass:</strong> ${data.mass.toExponential(2)} kg</p>` : ''}
            ${data.distance ? `<p><strong>Distance:</strong> ${data.distance.toFixed(1)} AU</p>` : ''}
            ${data.temperature ? `<p><strong>Temperature:</strong> ${data.temperature}°C</p>` : ''}
            ${data.composition ? `<p><strong>Composition:</strong> ${data.composition}</p>` : ''}
            ${data.description ? `<p><strong>Description:</strong> ${data.description}</p>` : ''}
            ${data.stats ? `<div><strong>Statistics:</strong><br>${data.stats}</div>` : ''}
        `;
    }
    
    setCameraMode(mode) {
        this.cameraMode = mode;
        
        switch(mode) {
            case 'free':
                this.controls.enabled = true;
                this.followTarget = null;
                break;
            case 'follow':
                if (this.selectedObject) {
                    this.followTarget = this.selectedObject;
                    this.controls.enabled = false;
                }
                break;
            case 'cockpit':
                if (this.spacecraftManager.activeSpacecraft) {
                    this.followTarget = this.spacecraftManager.activeSpacecraft.mesh;
                    this.controls.enabled = false;
                }
                break;
            case 'orbit':
                if (this.selectedObject) {
                    this.controls.target.copy(this.selectedObject.position);
                    this.controls.enabled = true;
                }
                break;
        }
    }
    
    focusOnObject(object) {
        const distance = (object.userData.size || 2) * 5;
        const direction = new THREE.Vector3(1, 1, 1).normalize();
        const targetPosition = object.position.clone().add(direction.multiplyScalar(distance));
        
        // Animate camera to target
        this.animateCamera(targetPosition, object.position);
    }
    
    animateCamera(targetPosition, lookAt) {
        const startPosition = this.camera.position.clone();
        const startLookAt = this.controls.target.clone();
        
        let progress = 0;
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.camera.position.lerpVectors(startPosition, targetPosition, eased);
            this.controls.target.lerpVectors(startLookAt, lookAt, eased);
            this.controls.update();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    resetCamera() {
        this.camera.position.set(0, 100, 200);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.setCameraMode('free');
    }
    
    updateVisibility() {
        // Update orbit visibility
        this.planets.forEach(planet => {
            planet.orbit.visible = this.showOrbits;
        });
        
        // Update label visibility
        this.planets.forEach(planet => {
            planet.label.style.display = this.showLabels ? 'block' : 'none';
        });
        
        // Update asteroid visibility
        this.asteroids.forEach(asteroid => {
            asteroid.visible = this.showAsteroids;
        });
        
        // Update trajectory visibility
        this.spacecraftManager.trajectories.forEach(trajectory => {
            trajectory.visible = this.showTrajectories;
        });
    }
    
    updatePerformanceMonitor() {
        const perfMonitor = document.getElementById('performance-monitor');
        if (!perfMonitor) return;
        
        const now = performance.now();
        this.stats.frameCount++;
        
        if (now - this.stats.lastTime >= 1000) {
            this.stats.fps = Math.round((this.stats.frameCount * 1000) / (now - this.stats.lastTime));
            this.stats.frameCount = 0;
            this.stats.lastTime = now;
            
            this.stats.objects = this.countObjects();
            this.stats.triangles = this.countTriangles();
            
            perfMonitor.innerHTML = `
                FPS: ${this.stats.fps}<br>
                Objects: ${this.stats.objects}<br>
                Triangles: ${this.stats.triangles}<br>
                Memory: ${(performance.memory?.usedJSHeapSize / 1048576).toFixed(1) || 'N/A'} MB<br>
                Time Scale: ${this.timeScale}:1<br>
                Sim Speed: ${this.animationSpeed}x
            `;
        }
    }
    
    countObjects() {
        let count = 0;
        this.scene.traverse(() => count++);
        return count;
    }
    
    countTriangles() {
        let triangles = 0;
        this.scene.traverse((object) => {
            if (object.geometry) {
                if (object.geometry.index) {
                    triangles += object.geometry.index.count / 3;
                } else if (object.geometry.attributes.position) {
                    triangles += object.geometry.attributes.position.count / 3;
                }
            }
        });
        return Math.round(triangles);
    }
    
    updateMiniMap() {
        if (!this.miniMapCtx) return;
        
        const ctx = this.miniMapCtx;
        const canvas = this.miniMapCanvas;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const scale = 0.5;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw sun
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw planets
        this.planets.forEach(planet => {
            const x = centerX + planet.mesh.position.x * scale;
            const y = centerY + planet.mesh.position.z * scale;
            
            ctx.fillStyle = `#${planet.data.color.toString(16).padStart(6, '0')}`;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw orbit
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(centerX, centerY, planet.data.distance * scale, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        // Draw camera position
        const camX = centerX + this.camera.position.x * scale * 0.1;
        const camY = centerY + this.camera.position.z * scale * 0.1;
        
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(camX, camY, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        const time = this.clock.getElapsedTime();
        
        // Update simulation time
        this.simulationTime += deltaTime * this.animationSpeed * this.timeScale;
        
        // Update physics
        if (this.enablePhysics) {
            this.physics.update(deltaTime * this.animationSpeed);
        }
        
        // Update sun
        if (this.sun) {
            this.sun.rotation.y += 0.005 * this.animationSpeed;
            
            // Animate solar flares
            if (this.sun.userData.flares) {
                const positions = this.sun.userData.flares.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] += (Math.random() - 0.5) * 0.1;
                    positions[i + 1] += (Math.random() - 0.5) * 0.1;
                    positions[i + 2] += (Math.random() - 0.5) * 0.1;
                }
                this.sun.userData.flares.geometry.attributes.position.needsUpdate = true;
            }
            
            // Animate solar wind
            if (this.sun.userData.solarWind) {
                const positions = this.sun.userData.solarWind.geometry.attributes.position.array;
                const velocities = this.sun.userData.solarWind.geometry.attributes.velocity.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] += velocities[i] * deltaTime * this.animationSpeed;
                    positions[i + 1] += velocities[i + 1] * deltaTime * this.animationSpeed;
                    positions[i + 2] += velocities[i + 2] * deltaTime * this.animationSpeed;
                    
                    // Reset particles that are too far
                    const distance = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2);
                    if (distance > 500) {
                        const radius = 10 + Math.random() * 5;
                        const theta = Math.random() * Math.PI * 2;
                        const phi = Math.random() * Math.PI;
                        
                        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
                        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
                        positions[i + 2] = radius * Math.cos(phi);
                    }
                }
                this.sun.userData.solarWind.geometry.attributes.position.needsUpdate = true;
            }
        }
        
        // Update planets
        this.planets.forEach(planet => {
            const data = planet.data;
            
            if (!this.enablePhysics) {
                // Simple orbital motion
                data.angle += data.speed * this.animationSpeed;
                planet.mesh.position.x = Math.cos(data.angle) * data.distance;
                planet.mesh.position.z = Math.sin(data.angle) * data.distance;
            }
            
            // Planet rotation
            data.rotationAngle += data.rotationSpeed * this.animationSpeed;
            planet.mesh.rotation.y = data.rotationAngle;
            
            // Update clouds
            if (data.clouds) {
                data.clouds.rotation.y += data.rotationSpeed * 0.5 * this.animationSpeed;
            }
            
            // Update magnetic field
            if (planet.mesh.userData.magneticField) {
                planet.mesh.userData.magneticField.forEach(line => {
                    line.rotation.y += 0.01 * this.animationSpeed;
                });
            }
            
            // Update moons
            planet.moons.forEach(moon => {
                const moonData = moon.mesh.userData;
                moonData.angle += moonData.speed * this.animationSpeed;
                
                moon.mesh.position.x = Math.cos(moonData.angle) * moonData.distance;
                moon.mesh.position.z = Math.sin(moonData.angle) * moonData.distance;
                moon.mesh.position.y = Math.sin(moonData.angle + moonData.inclination) * moonData.distance * 0.1;
                
                moon.mesh.rotation.y += 0.02 * this.animationSpeed;
            });
        });
        
        // Update asteroids
        this.asteroids.forEach(asteroid => {
            const data = asteroid.userData;
            data.angle += data.speed * this.animationSpeed;
            
            asteroid.position.x = Math.cos(data.angle) * data.distance;
            asteroid.position.z = Math.sin(data.angle) * data.distance;
            
            // Rotation
            asteroid.rotation.x += data.rotationSpeed.x * this.animationSpeed;
            asteroid.rotation.y += data.rotationSpeed.y * this.animationSpeed;
            asteroid.rotation.z += data.rotationSpeed.z * this.animationSpeed;
        });
        
        // Update celestial bodies
        this.celestialManager.updateCelestialBodies(deltaTime * this.animationSpeed, time);
        
        // Update spacecraft
        this.spacecraftManager.updateSpacecraft(deltaTime * this.animationSpeed);
        
        // Update game modes
        this.gameManager.update(deltaTime);
        
        // Update camera
        this.updateCamera();
        
        // Update UI
        this.updatePlanetLabels();
        this.updatePerformanceMonitor();
        this.updateMiniMap();
        
        // Update controls
        this.controls.update();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    updateCamera() {
        if (this.followTarget && this.cameraMode !== 'free') {
            const offset = new THREE.Vector3(0, 20, 50);
            
            switch(this.cameraMode) {
                case 'follow':
                    this.camera.position.copy(this.followTarget.position).add(offset);
                    this.camera.lookAt(this.followTarget.position);
                    break;
                case 'cockpit':
                    this.camera.position.copy(this.followTarget.position).add(new THREE.Vector3(0, 2, 0));
                    this.camera.lookAt(this.followTarget.position.clone().add(new THREE.Vector3(0, 0, -10)));
                    break;
            }
        }
    }
    
    updatePlanetLabels() {
        this.planets.forEach(planet => {
            if (!this.showLabels) {
                planet.label.style.display = 'none';
                return;
            }
            
            const vector = new THREE.Vector3();
            planet.mesh.getWorldPosition(vector);
            vector.project(this.camera);
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
            
            planet.label.style.left = x + 'px';
            planet.label.style.top = (y - 30) + 'px';
            planet.label.style.display = 'block';
            
            // Fade based on distance
            const distance = this.camera.position.distanceTo(planet.mesh.position);
            const opacity = Math.max(0.3, Math.min(1, 100 / distance));
            planet.label.style.opacity = opacity;
        });
    }
}

// Initialize the advanced solar system when the page loads
window.addEventListener('load', () => {
    new AdvancedSolarSystem();
});