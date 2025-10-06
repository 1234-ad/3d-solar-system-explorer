# 🚀 3D Solar System Explorer

An interactive, educational 3D solar system built with Three.js featuring realistic planetary motion, particle effects, and immersive exploration.

![Solar System Preview](https://img.shields.io/badge/Three.js-Interactive-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Active-brightgreen)

## ✨ Features

### 🪐 **Realistic Solar System**
- All 8 planets with accurate relative sizes and distances
- Realistic orbital speeds and rotations
- Beautiful particle star field background
- Dynamic lighting from the Sun

### 🎮 **Interactive Controls**
- **Mouse Controls**: Click and drag to rotate view, scroll to zoom
- **Planet Selection**: Click on any planet to view detailed information
- **Speed Control**: Adjust animation speed from 0x to 5x
- **Toggle Features**: Show/hide orbits, labels, and asteroid belt

### 🌟 **Special Effects**
- **Sun Glow**: Realistic solar corona effect
- **Earth's Moon**: Orbiting lunar companion
- **Saturn's Rings**: Iconic ring system
- **Asteroid Belt**: 500+ animated asteroids between Mars and Jupiter
- **Planet Labels**: Floating name tags that follow planets

### 📊 **Educational Content**
- Detailed planet information panels
- Real astronomical data (diameter, day length, year length)
- Interesting facts about each celestial body

## 🚀 Live Demo

[**Launch Solar System Explorer**](https://1234-ad.github.io/3d-solar-system-explorer/)

## 🛠️ Technologies Used

- **Three.js** - 3D graphics and WebGL rendering
- **JavaScript ES6+** - Modern JavaScript features
- **HTML5 Canvas** - Hardware-accelerated graphics
- **CSS3** - Modern styling and animations

## 🎯 Controls

| Control | Action |
|---------|--------|
| 🖱️ **Mouse Drag** | Rotate camera around solar system |
| 🔍 **Mouse Wheel** | Zoom in/out |
| 🪐 **Click Planet** | View planet information |
| ⚡ **Speed Slider** | Control animation speed |
| 👁️ **Toggle Buttons** | Show/hide orbits, labels, asteroids |
| 🔄 **Reset View** | Return to default camera position |

## 📱 Features Breakdown

### Planet System
- **Mercury** - Closest to sun, fastest orbit
- **Venus** - Hottest planet with thick atmosphere
- **Earth** - Our home with orbiting moon
- **Mars** - The red planet
- **Jupiter** - Largest gas giant
- **Saturn** - Beautiful ring system
- **Uranus** - Ice giant tilted on its side
- **Neptune** - Windiest planet in solar system

### Visual Effects
- **Realistic Shadows** - Planets cast shadows on each other
- **Particle Systems** - 10,000+ stars in background
- **Smooth Animations** - 60fps performance
- **Responsive Design** - Works on all screen sizes

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/1234-ad/3d-solar-system-explorer.git
   cd 3d-solar-system-explorer
   ```

2. **Serve locally** (required for Three.js modules)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
3d-solar-system-explorer/
├── index.html          # Main HTML file
├── js/
│   └── main.js         # Three.js application
├── README.md           # Project documentation
└── assets/             # Future: textures, models
```

## 🎨 Customization

### Adding New Planets/Objects
```javascript
const newPlanet = {
    name: 'Pluto',
    size: 0.5,
    distance: 100,
    speed: 0.001,
    color: 0x8c7853,
    description: 'Former 9th planet, now a dwarf planet.',
    stats: 'Diameter: 2,374 km<br>Year: 248 Earth years'
};
```

### Modifying Visual Effects
- **Star Field**: Adjust `starCount` in `createStarField()`
- **Asteroid Belt**: Modify `asteroidCount` in `createAsteroidBelt()`
- **Planet Textures**: Add texture loading in planet creation
- **Lighting**: Customize `sunLight` properties

## 🌟 Future Enhancements

- [ ] **Planet Textures** - High-resolution surface textures
- [ ] **Spacecraft Paths** - Historical mission trajectories
- [ ] **Comet System** - Periodic comets with tails
- [ ] **Moons System** - Major moons for gas giants
- [ ] **VR Support** - WebXR integration
- [ ] **Sound Effects** - Ambient space audio
- [ ] **Time Travel** - Historical planet positions

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contributions
- Add planet textures and normal maps
- Implement realistic physics calculations
- Add more celestial objects (comets, moons)
- Improve mobile responsiveness
- Add educational quiz mode

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community** - Amazing 3D library
- **NASA** - Astronomical data and inspiration
- **WebGL** - Hardware-accelerated graphics
- **Open Source Community** - Continuous inspiration

## 📞 Contact

Created by [@1234-ad](https://github.com/1234-ad)

⭐ **Star this repo** if you found it helpful!

---

*Explore the cosmos from your browser! 🌌*