/* ========================================================
   TANUJ CHANDRA - 3D DEVSECOPS COMMAND CENTER INTERACTIVITY
   Powered by Three.js, GSAP, Web Audio API, and Vanilla JS
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThreeScene();
  initTiltEffect();
  initPipelineTelemetry();
  initTerminal();
  initAuditModal();
  initAudioSynthesizer();
  initCounters();
  initNavigationHighlight();
});

/* ========================================================
   1. THREE.JS 3D DEVSECOPS SECURITY CORE SCENE
   ======================================================== */
let scene, camera, renderer, securityCore, outerRings, orbitalNodesGroup, particles;
let targetMouseX = 0, targetMouseY = 0;
let mouseX = 0, mouseY = 0;
let isAudioMuted = false;

function initThreeScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06080d, 0.015);

  // Camera
  camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
  camera.position.set(0, 0, 32);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambientLight = new THREE.AmbientLight(0x00f2fe, 0.6);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00f2fe, 2.5, 80);
  pointLight1.position.set(15, 15, 20);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x9d4edd, 2, 70);
  pointLight2.position.set(-15, -15, 15);
  scene.add(pointLight2);

  const greenLight = new THREE.PointLight(0x00f5a0, 1.8, 60);
  greenLight.position.set(0, 20, -10);
  scene.add(greenLight);

  // 1. Central Quantum Security Shield (Icosahedron Core)
  const coreGroup = new THREE.Group();
  coreGroup.position.set(width > 1024 ? 9.2 : 0, 0, 0);
  scene.add(coreGroup);
  securityCore = coreGroup;

  // Solid inner glowing core
  const innerGeo = new THREE.IcosahedronGeometry(4.4, 1);
  const innerMat = new THREE.MeshPhongMaterial({
    color: 0x091e36,
    emissive: 0x00f2fe,
    emissiveIntensity: 0.55,
    wireframe: false,
    shininess: 100
  });
  const innerCore = new THREE.Mesh(innerGeo, innerMat);
  coreGroup.add(innerCore);

  // Outer Holographic Wireframe
  const wireGeo = new THREE.IcosahedronGeometry(5.6, 2);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  coreGroup.add(wireMesh);

  // 2. Rotating Cybernetic Defense Rings
  outerRings = new THREE.Group();
  coreGroup.add(outerRings);

  const ring1Geo = new THREE.TorusGeometry(7.2, 0.06, 16, 100);
  const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.85 });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  outerRings.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(8.4, 0.05, 16, 100);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x9d4edd, transparent: true, opacity: 0.75 });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI / 2.8;
  outerRings.add(ring2);

  const ring3Geo = new THREE.TorusGeometry(9.6, 0.05, 16, 100);
  const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x00f5a0, transparent: true, opacity: 0.75 });
  const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
  ring3.rotation.y = Math.PI / 3;
  outerRings.add(ring3);

  // 3. Orbiting Satellite Nodes (DevSecOps Pillars)
  orbitalNodesGroup = new THREE.Group();
  coreGroup.add(orbitalNodesGroup);

  const nodeData = [
    { name: 'cloud', color: 0x4facfe, radius: 10.5, speed: 0.012, angle: 0 },
    { name: 'k8s', color: 0x00f2fe, radius: 11.8, speed: 0.010, angle: 1.2 },
    { name: 'pipeline', color: 0x00f5a0, radius: 13.0, speed: 0.014, angle: 2.4 },
    { name: 'policy', color: 0x9d4edd, radius: 11.2, speed: 0.009, angle: 3.6 },
    { name: 'runtime', color: 0xff3366, radius: 12.5, speed: 0.015, angle: 4.8 }
  ];

  const nodeMeshes = [];
  nodeData.forEach(data => {
    const nodeGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: data.color,
      emissive: data.color,
      emissiveIntensity: 1.0,
      roughness: 0.1
    });
    const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
    nodeMesh.userData = data;

    // Pulsing halo around orbital node
    const haloGeo = new THREE.RingGeometry(0.9, 1.15, 24);
    const haloMat = new THREE.MeshBasicMaterial({ color: data.color, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    nodeMesh.add(halo);

    orbitalNodesGroup.add(nodeMesh);
    nodeMeshes.push(nodeMesh);
  });

  // 4. Floating 3D Telemetry Particle Matrix
  const particleCount = 1400;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0x00f2fe),
    new THREE.Color(0x4facfe),
    new THREE.Color(0x9d4edd),
    new THREE.Color(0x00f5a0)
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.28,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // 5. Undulating Cyber Grid Matrix Floor
  const gridHelper = new THREE.GridHelper(160, 80, 0x00f2fe, 0x0c223a);
  gridHelper.position.y = -18;
  scene.add(gridHelper);

  // Drag interaction variables
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  window.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    if (isDragging && securityCore) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      securityCore.rotation.y += deltaX * 0.008;
      securityCore.rotation.x += deltaY * 0.008;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch support for mobile devices
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length > 0 && securityCore) {
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      securityCore.rotation.y += deltaX * 0.008;
      securityCore.rotation.x += deltaY * 0.008;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  // Resize handler
  window.addEventListener('resize', onWindowResize);

  // Orbital Pill Button listeners (Camera Navigation in 3D)
  document.querySelectorAll('.node-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      playSynthBeep(880, 'sine', 0.1);
      const targetNodeKey = pill.getAttribute('data-node');
      document.querySelectorAll('.node-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (window.gsap) {
        gsap.to(securityCore.rotation, {
          y: securityCore.rotation.y + Math.PI,
          duration: 1.2,
          ease: 'power3.out'
        });

        gsap.to(camera.position, {
          z: targetNodeKey === 'all' ? 32 : 24,
          duration: 0.9,
          ease: 'power2.inOut'
        });
      }
    });
  });

  // Start Animation Loop
  animateScene(nodeMeshes, innerCore, wireMesh, ring1, ring2, ring3);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  if (securityCore) {
    securityCore.position.x = width > 1024 ? 9.2 : 0;
  }
}

