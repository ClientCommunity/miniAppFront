export function throwConfetti() {
  const colors = ['#fbbf24', '#ec4899', '#8b5cf6', '#06b6d4', '#5fff7a'];
  for (let i = 0; i < 200; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    
    // Spawn randomly from left 30% or right 30% of the screen
    const isLeft = Math.random() > 0.5;
    const startX = isLeft 
      ? (Math.random() * (window.innerWidth * 0.3)) 
      : (window.innerWidth - Math.random() * (window.innerWidth * 0.3));
    
    confetti.style.left = startX + 'px';
    confetti.style.top = '-20px'; // Start above screen
    
    // Smaller sizes
    confetti.style.width = (Math.random() * 6 + 4) + 'px';
    confetti.style.height = (Math.random() * 12 + 6) + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    document.body.appendChild(confetti);

    // Drift towards the center
    const direction = isLeft ? 1 : -1;
    const driftX = direction * (Math.random() * 300 + 100) + (Math.random() - 0.5) * 100; 
    const endY = window.innerHeight + 100;
    const rot = (Math.random() * 1080 + 360) * direction;

    const animation = confetti.animate([
      { transform: `translate(0px, 0px) rotate(0deg) scale(0)`, opacity: 0 },
      { transform: `translate(0px, 50px) rotate(${rot * 0.1}deg) scale(1)`, opacity: 1, offset: 0.1 },
      { transform: `translate(${driftX}px, ${endY}px) rotate(${rot}deg) scale(1)`, opacity: 1 }
    ], {
      duration: Math.random() * 2500 + 2000, // Slower fall
      delay: Math.random() * 800, // Staggered start for continuous rain effect
      easing: 'ease-in',
      fill: 'forwards'
    });

    animation.onfinish = () => confetti.remove();
  }
}
