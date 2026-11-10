(() => {
  const intro = document.getElementById('cinematic-intro');
  if (!intro) return;

  const reduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  try {
    if (sessionStorage.getItem('favourIntroSeen') === '1') {
  window.location.replace('../index.html');
  return;
}

    sessionStorage.setItem('favourIntroSeen', '1');
  } catch (_) {}

  const hello = document.getElementById('intro-hello');
  const manifesto = document.getElementById('intro-manifesto');
  const locationLabel = document.getElementById('intro-location-label');
  const locationCity = document.getElementById('intro-location-city');
  const locationCoords = document.getElementById('intro-location-coords');
  const cubeContainer = intro.querySelector('.intro-curtain');

  const finalHello = 'Hello.';
  const phrase = 'Create with purpose. Solve with precision. Build with vision.';

  const typeText = (element, value, speed, done) => {
    let index = 0;

    const timer = window.setInterval(() => {
      element.textContent = value.slice(0, ++index);

      if (index >= value.length) {
        window.clearInterval(timer);
        if (done) done();
      }
    }, speed);

    return timer;
  };

  /* =====================================
     3D CUBE GENERATOR
  ===================================== */

  const createCubeTransition = () => {
    if (!cubeContainer) {
      intro.remove();
      return;
    }

    cubeContainer.replaceChildren();

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const columns = Math.ceil(screenWidth / 90);
    const rows = Math.ceil(screenHeight / 90);

    const cellWidth = screenWidth / columns;
    const cellHeight = screenHeight / rows;

    const depth = Math.min(18, cellWidth * 0.2, cellHeight * 0.2);
    const halfDepth = depth / 2;

    const colors = [
      '#080607',
      '#10070b',
      '#17080e',
      '#260b17',
      '#401126',
      '#601a35',
      '#801f40',
      '#32101e'
    ];

    const random = (min, max) =>
      Math.random() * (max - min) + min;

    const makeFace = (className, width, height, transform) => {
      const face = document.createElement('span');
      face.className = `intro-cube-face ${className}`;

      face.style.width = `${width}px`;
      face.style.height = `${height}px`;
      face.style.transform = transform;

      return face;
    };

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const cube = document.createElement('div');

        const x = column * cellWidth;
        const y = row * cellHeight;

        const frontColor =
          colors[Math.floor(Math.random() * colors.length)];

        cube.className = 'intro-cube';

        cube.style.left = `${x}px`;
        cube.style.top = `${y}px`;
        cube.style.width = `${cellWidth + 1}px`;
        cube.style.height = `${cellHeight + 1}px`;

        cube.style.setProperty('--cube-front', frontColor);
        cube.style.setProperty('--cube-depth-half', `${halfDepth}px`);

        cube.style.setProperty(
          '--cube-duration',
          `${random(0.85, 1.25)}s`
        );

        cube.style.setProperty(
          '--cube-delay',
          `${random(0, 0.28)}s`
        );

        /* Different departure directions */

        const direction = Math.random() < 0.5 ? -1 : 1;

        cube.style.setProperty(
          '--cube-x',
          `${random(120, 650) * direction}px`
        );

        cube.style.setProperty(
          '--cube-y',
          `${random(-550, 550)}px`
        );

        cube.style.setProperty(
          '--cube-z',
          `${random(250, 1100)}px`
        );

        cube.style.setProperty(
          '--cube-rx',
          `${random(-1, 1)}`
        );

        cube.style.setProperty(
          '--cube-ry',
          `${random(-1, 1)}`
        );

        cube.style.setProperty(
          '--cube-rz',
          `${random(-1, 1)}`
        );

        cube.style.setProperty(
          '--cube-rotation',
          `${random(100, 720)}deg`
        );

        /* Front and back faces */

        cube.appendChild(
          makeFace(
            'intro-cube-front',
            cellWidth + 1,
            cellHeight + 1,
            `translateZ(${halfDepth}px)`
          )
        );

        cube.appendChild(
          makeFace(
            'intro-cube-back',
            cellWidth + 1,
            cellHeight + 1,
            `rotateY(180deg) translateZ(${halfDepth}px)`
          )
        );

        /* Left and right faces */

        cube.appendChild(
          makeFace(
            'intro-cube-left',
            depth,
            cellHeight + 1,
            `rotateY(-90deg) translateZ(${cellWidth / 2}px)`
          )
        );

        cube.appendChild(
          makeFace(
            'intro-cube-right',
            depth,
            cellHeight + 1,
            `rotateY(90deg) translateZ(${cellWidth / 2}px)`
          )
        );

        /* Top and bottom faces */

        cube.appendChild(
          makeFace(
            'intro-cube-top',
            cellWidth + 1,
            depth,
            `rotateX(90deg) translateZ(${cellHeight / 2}px)`
          )
        );

        cube.appendChild(
          makeFace(
            'intro-cube-bottom',
            cellWidth + 1,
            depth,
            `rotateX(-90deg) translateZ(${cellHeight / 2}px)`
          )
        );

        cubeContainer.appendChild(cube);
      }
    }

    /* Wait until the animation has actually finished */

    let finished = false;

    const finish = () => {
  if (finished) return;
  finished = true;

  sessionStorage.setItem('favourIntroSeen', '1');
  window.location.replace('../index.html');
};

    const longestDuration = 1800;

    window.setTimeout(finish, longestDuration);
  };

  /* =====================================
     INTRO LOCATION TEXT
  ===================================== */

  typeText(locationLabel, 'LOCATION', 85);

  window.setTimeout(
    () => typeText(
      locationCity,
      'FEDERAL CAPITAL TERRITORY, ABUJA',
      48
    ),
    420
  );

  window.setTimeout(
    () => typeText(
      locationCoords,
      '9.0765° N   7.3986° E',
      62
    ),
    2050
  );

  /* =====================================
     REDUCED MOTION
  ===================================== */

  if (reduced) {
    hello.textContent = finalHello;

    locationLabel.textContent = 'LOCATION';
    locationCity.textContent = 'FEDERAL CAPITAL TERRITORY, ABUJA';
    locationCoords.textContent = '9.0765° N   7.3986° E';

    intro.classList.add(
      'hello-settled',
      'hello-zoomed',
      'hello-raised',
      'name-revealed',
      'name-raised',
      'manifesto-visible'
    );

    manifesto.textContent = phrase;

    window.setTimeout(() => {
  sessionStorage.setItem('favourIntroSeen', '1');
  window.location.replace('../index.html');
}, 300);

    return;
  }

  /* =====================================
     HELLO LETTER ROLL
  ===================================== */

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let frame = 0;

  const roll = window.setInterval(() => {
    frame++;

    const settled = Math.min(
      finalHello.length,
      Math.max(0, Math.floor((frame - 18) / 7))
    );

    let display = '';

    for (let i = 0; i < finalHello.length; i++) {
      display += i < settled
        ? finalHello[i]
        : alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    hello.textContent = display;

    if (settled === finalHello.length) {
      window.clearInterval(roll);
      hello.textContent = finalHello;

      intro.classList.add('hello-settled');

      window.setTimeout(
        () => intro.classList.add('hello-zoomed'),
        650
      );

      window.setTimeout(() => {
        intro.classList.add('hello-raised', 'name-revealed');
      }, 2100);

      window.setTimeout(() => {
        intro.classList.add('name-raised', 'manifesto-visible');
      }, 3850);

      window.setTimeout(() => {
        let i = 0;

        const type = window.setInterval(() => {
          manifesto.textContent = phrase.slice(0, ++i);

          if (i >= phrase.length) {
            window.clearInterval(type);

            window.setTimeout(() => {
              intro.classList.add('is-exiting');
              createCubeTransition();
            }, 1000);
          }
        }, 65);
      }, 4300);
    }
  }, 65);
})();