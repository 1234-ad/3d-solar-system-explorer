// Game Mode System
class GameModeManager {
    constructor(solarSystem) {
        this.solarSystem = solarSystem;
        this.currentMode = 'exploration';
        this.gameState = {
            score: 0,
            level: 1,
            achievements: [],
            unlockedFeatures: ['basic_navigation'],
            resources: {
                fuel: 1000,
                credits: 500,
                research: 0,
                reputation: 0
            },
            missions: [],
            discoveries: []
        };
        
        this.modes = {
            exploration: new ExplorationMode(this),
            survival: new SurvivalMode(this),
            racing: new RacingMode(this),
            builder: new BuilderMode(this),
            education: new EducationMode(this),
            sandbox: new SandboxMode(this)
        };
        
        this.initializeUI();
        this.loadAchievements();
    }
    
    switchMode(modeName) {
        if (this.modes[modeName]) {
            this.modes[this.currentMode].deactivate();
            this.currentMode = modeName;
            this.modes[this.currentMode].activate();
            this.updateModeUI();
        }
    }
    
    initializeUI() {
        const gameModeUI = document.createElement('div');
        gameModeUI.id = 'game-mode-ui';
        gameModeUI.innerHTML = `
            <div class="game-header">
                <div class="mode-selector">
                    <select id="mode-select">
                        <option value="exploration">🔍 Exploration</option>
                        <option value="survival">🚀 Survival</option>
                        <option value="racing">🏁 Racing</option>
                        <option value="builder">🏗️ Builder</option>
                        <option value="education">📚 Education</option>
                        <option value="sandbox">🎮 Sandbox</option>
                    </select>
                </div>
                <div class="game-stats">
                    <span>Score: <span id="game-score">0</span></span>
                    <span>Level: <span id="game-level">1</span></span>
                    <span>Credits: <span id="game-credits">500</span></span>
                </div>
            </div>
            <div id="mode-specific-ui"></div>
            <div id="achievements-panel" class="hidden">
                <h3>🏆 Achievements</h3>
                <div id="achievements-list"></div>
            </div>
        `;
        
        gameModeUI.style.cssText = `
            position: absolute;
            top: 20px;
            right: 300px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            z-index: 150;
            min-width: 300px;
        `;
        
        document.body.appendChild(gameModeUI);
        
        // Event listeners
        document.getElementById('mode-select').addEventListener('change', (e) => {
            this.switchMode(e.target.value);
        });
    }
    
    updateModeUI() {
        const modeUI = document.getElementById('mode-specific-ui');
        modeUI.innerHTML = this.modes[this.currentMode].getUI();
        
        // Update stats
        document.getElementById('game-score').textContent = this.gameState.score;
        document.getElementById('game-level').textContent = this.gameState.level;
        document.getElementById('game-credits').textContent = this.gameState.resources.credits;
    }
    
    loadAchievements() {
        this.achievements = [
            { id: 'first_planet', name: 'First Contact', description: 'Visit your first planet', icon: '🪐', unlocked: false },
            { id: 'speed_demon', name: 'Speed Demon', description: 'Reach maximum simulation speed', icon: '⚡', unlocked: false },
            { id: 'explorer', name: 'Solar Explorer', description: 'Visit all planets in the solar system', icon: '🚀', unlocked: false },
            { id: 'scientist', name: 'Space Scientist', description: 'Complete 10 research missions', icon: '🔬', unlocked: false },
            { id: 'pilot', name: 'Ace Pilot', description: 'Successfully complete a spacecraft mission', icon: '✈️', unlocked: false },
            { id: 'discoverer', name: 'Cosmic Discoverer', description: 'Discover a comet or asteroid', icon: '☄️', unlocked: false },
            { id: 'builder', name: 'Space Architect', description: 'Build your first space station', icon: '🏗️', unlocked: false },
            { id: 'survivor', name: 'Survivor', description: 'Survive 100 days in survival mode', icon: '💪', unlocked: false }
        ];
    }
    
    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.gameState.achievements.push(achievementId);
            this.showAchievementNotification(achievement);
            this.gameState.score += 100;
            this.updateModeUI();
        }
    }
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <span class="achievement-icon">${achievement.icon}</span>
                <div>
                    <h4>Achievement Unlocked!</h4>
                    <p>${achievement.name}</p>
                    <small>${achievement.description}</small>
                </div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            color: black;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    addResources(type, amount) {
        if (this.gameState.resources[type] !== undefined) {
            this.gameState.resources[type] += amount;
            this.updateModeUI();
        }
    }
    
    spendResources(type, amount) {
        if (this.gameState.resources[type] >= amount) {
            this.gameState.resources[type] -= amount;
            this.updateModeUI();
            return true;
        }
        return false;
    }
    
    update(deltaTime) {
        this.modes[this.currentMode].update(deltaTime);
    }
}

