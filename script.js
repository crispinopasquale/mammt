// 3D T-Shirt Customizer
let scene, camera, renderer, tshirt, controls;
let appliedGraphics = [];
let selectedGraphic = null;
let currentView = 'front';
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let isDragging = false;

// Predefined graphics
const predefinedGraphics = [
    { name: 'Logo 1', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkYwMDY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TE9HTzwvdGV4dD4KPC9zdmc+' },
    { name: 'Stella', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01MCAyTDU4IDM4SDk4TDY2IDYyTDc0IDk4TDUwIDc0TDI2IDk4TDM0IDYyTDIgMzhINDJMNTAgMloiIGZpbGw9IiMwMEZGRkYiLz4KPC9zdmc+' },
    { name: 'Cuore', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01MCAyNUMyNSAxMCAxMCAyNSAxMCA0MEM5IDY1IDUwIDkwIDUwIDkwUzkyIDY1IDkwIDQwQzkwIDI1IDc1IDEwIDUwIDI1WiIgZmlsbD0iI0ZGMzMzMyIvPgo8L3N2Zz4=' },
    { name: 'Fulmine', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02MCAyTDIwIDQ1SDQwTDM1IDk4TDc1IDU1SDU1TDYwIDJaIiBmaWxsPSIjRkZGRjAwIi8+Cjwvc3ZnPg==' },
    { name: 'Smile', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjRkZEQjAwIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIzNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMzMzIi8+CjxjaXJjbGUgY3g9IjY1IiBjeT0iNDAiIHI9IjUiIGZpbGw9IiMzMzMiLz4KPHBhdGggZD0iTTMwIDY1UzQwIDc1IDUwIDc1UzY5IDY1IDcwIDY1IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==' },
    { name: 'Diamante', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01MCA1TDgwIDM1TDUwIDk1TDIwIDM1TDUwIDVaIiBmaWxsPSJ1cmwoI2dyYWQpIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwRkZGRjtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkYwMDY2O3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==' }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initThreeJS();
    loadPredefinedGraphics();
    setupEventListeners();
    
    // Hide loading spinner after initialization
    setTimeout(() => {
        document.getElementById('loadingSpinner').style.display = 'none';
    }, 1000);
});

// Initialize Three.js scene
function initThreeJS() {
    const canvas = document.getElementById('tshirtCanvas');
    const container = canvas.parentElement;
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a2a);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 3);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0x00ffff, 0.3);
    fillLight.position.set(-5, 0, 2);
    scene.add(fillLight);
    
    // Create T-shirt geometry
    createTshirt();
    
    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Mouse events for graphic interaction
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    
    // Start render loop
    animate();
}

// Create T-shirt 3D model
function createTshirt() {
    const tshirtGroup = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.BoxGeometry(2, 2.5, 0.1);
    const bodyMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.receiveShadow = true;
    tshirtGroup.add(body);
    
    // Sleeves
    const sleeveGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.1);
    const sleeveMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
    });
    
    const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
    leftSleeve.position.set(-1.4, 0.8, 0);
    leftSleeve.receiveShadow = true;
    tshirtGroup.add(leftSleeve);
    
    const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
    rightSleeve.position.set(1.4, 0.8, 0);
    rightSleeve.receiveShadow = true;
    tshirtGroup.add(rightSleeve);
    
    // Collar
    const collarGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.15, 16);
    const collarMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
    });
    const collar = new THREE.Mesh(collarGeometry, collarMaterial);
    collar.position.set(0, 1.1, 0);
    collar.rotation.x = Math.PI / 2;
    collar.receiveShadow = true;
    tshirtGroup.add(collar);
    
    tshirt = tshirtGroup;
    tshirt.userData = { graphics: [] };
    scene.add(tshirt);
}

// Load predefined graphics
function loadPredefinedGraphics() {
    const graphicsGrid = document.getElementById('graphicsGrid');
    
    predefinedGraphics.forEach((graphic, index) => {
        const graphicElement = document.createElement('div');
        graphicElement.className = 'graphic-item';
        graphicElement.innerHTML = `<img src="${graphic.url}" alt="${graphic.name}" title="${graphic.name}">`;
        graphicElement.addEventListener('click', () => selectPredefinedGraphic(graphic, index));
        graphicsGrid.appendChild(graphicElement);
    });
}

