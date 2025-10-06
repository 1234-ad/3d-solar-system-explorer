// Advanced Physics Engine for Solar System
class PhysicsEngine {
    constructor() {
        this.G = 6.67430e-11; // Gravitational constant (scaled for simulation)
        this.bodies = [];
        this.timeStep = 0.016; // 60 FPS
        this.realTimeScale = 1000000; // Speed up time for visible orbits
        this.enableNBodyPhysics = true;
        this.enableRelativisticEffects = false;
        this.enableTidalForces = false;
    }
    
    addBody(body) {
        this.bodies.push(body);
    }
    
    calculateGravitationalForce(body1, body2) {
        const dx = body2.position.x - body1.position.x;
        const dy = body2.position.y - body1.position.y;
        const dz = body2.position.z - body1.position.z;
        
        const distanceSquared = dx * dx + dy * dy + dz * dz;
        const distance = Math.sqrt(distanceSquared);
        
        if (distance < 0.1) return { x: 0, y: 0, z: 0 }; // Avoid singularity
        
        const force = (this.G * body1.mass * body2.mass) / distanceSquared;
        const forceX = force * (dx / distance);
        const forceY = force * (dy / distance);
        const forceZ = force * (dz / distance);
        
        return { x: forceX, y: forceY, z: forceZ };
    }
    
    calculateTidalForce(body, primaryBody, secondaryBody) {
        if (!this.enableTidalForces) return { x: 0, y: 0, z: 0 };
        
        // Simplified tidal force calculation
        const r1 = body.position.distanceTo(primaryBody.position);
        const r2 = body.position.distanceTo(secondaryBody.position);
        
        const tidalStrength = (2 * this.G * secondaryBody.mass) / Math.pow(r2, 3);
        const direction = new THREE.Vector3().subVectors(primaryBody.position, body.position).normalize();
        
        return {
            x: tidalStrength * direction.x,
            y: tidalStrength * direction.y,
            z: tidalStrength * direction.z
        };
    }
    
    applyRelativisticCorrection(body, centralMass) {
        if (!this.enableRelativisticEffects) return;
        
        // Simplified relativistic precession (like Mercury's orbit)
        const c = 299792458; // Speed of light (scaled)
        const r = body.position.length();
        const v = body.velocity.length();
        
        const correction = (3 * this.G * centralMass) / (c * c * r);
        const precessionRate = correction * v / r;
        
        // Apply small orbital precession
        const angle = precessionRate * this.timeStep;
        body.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    }
    
    update(deltaTime) {
        if (!this.enableNBodyPhysics) return;
        
        // Reset forces
        this.bodies.forEach(body => {
            body.force = { x: 0, y: 0, z: 0 };
        });
        
        // Calculate all gravitational forces
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const force = this.calculateGravitationalForce(this.bodies[i], this.bodies[j]);
                
                // Apply Newton's third law
                this.bodies[i].force.x += force.x;
                this.bodies[i].force.y += force.y;
                this.bodies[i].force.z += force.z;
                
                this.bodies[j].force.x -= force.x;
                this.bodies[j].force.y -= force.y;
                this.bodies[j].force.z -= force.z;
            }
        }
        
        // Update positions and velocities
        this.bodies.forEach(body => {
            if (body.fixed) return; // Don't move fixed bodies (like the Sun)
            
            // F = ma, so a = F/m
            const ax = body.force.x / body.mass;
            const ay = body.force.y / body.mass;
            const az = body.force.z / body.mass;
            
            // Update velocity (Verlet integration)
            body.velocity.x += ax * deltaTime * this.realTimeScale;
            body.velocity.y += ay * deltaTime * this.realTimeScale;
            body.velocity.z += az * deltaTime * this.realTimeScale;
            
            // Update position
            body.position.x += body.velocity.x * deltaTime * this.realTimeScale;
            body.position.y += body.velocity.y * deltaTime * this.realTimeScale;
            body.position.z += body.velocity.z * deltaTime * this.realTimeScale;
            
            // Apply relativistic corrections for inner planets
            if (body.name === 'Mercury' || body.name === 'Venus') {
                this.applyRelativisticCorrection(body, this.bodies[0].mass);
            }
        });
    }
    
    calculateOrbitalElements(body, centralBody) {
        const r = new THREE.Vector3().subVectors(body.position, centralBody.position);
        const v = body.velocity.clone();
        const mu = this.G * (body.mass + centralBody.mass);
        
        // Semi-major axis
        const energy = 0.5 * v.lengthSq() - mu / r.length();
        const semiMajorAxis = -mu / (2 * energy);
        
        // Eccentricity
        const h = new THREE.Vector3().crossVectors(r, v);
        const eVector = new THREE.Vector3()
            .crossVectors(v, h)
            .divideScalar(mu)
            .sub(r.clone().normalize());
        const eccentricity = eVector.length();
        
        // Inclination
        const inclination = Math.acos(h.y / h.length());
        
        return {
            semiMajorAxis,
            eccentricity,
            inclination: inclination * 180 / Math.PI,
            period: 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / mu)
        };
    }
}

// Lagrange Point Calculator
class LagrangePoints {
    static calculateL1(m1, m2, distance) {
        // L1 point between two masses
        const mu = m2 / (m1 + m2);
        const r = distance * (1 - Math.cbrt(mu / 3));
        return r;
    }
    
    static calculateL2(m1, m2, distance) {
        // L2 point beyond smaller mass
        const mu = m2 / (m1 + m2);
        const r = distance * (1 + Math.cbrt(mu / 3));
        return r;
    }
    
    static calculateL4L5(m1, m2, distance) {
        // L4 and L5 points (60 degrees ahead/behind)
        return {
            L4: {
                x: distance * Math.cos(Math.PI / 3),
                z: distance * Math.sin(Math.PI / 3)
            },
            L5: {
                x: distance * Math.cos(-Math.PI / 3),
                z: distance * Math.sin(-Math.PI / 3)
            }
        };
    }
}

export { PhysicsEngine, LagrangePoints };