// Exploration Mode
class ExplorationMode {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.visitedPlanets = new Set();
        this.discoveredObjects = new Set();
        this.researchPoints = 0;
    }
    
    activate() {
        console.log('Exploration mode activated');
    }
    
    deactivate() {
        console.log('Exploration mode deactivated');
    }
    
    getUI() {
        return `
            <div class="exploration-ui">
                <h4>🔍 Exploration Mode</h4>
                <p>Discover planets, moons, and celestial objects!</p>
                <div class="progress-info">
                    <p>Planets Visited: ${this.visitedPlanets.size}/8</p>
                    <p>Objects Discovered: ${this.discoveredObjects.size}</p>
                    <p>Research Points: ${this.researchPoints}</p>
                </div>
                <div class="exploration-objectives">
                    <h5>Current Objectives:</h5>
                    <ul>
                        <li>Visit all planets in the solar system</li>
                        <li>Discover 5 asteroids</li>
                        <li>Find a comet</li>
                        <li>Study planetary moons</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    visitPlanet(planetName) {
        if (!this.visitedPlanets.has(planetName)) {
            this.visitedPlanets.add(planetName);
            this.researchPoints += 10;
            this.gameManager.addResources('research', 10);
            
            if (this.visitedPlanets.size === 1) {
                this.gameManager.unlockAchievement('first_planet');
            }
            if (this.visitedPlanets.size === 8) {
                this.gameManager.unlockAchievement('explorer');
            }
        }
    }
    
    discoverObject(objectType, objectName) {
        const key = `${objectType}:${objectName}`;
        if (!this.discoveredObjects.has(key)) {
            this.discoveredObjects.add(key);
            this.researchPoints += 5;
            this.gameManager.addResources('research', 5);
            
            if (objectType === 'comet') {
                this.gameManager.unlockAchievement('discoverer');
            }
        }
    }
    
    update(deltaTime) {
        // Check for nearby objects and auto-discover
        // This would integrate with the main solar system
    }
}

// Survival Mode
class SurvivalMode {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.oxygenLevel = 100;
        this.powerLevel = 100;
        this.hullIntegrity = 100;
        this.dayssurvived = 0;
        this.threats = [];
    }
    
    activate() {
        this.startSurvivalTimer();
    }
    
    deactivate() {
        if (this.survivalTimer) {
            clearInterval(this.survivalTimer);
        }
    }
    
    getUI() {
        return `
            <div class="survival-ui">
                <h4>🚀 Survival Mode</h4>
                <div class="survival-stats">
                    <div class="stat-bar">
                        <label>Oxygen: ${this.oxygenLevel}%</label>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.oxygenLevel}%; background: #00ff00;"></div>
                        </div>
                    </div>
                    <div class="stat-bar">
                        <label>Power: ${this.powerLevel}%</label>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.powerLevel}%; background: #ffff00;"></div>
                        </div>
                    </div>
                    <div class="stat-bar">
                        <label>Hull: ${this.hullIntegrity}%</label>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.hullIntegrity}%; background: #ff0000;"></div>
                        </div>
                    </div>
                </div>
                <p>Days Survived: ${this.dayssurvived}</p>
                <div class="survival-actions">
                    <button onclick="this.repairSystems()">🔧 Repair Systems (50 credits)</button>
                    <button onclick="this.refillOxygen()">💨 Refill Oxygen (30 credits)</button>
                    <button onclick="this.rechargePower()">⚡ Recharge Power (40 credits)</button>
                </div>
            </div>
        `;
    }
    
    startSurvivalTimer() {
        this.survivalTimer = setInterval(() => {
            this.dayssurvived++;
            this.oxygenLevel = Math.max(0, this.oxygenLevel - Math.random() * 2);
            this.powerLevel = Math.max(0, this.powerLevel - Math.random() * 1.5);
            this.hullIntegrity = Math.max(0, this.hullIntegrity - Math.random() * 0.5);
            
            if (this.dayssurvived >= 100) {
                this.gameManager.unlockAchievement('survivor');
            }
            
            // Check for game over
            if (this.oxygenLevel <= 0 || this.powerLevel <= 0 || this.hullIntegrity <= 0) {
                this.gameOver();
            }
        }, 1000); // 1 second = 1 day
    }
    
    gameOver() {
        alert(`Game Over! You survived ${this.dayssurvived} days.`);
        this.resetSurvival();
    }
    
    resetSurvival() {
        this.oxygenLevel = 100;
        this.powerLevel = 100;
        this.hullIntegrity = 100;
        this.dayssurvived = 0;
    }
    
    update(deltaTime) {
        // Update survival mechanics
    }
}

// Racing Mode
class RacingMode {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.races = [];
        this.currentRace = null;
        this.bestTimes = {};
    }
    
    activate() {
        this.createRaces();
    }
    
    deactivate() {
        // Clean up race UI
    }
    
    getUI() {
        return `
            <div class="racing-ui">
                <h4>🏁 Racing Mode</h4>
                <div class="race-selection">
                    <h5>Available Races:</h5>
                    <button onclick="this.startRace('mercury_sprint')">Mercury Sprint</button>
                    <button onclick="this.startRace('asteroid_slalom')">Asteroid Slalom</button>
                    <button onclick="this.startRace('grand_tour')">Grand Tour</button>
                </div>
                ${this.currentRace ? this.getRaceUI() : ''}
            </div>
        `;
    }
    
    getRaceUI() {
        return `
            <div class="current-race">
                <h5>Current Race: ${this.currentRace.name}</h5>
                <p>Time: ${this.currentRace.currentTime.toFixed(2)}s</p>
                <p>Checkpoints: ${this.currentRace.checkpointsPassed}/${this.currentRace.totalCheckpoints}</p>
                <div class="race-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(this.currentRace.checkpointsPassed / this.currentRace.totalCheckpoints) * 100}%;"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    createRaces() {
        this.races = [
            {
                id: 'mercury_sprint',
                name: 'Mercury Sprint',
                description: 'Race around Mercury as fast as possible',
                checkpoints: ['Mercury'],
                bestTime: null
            },
            {
                id: 'asteroid_slalom',
                name: 'Asteroid Slalom',
                description: 'Navigate through the asteroid belt',
                checkpoints: ['Asteroid1', 'Asteroid2', 'Asteroid3'],
                bestTime: null
            },
            {
                id: 'grand_tour',
                name: 'Grand Tour',
                description: 'Visit all planets in order',
                checkpoints: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
                bestTime: null
            }
        ];
    }
    
    startRace(raceId) {
        const race = this.races.find(r => r.id === raceId);
        if (race) {
            this.currentRace = {
                ...race,
                startTime: Date.now(),
                currentTime: 0,
                checkpointsPassed: 0,
                totalCheckpoints: race.checkpoints.length
            };
        }
    }
    
    update(deltaTime) {
        if (this.currentRace) {
            this.currentRace.currentTime = (Date.now() - this.currentRace.startTime) / 1000;
        }
    }
}