function animateScene(nodeMeshes, innerCore, wireMesh, ring1, ring2, ring3) {
  requestAnimationFrame(() => animateScene(nodeMeshes, innerCore, wireMesh, ring1, ring2, ring3));

  // Smooth mouse interpolation
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  // Active continuous rotation
  if (securityCore) {
    securityCore.rotation.y += 0.008;
    securityCore.rotation.x += (mouseY * 0.35 - securityCore.rotation.x) * 0.02;
  }

  // Pulsing geometry
  if (innerCore) {
    const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.06;
    innerCore.scale.set(pulse, pulse, pulse);
  }

  if (wireMesh) {
    wireMesh.rotation.x += 0.005;
    wireMesh.rotation.z += 0.004;
  }

  if (ring1) ring1.rotation.z += 0.015;
  if (ring2) ring2.rotation.y += 0.012;
  if (ring3) ring3.rotation.x += 0.018;

  // Update Orbiting Satellite Nodes
  if (nodeMeshes && nodeMeshes.length > 0) {
    nodeMeshes.forEach(node => {
      node.userData.angle += node.userData.speed;
      node.position.x = Math.cos(node.userData.angle) * node.userData.radius;
      node.position.z = Math.sin(node.userData.angle) * node.userData.radius;
      node.position.y = Math.sin(node.userData.angle * 2) * 2.2;
    });
  }

  // Drift particles
  if (particles) {
    particles.rotation.y -= 0.0008;
    particles.position.x = mouseX * 2.5;
    particles.position.y = mouseY * 2.5;
  }

  renderer.render(scene, camera);
}

/* ========================================================
   2. VANILLA JS 3D CARD TILT EFFECT
   ======================================================== */
function initTiltEffect() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ========================================================
   3. DEVSECOPS PIPELINE TELEMETRY DATA & INTERACTION
   ======================================================== */
