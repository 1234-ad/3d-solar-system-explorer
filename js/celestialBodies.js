// Advanced Celestial Bodies System
class CelestialBodyManager {
    constructor(scene, physics) {
        this.scene = scene;
        this.physics = physics;
        this.bodies = new Map();
        this.moons = new Map();
        this.comets = [];
        this.nebulae = [];
        this.blackHoles = [];
        this.pulsars = [];
        this.exoplanets = [];
        
        this.textureLoader = new THREE.TextureLoader();
        this.loadTextures();
    }
    
    loadTextures() {
        // High-resolution planet textures (using placeholder URLs - replace with actual texture URLs)
        this.textures = {
            sun: this.createProceduralSunTexture(),
            mercury: this.createProceduralTexture(0x8c7853, 'rocky'),
            venus: this.createProceduralTexture(0xffc649, 'cloudy'),
            earth: this.createProceduralTexture(0x6b93d6, 'earth'),
            mars: this.createProceduralTexture(0xc1440e, 'rocky'),
            jupiter: this.createProceduralTexture(0xd8ca9d, 'gas'),
            saturn: this.createProceduralTexture(0xfad5a5, 'gas'),
            uranus: this.createProceduralTexture(0x4fd0e7, 'ice'),
            neptune: this.createProceduralTexture(0x4b70dd, 'ice'),
            moon: this.createProceduralTexture(0xaaaaaa, 'rocky'),
            asteroid: this.createProceduralTexture(0x666666, 'rocky')
        };
    }
    
    createProceduralSunTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create radial gradient for sun
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0, '#ffff00');
        gradient.addColorStop(0.5, '#ffaa00');
        gradient.addColorStop(1, '#ff4400');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add solar flares
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 0, ${Math.random() * 0.5})`;
            ctx.lineWidth = Math.random() * 5;
            ctx.moveTo(Math.random() * 512, Math.random() * 512);
            ctx.lineTo(Math.random() * 512, Math.random() * 512);
            ctx.stroke();
        }
        
        return new THREE.CanvasTexture(canvas);
    }
    
    createProceduralTexture(baseColor, type) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Base color
        ctx.fillStyle = `#${baseColor.toString(16).padStart(6, '0')}`;
        ctx.fillRect(0, 0, 256, 256);
        
        // Add surface features based on type
        switch(type) {
            case 'rocky':
                this.addCraters(ctx);
                break;
            case 'cloudy':
                this.addClouds(ctx);
                break;
            case 'earth':
                this.addContinents(ctx);
                break;
            case 'gas':
                this.addBands(ctx);
                break;
            case 'ice':
                this.addIceFeatures(ctx);
                break;
        }
        
        return new THREE.CanvasTexture(canvas);
    }
    
    addCraters(ctx) {
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const radius = Math.random() * 20 + 5;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    addClouds(ctx) {
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const radius = Math.random() * 30 + 10;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    addContinents(ctx) {
        // Simplified continent shapes
        ctx.fillStyle = 'rgba(0, 100, 0, 0.6)';
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const width = Math.random() * 60 + 20;
            const height = Math.random() * 40 + 15;
            ctx.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    addBands(ctx) {
        for (let i = 0; i < 10; i++) {
            const y = (i / 10) * 256;
            const height = 256 / 10;
            const opacity = Math.random() * 0.3 + 0.1;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fillRect(0, y, 256, height);
        }
    }
    
    addIceFeatures(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * 256, Math.random() * 256);
            ctx.lineTo(Math.random() * 256, Math.random() * 256);
            ctx.lineWidth = Math.random() * 3;
            ctx.strokeStyle = 'rgba(200, 200, 255, 0.4)';
            ctx.stroke();
        }
    }
    
    createAdvancedPlanet(data) {
        // Enhanced planet with multiple layers
        const group = new THREE.Group();
        
        // Main planet body
        const geometry = new THREE.SphereGeometry(data.size, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            map: this.textures[data.name.toLowerCase()],
            bumpScale: 0.1,
            shininess: data.shininess || 0
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.castShadow = true;
        planet.receiveShadow = true;
        group.add(planet);
        
        // Atmosphere for applicable planets
        if (data.hasAtmosphere) {
            const atmosphereGeometry = new THREE.SphereGeometry(data.size * 1.05, 32, 32);
            const atmosphereMaterial = new THREE.MeshBasicMaterial({
                color: data.atmosphereColor || 0x87ceeb,
                transparent: true,
                opacity: 0.1,
                side: THREE.BackSide
            });
            const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
            group.add(atmosphere);
        }
        
        // Clouds for Earth and Venus
        if (data.name === 'Earth' || data.name === 'Venus') {
            const cloudGeometry = new THREE.SphereGeometry(data.size * 1.02, 32, 32);
            const cloudMaterial = new THREE.MeshLambertMaterial({
                transparent: true,
                opacity: data.name === 'Venus' ? 0.8 : 0.4,
                color: data.name === 'Venus' ? 0xffcc00 : 0xffffff
            });
            const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
            group.add(clouds);
            
            // Animate clouds
            planet.userData.clouds = clouds;
        }
        
        // Rings for gas giants
        if (data.hasRings) {
            this.createPlanetRings(group, data);
        }
        
        // Magnetic field visualization
        if (data.hasMagneticField) {
            this.createMagneticField(group, data);
        }
        
        return group;
    }
    
    createPlanetRings(planetGroup, data) {
        const ringData = data.rings || [
            { inner: data.size * 1.2, outer: data.size * 2.0, opacity: 0.6 },
            { inner: data.size * 2.1, outer: data.size * 2.5, opacity: 0.4 }
        ];
        
        ringData.forEach((ring, index) => {
            const ringGeometry = new THREE.RingGeometry(ring.inner, ring.outer, 64);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xaaaaaa,
                transparent: true,
                opacity: ring.opacity,
                side: THREE.DoubleSide
            });
            
            const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
            ringMesh.rotation.x = Math.PI / 2;
            ringMesh.rotation.z = Math.random() * 0.1; // Slight tilt
            
            planetGroup.add(ringMesh);
        });
    }
    
    createMagneticField(planetGroup, data) {
        const fieldLines = [];
        const lineCount = 12;
        
        for (let i = 0; i < lineCount; i++) {
            const angle = (i / lineCount) * Math.PI * 2;
            const points = [];
            
            // Create magnetic field line curve
            for (let j = 0; j <= 50; j++) {
                const t = j / 50;
                const r = data.size * (1.5 + t * 2);
                const theta = angle;
                const phi = Math.PI * t;
                
                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = r * Math.cos(phi);
                const z = r * Math.sin(phi) * Math.sin(theta);
                
                points.push(new THREE.Vector3(x, y, z));
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.3
            });
            
            const line = new THREE.Line(geometry, material);
            fieldLines.push(line);
            planetGroup.add(line);
        }
        
        planetGroup.userData.magneticField = fieldLines;
    }
    
    createMoonSystem(planet, moonData) {
        const moons = [];
        
        moonData.forEach(data => {
            const moonGeometry = new THREE.SphereGeometry(data.size, 16, 16);
            const moonMaterial = new THREE.MeshLambertMaterial({
                map: this.textures.moon,
                color: data.color || 0xaaaaaa
            });
            
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            moon.position.set(data.distance, 0, 0);
            moon.castShadow = true;
            moon.receiveShadow = true;
            
            moon.userData = {
                name: data.name,
                distance: data.distance,
                speed: data.speed,
                angle: Math.random() * Math.PI * 2,
                inclination: data.inclination || 0,
                eccentricity: data.eccentricity || 0
            };
            
            // Create moon orbit
            const orbitGeometry = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 32);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x444444,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            
            planet.add(moon);
            planet.add(orbit);
            moons.push({ mesh: moon, orbit: orbit });
        });
        
        return moons;
    }
    
    createComet(name, position, velocity, size = 0.5) {
        const cometGroup = new THREE.Group();
        
        // Comet nucleus
        const nucleusGeometry = new THREE.SphereGeometry(size, 16, 16);
        const nucleusMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        cometGroup.add(nucleus);
        
        // Coma (gas cloud around nucleus)
        const comaGeometry = new THREE.SphereGeometry(size * 3, 16, 16);
        const comaMaterial = new THREE.MeshBasicMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.3
        });
        const coma = new THREE.Mesh(comaGeometry, comaMaterial);
        cometGroup.add(coma);
        
        // Tail particles
        const tailParticles = this.createCometTail(size);
        cometGroup.add(tailParticles);
        
        cometGroup.position.copy(position);
        
        const cometData = {
            mesh: cometGroup,
            name: name,
            velocity: velocity.clone(),
            nucleus: nucleus,
            coma: coma,
            tail: tailParticles,
            perihelion: 1, // Closest approach to sun
            aphelion: 100, // Farthest from sun
            period: 76, // Orbital period in years
            lastPerihelion: Date.now() - Math.random() * 76 * 365 * 24 * 60 * 60 * 1000
        };
        
        this.comets.push(cometData);
        this.scene.add(cometGroup);
        
        return cometData;
    }
    
    createCometTail(size) {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Tail extends behind the comet
            positions[i3] = (Math.random() - 0.5) * size;
            positions[i3 + 1] = (Math.random() - 0.5) * size;
            positions[i3 + 2] = -Math.random() * size * 20; // Behind the comet
            
            // Blue-white color gradient
            const intensity = Math.random();
            colors[i3] = 0.5 + intensity * 0.5; // Red
            colors[i3 + 1] = 0.8 + intensity * 0.2; // Green
            colors[i3 + 2] = 1.0; // Blue
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        return new THREE.Points(geometry, material);
    }
    
    createNebula(type, position, size) {
        const nebulaGroup = new THREE.Group();
        const particleCount = 5000;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const nebulaColors = {
            emission: [1.0, 0.3, 0.3], // Red
            reflection: [0.3, 0.3, 1.0], // Blue
            planetary: [0.3, 1.0, 0.3], // Green
            dark: [0.1, 0.1, 0.1] // Dark
        };
        
        const baseColor = nebulaColors[type] || nebulaColors.emission;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Spherical distribution with clustering
            const radius = Math.random() * size;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Color variation
            const variation = 0.3;
            colors[i3] = baseColor[0] + (Math.random() - 0.5) * variation;
            colors[i3 + 1] = baseColor[1] + (Math.random() - 0.5) * variation;
            colors[i3 + 2] = baseColor[2] + (Math.random() - 0.5) * variation;
            
            sizes[i] = Math.random() * 2 + 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                    if (r > 0.5) discard;
                    
                    float alpha = 1.0 - (r * 2.0);
                    gl_FragColor = vec4(vColor, alpha * 0.3);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });
        
        const nebula = new THREE.Points(geometry, material);
        nebulaGroup.add(nebula);
        nebulaGroup.position.copy(position);
        
        const nebulaData = {
            mesh: nebulaGroup,
            type: type,
            material: material,
            animationSpeed: 0.001
        };
        
        this.nebulae.push(nebulaData);
        this.scene.add(nebulaGroup);
        
        return nebulaData;
    }
    
    createBlackHole(position, mass) {
        const blackHoleGroup = new THREE.Group();
        
        // Event horizon (invisible sphere)
        const horizonRadius = mass * 0.1; // Simplified Schwarzschild radius
        const horizonGeometry = new THREE.SphereGeometry(horizonRadius, 32, 32);
        const horizonMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.9
        });
        const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
        blackHoleGroup.add(horizon);
        
        // Accretion disk
        const diskGeometry = new THREE.RingGeometry(horizonRadius * 2, horizonRadius * 8, 64);
        const diskMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4400,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const disk = new THREE.Mesh(diskGeometry, diskMaterial);
        disk.rotation.x = Math.PI / 2;
        blackHoleGroup.add(disk);
        
        // Gravitational lensing effect (simplified)
        const lensGeometry = new THREE.SphereGeometry(horizonRadius * 3, 32, 32);
        const lensMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.1,
            color: 0xffffff,
            side: THREE.BackSide
        });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        blackHoleGroup.add(lens);
        
        blackHoleGroup.position.copy(position);
        
        const blackHoleData = {
            mesh: blackHoleGroup,
            mass: mass,
            horizonRadius: horizonRadius,
            disk: disk,
            gravitationalInfluence: horizonRadius * 20
        };
        
        this.blackHoles.push(blackHoleData);
        this.scene.add(blackHoleGroup);
        
        return blackHoleData;
    }
    
    updateCelestialBodies(deltaTime, time) {
        // Update comets
        this.comets.forEach(comet => {
            // Update position based on elliptical orbit
            const distanceFromSun = comet.mesh.position.length();
            const sunDirection = new THREE.Vector3(0, 0, 0).sub(comet.mesh.position).normalize();
            
            // Tail always points away from sun
            const tailDirection = comet.mesh.position.clone().normalize();
            comet.tail.lookAt(comet.mesh.position.clone().add(tailDirection));
            
            // Tail intensity based on distance from sun
            const tailIntensity = Math.max(0.1, 1 - (distanceFromSun / 50));
            comet.tail.material.opacity = tailIntensity * 0.6;
            comet.coma.material.opacity = tailIntensity * 0.3;
            
            // Orbital motion (simplified)
            comet.mesh.position.add(comet.velocity.clone().multiplyScalar(deltaTime));
            
            // Apply gravitational force from sun
            const gravityForce = sunDirection.multiplyScalar(100 / (distanceFromSun * distanceFromSun));
            comet.velocity.add(gravityForce.multiplyScalar(deltaTime));
        });
        
        // Update nebulae
        this.nebulae.forEach(nebula => {
            nebula.material.uniforms.time.value = time * nebula.animationSpeed;
            nebula.mesh.rotation.y += nebula.animationSpeed;
        });
        
        // Update black holes
        this.blackHoles.forEach(blackHole => {
            // Rotate accretion disk
            blackHole.disk.rotation.z += 0.02;
            
            // Apply gravitational effects to nearby objects
            this.applyBlackHoleGravity(blackHole);
        });
    }
    
    applyBlackHoleGravity(blackHole) {
        // Apply gravitational effects to comets and other objects
        this.comets.forEach(comet => {
            const distance = comet.mesh.position.distanceTo(blackHole.mesh.position);
            if (distance < blackHole.gravitationalInfluence) {
                const direction = new THREE.Vector3()
                    .subVectors(blackHole.mesh.position, comet.mesh.position)
                    .normalize();
                
                const force = (blackHole.mass * 1000) / (distance * distance);
                comet.velocity.add(direction.multiplyScalar(force * 0.001));
            }
        });
    }
}

export { CelestialBodyManager };