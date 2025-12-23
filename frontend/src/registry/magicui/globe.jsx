import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Geometry, Transform, Camera } from 'ogl';

export function Globe({ className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas,
      alpha: true,
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl);
    camera.position.set(0, 0, 2);

    const scene = new Transform();

    // Create sphere geometry
    const segments = 64;
    const radius = 0.5;
    const vertices = [];
    const indices = [];

    for (let lat = 0; lat <= segments; lat++) {
      const theta = (lat * Math.PI) / segments;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= segments; lon++) {
        const phi = (lon * 2 * Math.PI) / segments;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;

        vertices.push(x * radius, y * radius, z * radius);
      }
    }

    for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const first = lat * (segments + 1) + lon;
        const second = first + segments + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(vertices) },
      index: { data: new Uint16Array(indices) },
    });

    const vertex = `
      attribute vec3 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragment = `
      precision highp float;
      varying vec3 vPosition;
      uniform float uTime;
      
      void main() {
        vec3 color1 = vec3(0.1, 0.2, 0.4);
        vec3 color2 = vec3(0.2, 0.4, 0.8);
        
        float pattern = sin(vPosition.y * 10.0 + uTime * 0.5) * 0.5 + 0.5;
        vec3 color = mix(color1, color2, pattern);
        
        float fresnel = pow(1.0 - dot(normalize(vPosition), vec3(0.0, 0.0, 1.0)), 2.0);
        color += fresnel * 0.3;
        
        gl_FragColor = vec4(color, 0.6);
      }
    `;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    let time = 0;
    const rotationSpeed = 0.0005;
    let frame = 0;

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({
        aspect: width / height,
      });
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      time += 16;
      program.uniforms.uTime.value = time * 0.001;
      
      mesh.rotation.y += rotationSpeed;
      mesh.rotation.x = Math.sin(time * 0.0003) * 0.2;

      renderer.render({ scene, camera });
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