const pipelineData = {
  1: {
    title: "STAGE 1: CODE & COMMIT (SHIFT-LEFT PRE-COMMIT)",
    badge: "POLICY: ENFORCED",
    code: `[INIT] Pre-commit Git Hook initialized with 14 security rules.
[SCAN] Gitleaks secret detection: 0 entropy leaks discovered.
[LINT] Semgrep AST static code analysis: 0 High/Critical findings.
[CHECK] Conventional commits checked: compliant with cryptographic provenance trail.
[RESULT] Verification Complete: Commit signed with GPG key ID [0x4F8A9B2C]. Ready for CI pipeline ingestion.`
  },
  2: {
    title: "STAGE 2: SAST, SCA & DEPENDENCY HARDENING",
    badge: "GATE: PASSED (ZERO HIGH/CRIT)",
    code: `[SAST] SonarQube Enterprise Engine: Clean Code Gate PASSED.
       - Vulnerabilities: 0
       - Security Hotspots Reviewed: 100%
       - Code Smells Debt: 0.4% (Threshold < 5.0%)
[SCA]  Snyk Open Source Dependency Engine:
       - 1,420 dependencies evaluated against National Vulnerability Database (NVD).
       - Zero CVEs rated CVSS >= 7.0 found.
       - License compliance: Permissive (Apache-2.0, MIT only).`
  },
  3: {
    title: "STAGE 3: SECURE BUILD, SBOM & CRYPTOGRAPHIC ATTESTATION",
    badge: "SLSA LEVEL 3 COMPLIANT",
    code: `[CONTAINER] Multi-stage distroless scratch build triggered.
[CVE SCAN]  Trivy Container Vulnerability Scanner:
            - Scanned layers: 4 | Critical: 0 | High: 0 | Medium: 0
[SBOM]      Syft generated SPDX / CycloneDX bill-of-materials artifact.
[SIGN]      Cosign / Sigstore Keyless Signing:
            - Cryptographic signature attached via OIDC identity.
            - Rekor transparency log entry: UUID #7a89f30-b21c-4e89-a2e1`
  },
  4: {
    title: "STAGE 4: POLICY AS CODE & INFRASTRUCTURE AUDIT",
    badge: "OPA REGO: 100% PASS",
    code: `[OPA]     Open Policy Agent (Rego) policy evaluation executed:
          - Rule: enforce-non-root-container: PASS
          - Rule: require-resource-limits: PASS
          - Rule: disallow-privileged-escalation: PASS
[CHECKOV] Terraform HCL Static Security Audit:
          - 148 cloud security checks validated.
          - CIS AWS Foundation Benchmark v1.4: 100% Compliance.
          - S3 bucket encryption, KMS CMK rotation, and PrivateLink verified.`
  },
  5: {
    title: "STAGE 5: KUBERNETES GITOPS & ADMISSION CONTROLLER",
    badge: "ZERO-TRUST VERIFIED",
    code: `[GITOPS]    ArgoCD sync initiated -> Cluster target: production-us-east-1.
[ADMISSION] Kyverno validating webhook:
            - Cosign signature verification: SUCCESS
            - Image verified against internal trusted registry.
            - Ingress mTLS enforcement: Linkerd/Istio STRICT mode injected.
            - Cilium eBPF NetworkPolicy deployed: Default-Deny ingress/egress enabled.`
  },
  6: {
    title: "STAGE 6: RUNTIME OBSERVABILITY & eBPF THREAT DEFENSE",
    badge: "LIVE KERNEL MONITORING",
    code: `[RUNTIME] Falco eBPF kernel event stream active:
          - Syscall monitoring: 0 unauthorized privilege escalations.
          - Shell spawn in production container: 0 detected.
[SIEM]    Real-time security telemetry streamed to Splunk & Datadog APM.
[STATUS]  Steady-State SLA: 99.99% | MTTR Target: < 15 Minutes.
[DEFENSE] Zero-Trust Perimeter status: FORTIFIED.`
  }
};

function initPipelineTelemetry() {
  const nodes = document.querySelectorAll('.pipeline-node');
  const titleEl = document.getElementById('tel-title');
  const badgeEl = document.getElementById('tel-badge');
  const codeEl = document.getElementById('tel-code');

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      playSynthBeep(620, 'square', 0.08);
      const stage = node.getAttribute('data-stage');
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      if (pipelineData[stage]) {
        titleEl.innerHTML = `<i class="fa-solid fa-satellite"></i> ${pipelineData[stage].title}`;
        badgeEl.textContent = pipelineData[stage].badge;
        codeEl.innerHTML = `<code>${pipelineData[stage].code}</code>`;
      }
    });
  });
}