// Builder Mode
class BuilderMode {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.structures = [];
        this.selectedTool = 'station';
    }
    
    activate() {
        // Enable building tools
    }
    
    deactivate() {
        // Disable building tools
    }
    
    getUI() {
        return `
            <div class="builder-ui">
                <h4>🏗️ Builder Mode</h4>
                <div class="building-tools">
                    <h5>Building Tools:</h5>
                    <button class="tool-btn ${this.selectedTool === 'station' ? 'active' : ''}" onclick="this.selectTool('station')">🏢 Space Station</button>
                    <button class="tool-btn ${this.selectedTool === 'satellite' ? 'active' : ''}" onclick="this.selectTool('satellite')">📡 Satellite</button>
                    <button class="tool-btn ${this.selectedTool === 'mining' ? 'active' : ''}" onclick="this.selectTool('mining')">⛏️ Mining Platform</button>
                    <button class="tool-btn ${this.selectedTool === 'solar' ? 'active' : ''}" onclick="this.selectTool('solar')">☀️ Solar Array</button>
                </div>
                <div class="structure-costs">
                    <h5>Costs:</h5>
                    <p>Space Station: 1000 credits</p>
                    <p>Satellite: 500 credits</p>
                    <p>Mining Platform: 800 credits</p>
                    <p>Solar Array: 300 credits</p>
                </div>
                <p>Structures Built: ${this.structures.length}</p>
            </div>
        `;
    }
    
    selectTool(tool) {
        this.selectedTool = tool;
    }
    
    buildStructure(position) {
        const costs = {
            station: 1000,
            satellite: 500,
            mining: 800,
            solar: 300
        };
        
        if (this.gameManager.spendResources('credits', costs[this.selectedTool])) {
            this.structures.push({
                type: this.selectedTool,
                position: position.clone(),
                built: Date.now()
            });
            
            if (this.structures.length === 1) {
                this.gameManager.unlockAchievement('builder');
            }
        }
    }
    
    update(deltaTime) {
        // Update structures
    }
}

