// Advanced Spacecraft System
class SpacecraftManager {
    constructor(scene, physics) {
        this.scene = scene;
        this.physics = physics;
        this.spacecraft = [];
        this.missions = [];
        this.trajectories = [];
        this.activeSpacecraft = null;
        this.pilotMode = false;
        
        this.initializeHistoricalMissions();
    }
    
    initializeHistoricalMissions() {
        this.historicalMissions = [
            {
                name: "Voyager 1",
                launchDate: "1977-09-05",
                trajectory: "Jupiter-Saturn-Interstellar",
                status: "Active",
                currentDistance: 156,
                speed: 17.1,
                description: "Farthest human-made object from Earth"
            },
            {
                name: "Voyager 2",
                launchDate: "1977-08-20",
                trajectory: "Grand Tour",
                status: "Active",
                currentDistance: 129,
                speed: 15.4,
                description: "Only spacecraft to visit all four outer planets"
            },
            {
                name: "Cassini",
                launchDate: "1997-10-15",
                trajectory: "Saturn System",
                status: "Mission Complete",
                currentDistance: 0,
                speed: 0,
                description: "Studied Saturn for 13 years"
            },
            {
                name: "New Horizons",
                launchDate: "2006-01-19",
                trajectory: "Pluto-Kuiper Belt",
                status: "Active",
                currentDistance: 52,
                speed: 16.26,
                description: "First spacecraft to visit Pluto"
            },
            {
                name: "Parker Solar Probe",
                launchDate: "2018-08-12",
                trajectory: "Solar Corona",
                status: "Active",
                currentDistance: 0.1,
                speed: 200,
                description: "Closest approach to the Sun"
            }
        ];
    }
    