/* ========================================================
   4. INTERACTIVE CYBER TERMINAL CLI
   ======================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const shortcutButtons = document.querySelectorAll('.term-btn');

  if (!input || !output) return;

  const terminalCommands = {
    help: `Available DevSecOps Commands:
  • skills         - Displays technical arsenal and security tools
  • experience     - Prints 12-year career trajectory summary
  • certs          - Lists verified security and cloud credentials
  • scan           - Runs simulated live security scan
  • pipeline       - Outlines Shift-Left CI/CD lifecycle
  • contact        - Displays direct transmission coordinates
  • whoami         - Prints identity and mission statement
  • clear          - Wipes terminal screen buffer`,

    whoami: `Tanuj Chandra — Lead DevSecOps Architect & Zero-Trust Specialist.
12+ Years Enterprise Experience in Kubernetes Defense, Cloud Security, and Supply Chain Integrity.`,

    skills: `[CLOUD & IaC]       AWS, Microsoft Azure, Google Cloud, Terraform, OpenTofu, Terragrunt, Ansible
[CONTAINER & K8S]   Kubernetes, Docker, Helm, ArgoCD, Cilium (eBPF), Falco, Istio
[APPSEC & SUPPLY]   Snyk, SonarQube, Trivy, Checkov, HashiCorp Vault, Cosign, GitGuardian
[POLICY & GOV]      Open Policy Agent (Rego), Kyverno, DefectDojo, CIS Benchmarks, SOC 2
[LANGUAGES]         Python, Go (Golang), Bash, PowerShell, YAML`,

    experience: `[2022 - PRESENT]  Staff/Principal Lead DevSecOps Architect - Zero-Trust & SLSA Level 3
[2018 - 2022]     Senior DevSecOps Engineer - Multi-Tenant K8s & Vault Automation
[2015 - 2018]     Cloud DevOps Specialist - AWS Migration & Infrastructure as Code
[2012 - 2015]     Systems & Network Security Engineer - Linux Kernel Hardening & Firewalls`,

    certs: `[VERIFIED CREDENTIALS]
  ✓ Certified Kubernetes Security Specialist (CKS) - CNCF
  ✓ Certified Kubernetes Administrator (CKA) - CNCF
  ✓ AWS Certified Security – Specialty - Amazon Web Services
  ✓ AWS Certified Solutions Architect – Professional - Amazon Web Services
  ✓ HashiCorp Certified: Terraform Associate - HashiCorp
  ✓ CISSP Knowledge & Curriculum Alignment`,

    pipeline: `DevSecOps Pipeline Lifecycle:
  1. Commit Hook -> Gitleaks & Semgrep AST
  2. CI Build    -> SonarQube Quality Gate & Snyk SCA
  3. Artifact    -> Trivy Scan, CycloneDX SBOM, Cosign Signing
  4. IaC Audit   -> Checkov & OPA Rego Policies
  5. Deployment  -> ArgoCD GitOps & Kyverno Admission Webhook
  6. Runtime     -> Falco eBPF Kernel Threat Detection & Splunk SIEM`,

    contact: `Direct Transmission Coordinates:
  • Email:    tanujchandra@gmail.com
  • LinkedIn: https://www.linkedin.com/in/tanujchandra
  • GitHub:   https://github.com/tanujchandra`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    playSynthBeep(440, 'sine', 0.05);

    // Echo input
    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="output-accent">secops@tanujchandra:~$</span> ${rawCmd}`;
    output.appendChild(userLine);

    if (cmd === 'clear') {
      output.innerHTML = '';
      return;
    }

    if (cmd === 'scan') {
      openSecurityAuditModal();
      return;
    }

    const response = terminalCommands[cmd] || `Command not found: "${cmd}". Type 'help' to view valid commands.`;
    const responseLine = document.createElement('div');
    responseLine.className = 'term-line ' + (terminalCommands[cmd] ? 'output-green' : 'output-red');
    responseLine.textContent = response;
    output.appendChild(responseLine);

    output.scrollTop = output.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
    }
  });

  shortcutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

/* ========================================================
   5. LIVE SECURITY AUDIT SIMULATION MODAL
   ======================================================== */
