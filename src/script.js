const canvas = document.getElementById('rainbow-canvas');

const ctx = canvas.getContext('2d');



const offCanvas = document.createElement('canvas');

const offCtx = offCanvas.getContext('2d');



let width, winHeight, docHeight;

let currentRevealY = 0;

let targetRevealY = 0;



const colors = [

  { r: 255, g: 75,  b: 114 },

  { r: 255, g: 138, b: 61  },

  { r: 255, g: 208, b: 52  },

  { r: 74,  g: 222, b: 128 },

  { r: 45,  g: 212, b: 191 },

  { r: 167, g: 139, b: 250 }

];



function init() {

  width = window.innerWidth;

  winHeight = window.innerHeight;

  docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

  

  canvas.width = width;

  canvas.height = winHeight;

  offCanvas.width = width;

  offCanvas.height = docHeight;



  generateMassivePastelRainbow();



  currentRevealY = 0; 

  

  requestAnimationFrame(render);

}



function generateMassivePastelRainbow() {

  const numColors = colors.length;

  

  for (let y = 0; y < docHeight; y += 2) {

    const progress = y / docHeight;

    

    const wave1 = Math.sin(progress * Math.PI * 3) * (width * 0.25);

    const wave2 = Math.cos(progress * Math.PI * 1.5) * (width * 0.1);

    const centerX = width / 2 + wave1 + wave2;

    

    const totalThickness = 100 + (progress * 350); 

    const bandWidth = totalThickness / numColors;



    for (let c = 0; c < numColors; c++) {

      const bandOffsetX = (c - numColors / 2 + 0.5) * bandWidth;

      const bandCenterX = centerX + bandOffsetX;

      const color = colors[c];



      offCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;

      offCtx.beginPath();

      offCtx.arc(bandCenterX, y, bandWidth * 0.6, 0, Math.PI * 2);

      offCtx.fill();



      const particles = 10;

      for(let p = 0; p < particles; p++) {

        const offsetX = (Math.random() + Math.random() + Math.random() - 1.5) * bandWidth * 1.2;

        const offsetY = (Math.random() - 0.5) * 8;

        const px = bandCenterX + offsetX;

        const py = y + offsetY;



        const alpha = 0.4 + Math.random() * 0.5;

        const size = 2 + Math.random() * 4;



        offCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

        offCtx.beginPath();

        offCtx.arc(px, py, size, 0, Math.PI * 2);

        offCtx.fill();

      }

    }

  }

}



function render() {

  const scrollY = window.scrollY || document.documentElement.scrollTop;

  

  const maxScroll = docHeight - winHeight;

  const scrollProgress = maxScroll > 0 ? (scrollY / maxScroll) : 0;



  const initialReveal = winHeight * 1;

  targetRevealY = initialReveal + (docHeight - initialReveal) * scrollProgress;



  currentRevealY += (targetRevealY - currentRevealY) * 0.04;



  ctx.clearRect(0, 0, width, winHeight);



  const clipHeight = Math.max(0, Math.min(winHeight, currentRevealY - scrollY));

  

  if (clipHeight > 0) {

    ctx.drawImage(

      offCanvas,

      0, scrollY, width, clipHeight, 

      0, 0, width, clipHeight        

    );

  }



  requestAnimationFrame(render);

}



window.addEventListener('resize', () => {

  clearTimeout(window.resizeTimer);

  window.resizeTimer = setTimeout(init, 200);

});



window.onload = init;

