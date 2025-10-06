// 3D Solar System Explorer
class SolarSystem {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.planets = [];
        this.asteroids = [];
        this.animationSpeed = 1;
        this.showOrbits = true;
        this.showLabels = true;
        this.showAsteroids = true;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.init();
        this.createStarField();
        this.createSun();
        this.createPlanets();
        this.createAsteroidBelt();
        this.setupEventListeners();
        this.animate();
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
    }
    
    init() {
        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Camera position
        this.camera.position.set(0, 50, 100);
        
        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 500;
        this.controls.minDistance = 5;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);
    }
    
    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 10000;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2000;
            positions[i + 1] = (Math.random() - 0.5) * 2000;
            positions[i + 2] = (Math.random() - 0.5) * 2000;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }
    
    createSun() {
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.5
        });
        
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.userData = {
            name: 'Sun',
            description: 'The Sun is the star at the center of our Solar System.',
            stats: 'Mass: 1.989 × 10³⁰ kg<br>Temperature: 5,778 K<br>Age: 4.6 billion years'
        };
        this.scene.add(sun);
        
        // Sun glow effect
        const glowGeometry = new THREE.SphereGeometry(7, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(glow);
        
        this.sun = sun;
        this.sunGlow = glow;
    }
    
    createPlanets() {
        const planetData = [
            { name: 'Mercury', size: 0.8, distance: 15, speed: 0.02, color: 0x8c7853, description: 'The smallest planet and closest to the Sun.', stats: 'Diameter: 4,879 km<br>Day: 59 Earth days<br>Year: 88 Earth days' },
            { name: 'Venus', size: 1.2, distance: 20, speed: 0.015, color: 0xffc649, description: 'The hottest planet with a thick, toxic atmosphere.', stats: 'Diameter: 12,104 km<br>Day: 243 Earth days<br>Year: 225 Earth days' },
            { name: 'Earth', size: 1.3, distance: 25, speed: 0.01, color: 0x6b93d6, description: 'Our home planet, the only known planet with life.', stats: 'Diameter: 12,756 km<br>Day: 24 hours<br>Year: 365.25 days' },
            { name: 'Mars', size: 1.0, distance: 30, speed: 0.008, color: 0xc1440e, description: 'The Red Planet, with the largest volcano in the solar system.', stats: 'Diameter: 6,792 km<br>Day: 24.6 hours<br>Year: 687 Earth days' },
            { name: 'Jupiter', size: 3.5, distance: 45, speed: 0.005, color: 0xd8ca9d, description: 'The largest planet, a gas giant with over 80 moons.', stats: 'Diameter: 142,984 km<br>Day: 9.9 hours<br>Year: 12 Earth years' },
            { name: 'Saturn', size: 3.0, distance: 60, speed: 0.004, color: 0xfad5a5, description: 'Famous for its prominent ring system.', stats: 'Diameter: 120,536 km<br>Day: 10.7 hours<br>Year: 29 Earth years' },
            { name: 'Uranus', size: 2.0, distance: 75, speed: 0.003, color: 0x4fd0e7, description: 'An ice giant that rotates on its side.', stats: 'Diameter: 51,118 km<br>Day: 17.2 hours<br>Year: 84 Earth years' },
            { name: 'Neptune', size: 1.9, distance: 90, speed: 0.002, color: 0x4b70dd, description: 'The windiest planet with speeds up to 2,100 km/h.', stats: 'Diameter: 49,528 km<br>Day: 16.1 hours<br>Year: 165 Earth years' }
        ];
        
        planetData.forEach((data, index) => {
            // Create planet
            const geometry = new THREE.SphereGeometry(data.size, 32, 32);
            const material = new THREE.MeshLambertMaterial({ color: data.color });
            const planet = new THREE.Mesh(geometry, material);
            
            planet.position.x = data.distance;
            planet.castShadow = true;
            planet.receiveShadow = true;
            
            planet.userData = {
                name: data.name,
                description: data.description,
                stats: data.stats,
                distance: data.distance,
                speed: data.speed,
                angle: Math.random() * Math.PI * 2
            };
            
            // Create orbit line
            const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x444444,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            
            // Create planet label
            const labelDiv = document.createElement('div');
            labelDiv.className = 'planet-label';
            labelDiv.textContent = data.name;
            labelDiv.style.position = 'absolute';
            labelDiv.style.color = 'white';
            labelDiv.style.fontSize = '12px';
            labelDiv.style.pointerEvents = 'none';
            labelDiv.style.background = 'rgba(0,0,0,0.5)';
            labelDiv.style.padding = '2px 6px';
            labelDiv.style.borderRadius = '3px';
            document.body.appendChild(labelDiv);
            
            // Special features for specific planets
            if (data.name === 'Earth') {
                // Add moon
                const moonGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                const moonMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
                const moon = new THREE.Mesh(moonGeometry, moonMaterial);
                moon.position.set(3, 0, 0);
                planet.add(moon);
                planet.userData.moon = moon;
            }
            
            if (data.name === 'Saturn') {
                // Add rings
                const ringGeometry = new THREE.RingGeometry(data.size + 0.5, data.size + 1.5, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xaaaaaa,
                    transparent: true,
                    opacity: 0.6,
                    side: THREE.DoubleSide
                });
                const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                rings.rotation.x = Math.PI / 2;
                planet.add(rings);
            }
            
            this.scene.add(planet);
            this.scene.add(orbit);
            
            this.planets.push({
                mesh: planet,
                orbit: orbit,
                label: labelDiv,
                data: planet.userData
            });
        });
    }
    
    createAsteroidBelt() {
        const asteroidCount = 500;
        const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const asteroidMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        
        for (let i = 0; i < asteroidCount; i++) {
            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            const distance = 35 + Math.random() * 10; // Between Mars and Jupiter
            const angle = Math.random() * Math.PI * 2;
            
            asteroid.position.x = Math.cos(angle) * distance;
            asteroid.position.z = Math.sin(angle) * distance;
            asteroid.position.y = (Math.random() - 0.5) * 2;
            
            asteroid.userData = {
                distance: distance,
                angle: angle,
                speed: 0.006 + Math.random() * 0.002
            };
            
            this.scene.add(asteroid);
            this.asteroids.push(asteroid);
        }
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Mouse click for planet selection
        this.renderer.domElement.addEventListener('click', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects([this.sun, ...this.planets.map(p => p.mesh)]);
            
            if (intersects.length > 0) {
                const selectedObject = intersects[0].object;
                this.showPlanetInfo(selectedObject.userData);
            } else {
                this.hidePlanetInfo();
            }
        });
        
        // UI Controls
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            speedValue.textContent = this.animationSpeed + 'x';
        });
        
        document.getElementById('reset-camera').addEventListener('click', () => {
            this.camera.position.set(0, 50, 100);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        });
        
        document.getElementById('toggle-orbits').addEventListener('click', () => {
            this.showOrbits = !this.showOrbits;
            this.planets.forEach(planet => {
                planet.orbit.visible = this.showOrbits;
            });
        });
        
        document.getElementById('toggle-labels').addEventListener('click', () => {
            this.showLabels = !this.showLabels;
            this.planets.forEach(planet => {
                planet.label.style.display = this.showLabels ? 'block' : 'none';
            });
        });
        
        document.getElementById('toggle-asteroids').addEventListener('click', () => {
            this.showAsteroids = !this.showAsteroids;
            this.asteroids.forEach(asteroid => {
                asteroid.visible = this.showAsteroids;
            });
        });
    }
    
    showPlanetInfo(userData) {
        const infoPanel = document.getElementById('planet-info');
        document.getElementById('planet-name').textContent = userData.name;
        document.getElementById('planet-description').textContent = userData.description;
        document.getElementById('planet-stats').innerHTML = userData.stats;
        infoPanel.style.display = 'block';
    }
    
    hidePlanetInfo() {
        document.getElementById('planet-info').style.display = 'none';
    }
    
    updatePlanetLabels() {
        this.planets.forEach(planet => {
            const vector = new THREE.Vector3();
            planet.mesh.getWorldPosition(vector);
            vector.project(this.camera);
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
            
            planet.label.style.left = x + 'px';
            planet.label.style.top = (y - 20) + 'px';
            planet.label.style.display = this.showLabels ? 'block' : 'none';
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001 * this.animationSpeed;
        
        // Rotate sun
        if (this.sun) {
            this.sun.rotation.y += 0.01 * this.animationSpeed;
            this.sunGlow.rotation.y -= 0.005 * this.animationSpeed;
        }
        
        // Animate planets
        this.planets.forEach(planet => {
            const data = planet.data;
            data.angle += data.speed * this.animationSpeed;
            
            planet.mesh.position.x = Math.cos(data.angle) * data.distance;
            planet.mesh.position.z = Math.sin(data.angle) * data.distance;
            planet.mesh.rotation.y += 0.02 * this.animationSpeed;
            
            // Animate Earth's moon
            if (data.name === 'Earth' && data.moon) {
                data.moon.position.x = Math.cos(time * 2) * 3;
                data.moon.position.z = Math.sin(time * 2) * 3;
            }
        });
        
        // Animate asteroids
        this.asteroids.forEach(asteroid => {
            const data = asteroid.userData;
            data.angle += data.speed * this.animationSpeed;
            
            asteroid.position.x = Math.cos(data.angle) * data.distance;
            asteroid.position.z = Math.sin(data.angle) * data.distance;
            asteroid.rotation.x += 0.01 * this.animationSpeed;
            asteroid.rotation.y += 0.02 * this.animationSpeed;
        });
        
        this.controls.update();
        this.updatePlanetLabels();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the solar system when the page loads
window.addEventListener('load', () => {
    new SolarSystem();
});