function initAuditModal() {
  const runBtn = document.getElementById('run-live-scan-btn');
  const closeBtn = document.getElementById('audit-modal-close');
  const doneBtn = document.getElementById('audit-done-btn');
  const backdrop = document.getElementById('audit-modal');

  if (runBtn) {
    runBtn.addEventListener('click', openSecurityAuditModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSecurityAuditModal);
  }

  if (doneBtn) {
    doneBtn.addEventListener('click', closeSecurityAuditModal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeSecurityAuditModal();
    });
  }
}

function openSecurityAuditModal() {
  const modal = document.getElementById('audit-modal');
  const fill = document.getElementById('audit-progress-fill');
  const statusText = document.getElementById('audit-status-text');
  const term = document.getElementById('audit-terminal');
  const doneBtn = document.getElementById('audit-done-btn');

  if (!modal || !fill || !statusText || !term) return;

  modal.classList.add('active');
  fill.style.width = '0%';
  term.innerHTML = '';
  doneBtn.style.display = 'none';

  playSynthBeep(520, 'triangle', 0.12);

  const steps = [
    { progress: 15, text: "Scanning Git commits and repository history for secrets (Gitleaks)...", delay: 400 },
    { progress: 35, text: "Running Static Application Security Testing (Semgrep & SonarQube)...", delay: 900 },
    { progress: 55, text: "Evaluating Software Bill of Materials (SBOM) and open-source licenses...", delay: 1500 },
    { progress: 75, text: "Auditing multi-cloud Infrastructure as Code (Checkov CIS AWS v1.4)...", delay: 2100 },
    { progress: 90, text: "Validating Kubernetes Pod Security Standards & Kyverno Admission Webhooks...", delay: 2700 },
    { progress: 100, text: "AUDIT COMPLETE: 0 Critical / 0 High Vulnerabilities Found. Zero-Trust Certified.", delay: 3300 }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      fill.style.width = step.progress + '%';
      statusText.textContent = step.text;

      const log = document.createElement('div');
      log.className = 'term-line ' + (step.progress === 100 ? 'output-green' : 'output-accent');
      log.textContent = `[${new Date().toLocaleTimeString()}] ${step.text}`;
      term.appendChild(log);
      term.scrollTop = term.scrollHeight;

      playSynthBeep(300 + step.progress * 4, 'sine', 0.04);

      if (step.progress === 100) {
        doneBtn.style.display = 'block';
        playSynthBeep(880, 'sine', 0.2);
      }
    }, step.delay);
  });
}

function closeSecurityAuditModal() {
  const modal = document.getElementById('audit-modal');
  if (modal) modal.classList.remove('active');
}

/* ========================================================
   6. WEB AUDIO API SYNTHESIZER (NO EXTERNAL AUDIO FILES)
   ======================================================== */
let audioCtx = null;

function initAudioSynthesizer() {
  const soundBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      isAudioMuted = !isAudioMuted;
      if (isAudioMuted) {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundBtn.style.opacity = '0.5';
      } else {
        soundIcon.className = 'fa-solid fa-volume-high';
        soundBtn.style.opacity = '1';
        playSynthBeep(587, 'sine', 0.1);
      }
    });
  }
}

function playSynthBeep(freq = 440, type = 'sine', duration = 0.08) {
  if (isAudioMuted) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Audio context silently ignored if restricted by browser gesture policy
  }
}

/* ========================================================
   7. ANIMATED TELEMETRY COUNTERS
   ======================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let hasAnimated = false;

  function runCounters() {
    if (hasAnimated) return;
    hasAnimated = true;

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const step = Math.max(1, Math.floor(target / 40));

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = count;
        }
      }, 35);
    });
  }

  // Trigger when visible
  window.addEventListener('scroll', () => {
    const kpiSection = document.getElementById('kpi-grid');
    if (kpiSection) {
      const rect = kpiSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.85) {
        runCounters();
      }
    }
  }, { passive: true });

  // Initial trigger check
  runCounters();
}

/* ========================================================
   8. HUD NAVIGATION HIGHLIGHT ON SCROLL
   ======================================================== */
function initNavigationHighlight() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.hud-nav .nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}