// Education Mode
class EducationMode {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.currentLesson = null;
        this.completedLessons = [];
        this.quizScore = 0;
    }
    
    activate() {
        this.loadLessons();
    }
    
    deactivate() {
        // Clean up education UI
    }
    
    getUI() {
        return `
            <div class="education-ui">
                <h4>📚 Education Mode</h4>
                <div class="lesson-selection">
                    <h5>Available Lessons:</h5>
                    <button onclick="this.startLesson('solar_system')">Solar System Basics</button>
                    <button onclick="this.startLesson('gravity')">Gravity & Orbits</button>
                    <button onclick="this.startLesson('space_exploration')">Space Exploration</button>
                    <button onclick="this.startLesson('planetary_science')">Planetary Science</button>
                </div>
                <p>Lessons Completed: ${this.completedLessons.length}/4</p>
                <p>Quiz Score: ${this.quizScore}/100</p>
            </div>
        `;
    }
    
    loadLessons() {
        this.lessons = {
            solar_system: {
                title: 'Solar System Basics',
                content: 'Learn about the structure and formation of our solar system...',
                quiz: [
                    { question: 'How many planets are in our solar system?', answer: '8' },
                    { question: 'Which planet is closest to the Sun?', answer: 'Mercury' }
                ]
            },
            gravity: {
                title: 'Gravity & Orbits',
                content: 'Understand how gravity shapes planetary orbits...',
                quiz: [
                    { question: 'What force keeps planets in orbit?', answer: 'Gravity' },
                    { question: 'Which law describes planetary motion?', answer: 'Kepler\'s Laws' }
                ]
            }
        };
    }
    
    startLesson(lessonId) {
        this.currentLesson = this.lessons[lessonId];
        // Show lesson content
    }
    
    update(deltaTime) {
        // Update education progress
    }
}

// Sandbox Mode
class SandboxMode {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.customObjects = [];
    }
    
    activate() {
        // Enable all sandbox tools
    }
    
    deactivate() {
        // Clean up sandbox
    }
    
    getUI() {
        return `
            <div class="sandbox-ui">
                <h4>🎮 Sandbox Mode</h4>
                <p>Create your own solar system!</p>
                <div class="sandbox-tools">
                    <button onclick="this.addPlanet()">Add Planet</button>
                    <button onclick="this.addMoon()">Add Moon</button>
                    <button onclick="this.addComet()">Add Comet</button>
                    <button onclick="this.addBlackHole()">Add Black Hole</button>
                    <button onclick="this.clearAll()">Clear All</button>
                </div>
                <p>Custom Objects: ${this.customObjects.length}</p>
            </div>
        `;
    }
    
    addPlanet() {
        // Add custom planet
    }
    
    addMoon() {
        // Add custom moon
    }
    
    addComet() {
        // Add custom comet
    }
    
    addBlackHole() {
        // Add custom black hole
    }
    
    clearAll() {
        this.customObjects = [];
    }
    
    update(deltaTime) {
        // Update sandbox objects
    }
}

export { GameModeManager };