    createSpacecraft(type, position, velocity) {
        let geometry, material, scale;
        
        switch(type) {
            case 'probe':
                geometry = new THREE.ConeGeometry(0.2, 1, 8);
                material = new THREE.MeshLambertMaterial({ color: 0xcccccc });
                scale = 1;
                break;
            case 'satellite':
                geometry = new THREE.BoxGeometry(0.5, 0.3, 0.8);
                material = new THREE.MeshLambertMaterial({ color: 0x4444ff });
                scale = 1;
                break;
            case 'rover':
                geometry = new THREE.BoxGeometry(0.8, 0.4, 1.2);
                material = new THREE.MeshLambertMaterial({ color: 0xff4444 });
                scale = 1;
                break;
            case 'station':
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
                material = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
                scale = 2;
                break;
            default:
                geometry = new THREE.SphereGeometry(0.3, 16, 16);
                material = new THREE.MeshLambertMaterial({ color: 0xffffff });
                scale = 1;
        }
        
        const spacecraft = new THREE.Mesh(geometry, material);
        spacecraft.position.copy(position);
        spacecraft.scale.setScalar(scale);
        
        // Add propulsion effects
        const exhaustGeometry = new THREE.ConeGeometry(0.1, 0.5, 8);
        const exhaustMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff, 
            transparent: true, 
            opacity: 0.7 
        });
        const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        exhaust.position.set(0, 0, -0.8);
        exhaust.visible = false;
        spacecraft.add(exhaust);
        
        // Add solar panels for certain types
        if (type === 'probe' || type === 'satellite') {
            const panelGeometry = new THREE.BoxGeometry(2, 0.05, 0.8);
            const panelMaterial = new THREE.MeshLambertMaterial({ color: 0x000080 });
            const panels = new THREE.Mesh(panelGeometry, panelMaterial);
            spacecraft.add(panels);
        }
        
        // Add communication dish
        const dishGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16);
        const dishMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
        const dish = new THREE.Mesh(dishGeometry, dishMaterial);
        dish.position.set(0, 0.5, 0);
        dish.rotation.x = Math.PI / 4;
        spacecraft.add(dish);
        
        const spacecraftData = {
            mesh: spacecraft,
            type: type,
            velocity: velocity.clone(),
            fuel: 100,
            power: 100,
            health: 100,
            mission: null,
            trajectory: [],
            instruments: this.generateInstruments(type),
            exhaust: exhaust,
            lastPosition: position.clone(),
            totalDistance: 0
        };
        
        this.spacecraft.push(spacecraftData);
        this.scene.add(spacecraft);
        
        return spacecraftData;
    }
    
    generateInstruments(type) {
        const baseInstruments = ['Camera', 'Radio', 'Computer'];
        const typeSpecific = {
            'probe': ['Magnetometer', 'Plasma Detector', 'Cosmic Ray Detector'],
            'satellite': ['GPS', 'Weather Sensors', 'Communication Array'],
            'rover': ['Drill', 'Spectrometer', 'Soil Analyzer'],
            'station': ['Life Support', 'Research Lab', 'Docking Port']
        };
        
        return [...baseInstruments, ...(typeSpecific[type] || [])];
    }
    
    createMission(name, spacecraft, target, objectives) {
        const mission = {
            id: Date.now(),
            name: name,
            spacecraft: spacecraft,
            target: target,
            objectives: objectives,
            status: 'Active',
            progress: 0,
            startTime: Date.now(),
            data: [],
            achievements: []
        };
        
        spacecraft.mission = mission;
        this.missions.push(mission);
        
        return mission;
    }
    
    calculateTrajectory(start, target, transferType = 'hohmann') {
        const trajectory = [];
        const steps = 100;
        
        switch(transferType) {
            case 'hohmann':
                trajectory.push(...this.calculateHohmannTransfer(start, target, steps));
                break;
            case 'bi-elliptic':
                trajectory.push(...this.calculateBiEllipticTransfer(start, target, steps));
                break;
            case 'gravity-assist':
                trajectory.push(...this.calculateGravityAssist(start, target, steps));
                break;
            default:
                trajectory.push(...this.calculateDirectTransfer(start, target, steps));
        }
        
        return trajectory;
    }
    
    calculateHohmannTransfer(start, target, steps) {
        const trajectory = [];
        const startRadius = start.length();
        const targetRadius = target.length();
        
        // Semi-major axis of transfer orbit
        const a = (startRadius + targetRadius) / 2;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = Math.PI * t; // Half orbit
            
            const r = a * (1 - Math.pow(Math.cos(angle / 2), 2));
            const x = r * Math.cos(angle);
            const z = r * Math.sin(angle);
            
            trajectory.push(new THREE.Vector3(x, 0, z));
        }
        
        return trajectory;
    }
    
    calculateBiEllipticTransfer(start, target, steps) {
        // More complex transfer for very different orbital radii
        const trajectory = [];
        const startRadius = start.length();
        const targetRadius = target.length();
        const intermediateRadius = Math.max(startRadius, targetRadius) * 2;
        
        // First half: start to intermediate
        for (let i = 0; i <= steps / 2; i++) {
            const t = i / (steps / 2);
            const a1 = (startRadius + intermediateRadius) / 2;
            const angle = Math.PI * t;
            
            const r = a1 * (1 - Math.pow(Math.cos(angle / 2), 2));
            const x = r * Math.cos(angle);
            const z = r * Math.sin(angle);
            
            trajectory.push(new THREE.Vector3(x, 0, z));
        }
        
        // Second half: intermediate to target
        for (let i = 0; i <= steps / 2; i++) {
            const t = i / (steps / 2);
            const a2 = (intermediateRadius + targetRadius) / 2;
            const angle = Math.PI * t;
            
            const r = a2 * (1 - Math.pow(Math.cos(angle / 2), 2));
            const x = r * Math.cos(angle + Math.PI);
            const z = r * Math.sin(angle + Math.PI);
            
            trajectory.push(new THREE.Vector3(x, 0, z));
        }
        
        return trajectory;
    }
    
    calculateGravityAssist(start, target, steps) {
        // Simplified gravity assist calculation
        const trajectory = [];
        const assistBody = new THREE.Vector3(30, 0, 0); // Mars position for example
        
        // Path to assist body
        for (let i = 0; i <= steps / 2; i++) {
            const t = i / (steps / 2);
            const pos = new THREE.Vector3().lerpVectors(start, assistBody, t);
            trajectory.push(pos);
        }
        
        // Path from assist body to target (with velocity boost)
        for (let i = 0; i <= steps / 2; i++) {
            const t = i / (steps / 2);
            const pos = new THREE.Vector3().lerpVectors(assistBody, target, t);
            trajectory.push(pos);
        }
        
        return trajectory;
    }
    
    calculateDirectTransfer(start, target, steps) {
        const trajectory = [];
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const pos = new THREE.Vector3().lerpVectors(start, target, t);
            trajectory.push(pos);
        }
        
        return trajectory;
    }
    
    launchSpacecraft(spacecraft, target, launchWindow) {
        const trajectory = this.calculateTrajectory(
            spacecraft.mesh.position, 
            target.position,
            'hohmann'
        );
        
        spacecraft.trajectory = trajectory;
        spacecraft.trajectoryIndex = 0;
        spacecraft.isLaunched = true;
        spacecraft.launchTime = Date.now();
        
        // Create visual trajectory
        this.createTrajectoryVisualization(trajectory);
        
        // Start mission
        const mission = this.createMission(
            `Mission to ${target.name}`,
            spacecraft,
            target,
            ['Reach target', 'Collect data', 'Transmit results']
        );
        
        return mission;
    }
    
    createTrajectoryVisualization(trajectory) {
        const points = trajectory;
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: 0x00ff00, 
            transparent: true, 
            opacity: 0.6 
        });
        const line = new THREE.Line(geometry, material);
        
        this.scene.add(line);
        this.trajectories.push(line);
    }
    
    updateSpacecraft(deltaTime) {
        this.spacecraft.forEach(spacecraft => {
            if (!spacecraft.isLaunched) return;
            
            // Follow trajectory
            if (spacecraft.trajectory && spacecraft.trajectoryIndex < spacecraft.trajectory.length - 1) {
                const currentPos = spacecraft.trajectory[spacecraft.trajectoryIndex];
                const nextPos = spacecraft.trajectory[spacecraft.trajectoryIndex + 1];
                
                spacecraft.mesh.position.copy(currentPos);
                spacecraft.trajectoryIndex += 0.5 * deltaTime * 60; // Adjust speed
                
                // Calculate distance traveled
                const distance = spacecraft.mesh.position.distanceTo(spacecraft.lastPosition);
                spacecraft.totalDistance += distance;
                spacecraft.lastPosition.copy(spacecraft.mesh.position);
                
                // Show exhaust when moving
                spacecraft.exhaust.visible = true;
                
                // Update mission progress
                if (spacecraft.mission) {
                    spacecraft.mission.progress = (spacecraft.trajectoryIndex / spacecraft.trajectory.length) * 100;
                }
            } else {
                spacecraft.exhaust.visible = false;
                
                // Mission complete
                if (spacecraft.mission && spacecraft.mission.status === 'Active') {
                    spacecraft.mission.status = 'Complete';
                    spacecraft.mission.achievements.push('Target reached');
                }
            }
            
            // Consume resources
            if (spacecraft.exhaust.visible) {
                spacecraft.fuel = Math.max(0, spacecraft.fuel - 0.1 * deltaTime);
                spacecraft.power = Math.max(0, spacecraft.power - 0.05 * deltaTime);
            }
            
            // Rotate spacecraft
            spacecraft.mesh.rotation.y += 0.01;
            
            // Point towards movement direction
            if (spacecraft.trajectory && spacecraft.trajectoryIndex < spacecraft.trajectory.length - 1) {
                const direction = new THREE.Vector3()
                    .subVectors(
                        spacecraft.trajectory[Math.floor(spacecraft.trajectoryIndex) + 1] || spacecraft.mesh.position,
                        spacecraft.mesh.position
                    )
                    .normalize();
                spacecraft.mesh.lookAt(spacecraft.mesh.position.clone().add(direction));
            }
        });
    }
    
    enablePilotMode(spacecraft) {
        this.activeSpacecraft = spacecraft;
        this.pilotMode = true;
        
        // Create cockpit UI
        this.createCockpitUI();
    }
    
    createCockpitUI() {
        const cockpitUI = document.createElement('div');
        cockpitUI.id = 'cockpit-ui';
        cockpitUI.innerHTML = `
            <div class="cockpit-panel">
                <h3>🚀 Spacecraft Control</h3>
                <div class="instrument-panel">
                    <div class="instrument">
                        <label>Fuel: <span id="fuel-level">100%</span></label>
                        <div class="progress-bar"><div id="fuel-bar" class="progress-fill"></div></div>
                    </div>
                    <div class="instrument">
                        <label>Power: <span id="power-level">100%</span></label>
                        <div class="progress-bar"><div id="power-bar" class="progress-fill"></div></div>
                    </div>
                    <div class="instrument">
                        <label>Speed: <span id="speed-reading">0 km/s</span></label>
                    </div>
                    <div class="instrument">
                        <label>Distance: <span id="distance-reading">0 km</span></label>
                    </div>
                </div>
                <div class="control-buttons">
                    <button id="thrust-forward">🔥 Thrust</button>
                    <button id="brake">🛑 Brake</button>
                    <button id="rotate-left">↺ Left</button>
                    <button id="rotate-right">↻ Right</button>
                </div>
            </div>
        `;
        
        cockpitUI.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            z-index: 200;
        `;
        
        document.body.appendChild(cockpitUI);
    }
    
    getMissionStatus() {
        return this.missions.map(mission => ({
            name: mission.name,
            status: mission.status,
            progress: Math.round(mission.progress),
            spacecraft: mission.spacecraft.type,
            target: mission.target.name,
            achievements: mission.achievements
        }));
    }
    
    getSpacecraftTelemetry(spacecraft) {
        return {
            position: spacecraft.mesh.position.clone(),
            velocity: spacecraft.velocity.clone(),
            fuel: spacecraft.fuel,
            power: spacecraft.power,
            health: spacecraft.health,
            totalDistance: spacecraft.totalDistance,
            instruments: spacecraft.instruments,
            mission: spacecraft.mission ? spacecraft.mission.name : 'None'
        };
    }
}

export { SpacecraftManager };