// Setup event listeners
function setupEventListeners() {
    // File input
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    
    // Color picker
    document.getElementById('tshirtColor').addEventListener('change', (e) => {
        changeTshirtColor(e.target.value);
    });
    
    // Graphic controls
    document.getElementById('graphicScale').addEventListener('input', (e) => {
        updateGraphicScale(e.target.value);
    });
    
    document.getElementById('graphicRotation').addEventListener('input', (e) => {
        updateGraphicRotation(e.target.value);
    });
    
    document.getElementById('graphicOpacity').addEventListener('input', (e) => {
        updateGraphicOpacity(e.target.value);
    });
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showNotification('Per favore seleziona un file immagine valido', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        addGraphicToTshirt(imageUrl, file.name);
    };
    reader.readAsDataURL(file);
}

// Select predefined graphic
function selectPredefinedGraphic(graphic, index) {
    // Remove previous selection
    document.querySelectorAll('.graphic-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Select current
    document.querySelectorAll('.graphic-item')[index].classList.add('selected');
    
    addGraphicToTshirt(graphic.url, graphic.name);
}

// Add graphic to t-shirt
function addGraphicToTshirt(imageUrl, name) {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (texture) => {
        // Create graphic mesh
        const graphicGeometry = new THREE.PlaneGeometry(0.5, 0.5);
        const graphicMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const graphicMesh = new THREE.Mesh(graphicGeometry, graphicMaterial);
        
        // Position on front of t-shirt
        graphicMesh.position.set(0, 0, 0.06);
        graphicMesh.userData = {
            id: Date.now(),
            name: name,
            originalScale: 1,
            originalRotation: 0,
            originalOpacity: 1,
            view: currentView
        };
        
        tshirt.add(graphicMesh);
        appliedGraphics.push(graphicMesh);
        
        // Select this graphic
        selectGraphic(graphicMesh);
        
        // Update UI
        updateAppliedGraphicsList();
        showNotification(`Grafica "${name}" aggiunta con successo!`, 'success');
    }, undefined, (error) => {
        showNotification('Errore nel caricamento della grafica', 'error');
        console.error('Error loading texture:', error);
    });
}

// Select graphic for editing
function selectGraphic(graphic) {
    selectedGraphic = graphic;
    
    // Update controls
    const selectedGraphicPanel = document.getElementById('selectedGraphic');
    selectedGraphicPanel.style.display = 'block';
    
    // Update control values
    document.getElementById('graphicScale').value = graphic.scale?.x || 1;
    document.getElementById('scaleValue').textContent = (graphic.scale?.x || 1).toFixed(1);
    
    document.getElementById('graphicRotation').value = (graphic.rotation.z * 180 / Math.PI) || 0;
    document.getElementById('rotationValue').textContent = Math.round(graphic.rotation.z * 180 / Math.PI) + '°';
    
    document.getElementById('graphicOpacity').value = graphic.material.opacity || 1;
    document.getElementById('opacityValue').textContent = Math.round((graphic.material.opacity || 1) * 100) + '%';
    
    // Highlight in applied graphics list
    updateAppliedGraphicsList();
}

// Update graphic scale
function updateGraphicScale(value) {
    if (!selectedGraphic) return;
    
    const scale = parseFloat(value);
    selectedGraphic.scale.set(scale, scale, 1);
    document.getElementById('scaleValue').textContent = scale.toFixed(1);
    updateAppliedGraphicsList();
}

// Update graphic rotation
function updateGraphicRotation(value) {
    if (!selectedGraphic) return;
    
    const rotation = parseFloat(value) * Math.PI / 180;
    selectedGraphic.rotation.z = rotation;
    document.getElementById('rotationValue').textContent = Math.round(parseFloat(value)) + '°';
    updateAppliedGraphicsList();
}

// Update graphic opacity
function updateGraphicOpacity(value) {
    if (!selectedGraphic) return;
    
    const opacity = parseFloat(value);
    selectedGraphic.material.opacity = opacity;
    document.getElementById('opacityValue').textContent = Math.round(opacity * 100) + '%';
    updateAppliedGraphicsList();
}

// Remove selected graphic
function removeSelectedGraphic() {
    if (!selectedGraphic) return;
    
    tshirt.remove(selectedGraphic);
    appliedGraphics = appliedGraphics.filter(g => g !== selectedGraphic);
    
    selectedGraphic = null;
    document.getElementById('selectedGraphic').style.display = 'none';
    
    updateAppliedGraphicsList();
    showNotification('Grafica rimossa', 'success');
}

