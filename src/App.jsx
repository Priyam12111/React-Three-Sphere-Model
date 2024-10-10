import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from "gsap";
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './App.css'
const App = () => {

  const canvasRef = useRef(null);
  const navRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    // Scene
    const scene = new THREE.Scene();

    // Shape
    const sphere = new THREE.SphereGeometry(3, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: '##00ff00',
    });
    const mesh = new THREE.Mesh(sphere, material);
    scene.add(mesh);

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }


    // Lights
    const light = new THREE.SpotLight('#32a852', 300, 100);
    light.position.set(0, 10, 10);
    scene.add(light);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 3, 10);
    camera.position.z = 10;
    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(2);
    renderer.render(scene, camera);

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;


    // Rerendering for infinite times
    const loop = () => {
      controls.update()
      renderer.render(scene, camera)
    }
    setInterval(() => {
      loop()
    }, 0);

    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      renderer.setSize(sizes.width, sizes.height)
    })

    const tl = gsap.timeline({ defaults: { duration: 1 } })
    tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
    tl.fromTo(navRef.current, { y: "-100px" }, { y: "100%" })
    let rgb = [0, 0, 0];
    let mouseDown = false;
    window.addEventListener('mousedown', () => mouseDown = true)
    window.addEventListener('mouseup', () => mouseDown = false)
    window.addEventListener('mousemove', (e) => {
      if (mouseDown) {
        rgb = [
          Math.round((e.pageX / sizes.width) * 255),
          Math.round((e.pageY / sizes.height) * 255),
          150
        ]
        let newColor = new THREE.Color(`rgb(${rgb.join(',')})`)
        gsap.to(mesh.material.color, {
          r: newColor.r,
          g: newColor.g,
          b: newColor.b,
        })
      }
    })

  }, []);


  return (
    <>
      <nav className="navbar" ref={navRef}>
        <a className="navbar-brand" href="#">
          Sphere
        </a>
        <div className="right">
          <a className="navbar-brand" href="#">
            Explore
          </a>
          <a className="navbar-brand CreateBox" href="#">
            Create
          </a>
        </div>
      </nav>

      <canvas ref={canvasRef} id="WEBGL"></canvas>
    </>
  );
};

export default App;