// Update applied graphics list
function updateAppliedGraphicsList() {
    const list = document.getElementById('appliedGraphicsList');
    list.innerHTML = '';
    
    if (appliedGraphics.length === 0) {
        list.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Nessuna grafica applicata</p>';
        return;
    }
    
    appliedGraphics.forEach((graphic, index) => {
        const item = document.createElement('div');
        item.className = `applied-graphic-item ${graphic === selectedGraphic ? 'selected' : ''}`;
        
        // Create a small preview canvas
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        
        if (graphic.material.map && graphic.material.map.image) {
            ctx.drawImage(graphic.material.map.image, 0, 0, 40, 40);
        } else {
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, 40, 40);
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('IMG', 20, 25);
        }
        
        item.innerHTML = `
            <img src="${canvas.toDataURL()}" alt="${graphic.userData.name}">
            <div class="applied-graphic-info">
                <h4>${graphic.userData.name}</h4>
                <p>Scala: ${(graphic.scale.x).toFixed(1)} • Opacità: ${Math.round(graphic.material.opacity * 100)}%</p>
            </div>
        `;
        
        item.addEventListener('click', () => selectGraphic(graphic));
        list.appendChild(item);
    });
}

// Change t-shirt color
function changeTshirtColor(color) {
    if (!tshirt) return;
    
    tshirt.children.forEach(child => {
        if (child.material) {
            child.material.color.setHex(color.replace('#', '0x'));
        }
    });
    
    document.getElementById('tshirtColor').value = color;
}

// Set view (front/back)
function setView(view) {
    currentView = view;
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === view) {
            btn.classList.add('active');
        }
    });
    
    // Rotate camera
    if (view === 'front') {
        controls.reset();
        camera.position.set(0, 0, 3);
    } else {
        controls.reset();
        camera.position.set(0, 0, -3);
        camera.lookAt(0, 0, 0);
    }
    
    controls.update();
}

// Mouse interaction handlers
function onMouseDown(event) {
    event.preventDefault();
    
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(appliedGraphics);
    
    if (intersects.length > 0) {
        const graphic = intersects[0].object;
        selectGraphic(graphic);
        isDragging = true;
        controls.enabled = false;
    }
}

function onMouseMove(event) {
    if (!isDragging || !selectedGraphic) return;
    
    event.preventDefault();
    
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    // Project mouse position onto t-shirt surface
    const tshirtIntersects = raycaster.intersectObject(tshirt.children[0]); // Main body
    if (tshirtIntersects.length > 0) {
        const point = tshirtIntersects[0].point;
        selectedGraphic.position.x = point.x;
        selectedGraphic.position.y = point.y;
        selectedGraphic.position.z = point.z + 0.01;
    }
}

function onMouseUp(event) {
    isDragging = false;
    controls.enabled = true;
}

// Window resize handler
function onWindowResize() {
    const container = document.getElementById('tshirtCanvas').parentElement;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Export design
function exportDesign() {
    // Create a higher resolution render for export
    const exportRenderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    exportRenderer.setSize(1024, 1024);
    exportRenderer.setClearColor(0x2a2a2a);
    
    // Render the scene
    exportRenderer.render(scene, camera);
    
    // Create download link
    const canvas = exportRenderer.domElement;
    const link = document.createElement('a');
    link.download = 'tshirt-design.png';
    link.href = canvas.toDataURL();
    link.click();
    
    // Cleanup
    exportRenderer.dispose();
    
    showNotification('Design esportato con successo!', 'success');
}

// Reset design
function resetDesign() {
    if (confirm('Sei sicuro di voler resettare tutto il design?')) {
        // Remove all graphics
        appliedGraphics.forEach(graphic => {
            tshirt.remove(graphic);
        });
        appliedGraphics = [];
        selectedGraphic = null;
        
        // Reset t-shirt color
        changeTshirtColor('#ffffff');
        
        // Reset view
        setView('front');
        
        // Update UI
        document.getElementById('selectedGraphic').style.display = 'none';
        updateAppliedGraphicsList();
        
        // Remove selections
        document.querySelectorAll('.graphic-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        showNotification('Design resettato', 'success');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.className = `notification show ${type}`;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        closeNotification();
    }, 3000);
}

function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
}

// Initialize tooltips and help
function initializeHelp() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' && selectedGraphic) {
            removeSelectedGraphic();
        }
        if (e.key === 'Escape') {
            selectedGraphic = null;
            document.getElementById('selectedGraphic').style.display = 'none';
            updateAppliedGraphicsList();
        }
    });
}

// Call help initialization
initializeHelp();

console.log('🎨 3D T-Shirt Customizer loaded successfully!');
console.log('📝 Instructions:');
console.log('   • Click on predefined graphics or upload your own PNG files');
console.log('   • Drag graphics on the t-shirt to reposition them');
console.log('   • Use the controls panel to adjust size, rotation, and opacity');
console.log('   • Press Delete to remove selected graphic');
console.log('   • Press Escape to deselect graphic');