(() => {
  const NEPTUNE_ORBIT = 294;
  const bodies = [
    { name:"Mercury", file:"mercury.png", radius:7, orbit:58 },
    { name:"Venus", file:"venus.png", radius:10, orbit:82 },
    { name:"Earth", file:"earth.png", radius:12, orbit:108 },
    { name:"Mars", file:"mars.png", radius:9, orbit:136 },
    { name:"Jupiter", file:"jupiter.png", radius:23, orbit:177 },
    { name:"Saturn", file:"saturn.png", radius:21, orbit:220 },
    { name:"Uranus", file:"uranus.png", radius:17, orbit:258 },
    { name:"Neptune", file:"neptune.png", radius:17, orbit:294 }
  ];
  const facts = {
    Mercury:"Closest planet to the Sun; a small, cratered, airless world.", Venus:"A hot terrestrial planet wrapped in dense clouds.", Earth:"Our ocean world, with one natural satellite: the Moon.", Mars:"A cold desert world with a well-documented robotic exploration legacy.", Jupiter:"The solar system's largest planet and a gas giant.", Saturn:"A gas giant encircled by broad rings.", Uranus:"A distant ice giant with an extreme axial tilt.", Neptune:"A distant ice giant with powerful winds."
  };
  const canvas = document.querySelector("#solar-canvas");
  const ctx = canvas?.getContext("2d", { alpha:false });
  const status = document.querySelector("#space-status");
  const planetInfo = document.querySelector("#planet-info");
  const missionPanel = document.querySelector("#mission-panel");
  if (!ctx) { if (status) status.textContent="Canvas graphics are unavailable. Enable hardware acceleration."; return; }

  let width=0, height=0, referenceZoom=1, zoom=referenceZoom, selected=null, showOrbits=true, solarAngle=0, moonAngle=0;
  let stars=[], dragging=false, dragStart=0, lastX=0, lastY=0, panX=0, panY=0, cameraTurn=0, lastTime=0, moonPoint=null;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const textures={};
  const sun=new Image(); sun.src="./space_images/sun.png";
  const moon=new Image(); moon.src="./space_images/moon.png";
  bodies.forEach(body=>{const image=new Image();image.src=`./space_images/${body.file}`;image.onload=()=>textures[body.name]=image;});

  function resize(){
    const ratio=Math.min(devicePixelRatio||1,2); width=canvas.clientWidth; height=canvas.clientHeight;
    canvas.width=width*ratio; canvas.height=height*ratio; ctx.setTransform(ratio,0,0,ratio,0,0);
    stars=Array.from({length:Math.min(1100,Math.round(width*height/1100))},()=>({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.1+.18,a:Math.random()*.65+.25}));
  }
  const ORBIT_DEPTH = .68;
  function referenceScale(){
    const horizontal=(width*.95)/(NEPTUNE_ORBIT*2);
    const vertical=(height*.90)/(NEPTUNE_ORBIT*2*ORBIT_DEPTH);
    return Math.min(horizontal,vertical)*zoom;
  }
  function center(){return{x:width*.50+panX,y:height*.51+panY};}
  function planetPosition(body,index){
    const c=center(), scale=referenceScale();
    const theta=solarAngle*(.7+index*.035)+index*.72;
    return{x:c.x+Math.cos(theta)*body.orbit*scale,y:c.y+Math.sin(theta)*body.orbit*scale*ORBIT_DEPTH};
  }
  function isInteractiveObjectAt(x,y){
    const mars=bodies.find(body=>body.name==="Mars"), marsPoint=mars?.current;
    if(marsPoint&&Math.hypot(marsPoint.x-x,marsPoint.y-y)<Math.max(mars.radius*1.5,15))return"Mars";
    if(moonPoint&&Math.hypot(moonPoint.x-x,moonPoint.y-y)<18)return"Moon";
    return null;
  }

  function draw(time=0){
    if(!lastTime)lastTime=time;
    const delta=Math.min((time-lastTime)/1000,.05); lastTime=time;
    if(!reducedMotion){solarAngle+=delta*.018;moonAngle+=delta*.7;}
    ctx.fillStyle="#02040b";ctx.fillRect(0,0,width,height);
    const nebulaX=width*.48+panX;
    const nebulaY=height*.48+panY;
    const nebula=ctx.createRadialGradient(nebulaX,nebulaY,30,nebulaX,nebulaY,width*.72);
    nebula.addColorStop(0,"rgba(47,55,112,.14)");nebula.addColorStop(.48,"rgba(15,18,48,.055)");nebula.addColorStop(1,"rgba(2,4,11,0)");ctx.fillStyle=nebula;ctx.fillRect(0,0,width,height);
    stars.forEach(star=>{
      const starX=(star.x+panX+width)%width;
      const starY=(star.y+panY+height)%height;
      ctx.globalAlpha=reducedMotion?star.a:star.a*(.75+Math.sin(time*.001+star.x)*.25);ctx.fillStyle="#dfe7ff";ctx.beginPath();ctx.arc(starX,starY,star.r,0,Math.PI*2);ctx.fill();
    });ctx.globalAlpha=1;

    const c=center(), scale=referenceScale(), sunRadius=Math.max(30,36*zoom);
    ctx.save();ctx.shadowColor="rgba(223,174,91,.65)";ctx.shadowBlur=22;
    if(sun.complete&&sun.naturalWidth)ctx.drawImage(sun,c.x-sunRadius,c.y-sunRadius,sunRadius*2,sunRadius*2);else{ctx.fillStyle="#d39b48";ctx.beginPath();ctx.arc(c.x,c.y,sunRadius,0,Math.PI*2);ctx.fill();}ctx.restore();

    if(showOrbits){ctx.strokeStyle="rgba(92,112,176,.28)";ctx.lineWidth=1;bodies.forEach(body=>{ctx.beginPath();ctx.ellipse(c.x,c.y,body.orbit*scale,body.orbit*scale*ORBIT_DEPTH,0,0,Math.PI*2);ctx.stroke();});}

    bodies.forEach((body,index)=>{const point=planetPosition(body,index);body.current=point;const radius=Math.max(body.radius*zoom,5);
      ctx.save();ctx.shadowColor="transparent";ctx.shadowBlur=0;if(textures[body.name]&&textures[body.name].naturalWidth)ctx.drawImage(textures[body.name],point.x-radius,point.y-radius,radius*2,radius*2);else{ctx.fillStyle="#737d9d";ctx.beginPath();ctx.arc(point.x,point.y,radius,0,Math.PI*2);ctx.fill();}ctx.restore();
      if(body.name==="Saturn"){ctx.save();ctx.translate(point.x,point.y);ctx.rotate(-.22);ctx.strokeStyle="rgba(210,193,151,.72)";ctx.lineWidth=Math.max(2,2.4*zoom);ctx.beginPath();ctx.ellipse(0,0,radius*1.75,radius*.42,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
      ctx.fillStyle="#aab1ca";ctx.font="10px Arial";ctx.textAlign="center";ctx.fillText(body.name,point.x,point.y+radius+14);

      if(body.name==="Earth"){
        const earthMoonRadius=Math.max(15,radius*1.9);
        ctx.save();ctx.strokeStyle="rgba(130,149,207,.22)";ctx.setLineDash([2,3]);ctx.beginPath();ctx.arc(point.x,point.y,earthMoonRadius,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
        moonPoint={x:point.x+Math.cos(moonAngle)*earthMoonRadius,y:point.y+Math.sin(moonAngle)*earthMoonRadius*ORBIT_DEPTH};
        ctx.save();ctx.shadowColor="rgba(183,199,255,.82)";ctx.shadowBlur=9;
        if(moon.complete&&moon.naturalWidth){ctx.drawImage(moon,moonPoint.x-5.5,moonPoint.y-5.5,11,11);}else{ctx.fillStyle="#d9deed";ctx.beginPath();ctx.arc(moonPoint.x,moonPoint.y,5.5,0,Math.PI*2);ctx.fill();}
        ctx.restore();ctx.fillStyle="#cbd2e8";ctx.font="8px Arial";ctx.fillText("MOON",moonPoint.x,moonPoint.y+17);
      }
    });
    requestAnimationFrame(draw);
  }

  function resetView(){selected=null;zoom=referenceZoom;panX=0;panY=0;planetInfo.hidden=true;missionPanel.hidden=true;}
  function selectPlanet(name){if(name!=="Mars")return;const mars=bodies.find(body=>body.name===name);selected=name;planetInfo.hidden=false;planetInfo.innerHTML=`<p class="eyebrow">SELECTED WORLD</p><h2>${name}</h2><p>${facts[name]}</p><p class="scale-note">Visual scale and orbit spacing are compressed. Planet data is shown as an educational visualization.</p>`;missionPanel.hidden=false;missionPanel.innerHTML=`<h3>Mission discovery — Mars</h3><p>No verified abandoned-hardware records are loaded yet.</p><p>This panel will accept verified spacecraft, mission, contribution, status, image credit, and source records.</p><button type="button" id="close-mission">CLOSE</button>`;document.querySelector("#close-mission")?.addEventListener("click",()=>missionPanel.hidden=true);}
  function openDestination(destination){
    document.querySelectorAll("[data-destination]").forEach(button=>button.classList.toggle("active",button.dataset.destination===destination));
    if(destination=== "SPACE") {resetView();return;}
  }

  document.querySelectorAll("[data-destination]").forEach(button=>button.addEventListener("click",()=>openDestination(button.dataset.destination)));
  document.querySelector("#reset-view")?.addEventListener("click",resetView);
  document.querySelector("#zoom-in")?.addEventListener("click",()=>zoom=Math.min(1.8,zoom+.12));
  document.querySelector("#zoom-out")?.addEventListener("click",()=>zoom=Math.max(.7,zoom-.12));
  document.querySelector("#toggle-orbits")?.addEventListener("click",event=>{showOrbits=!showOrbits;event.currentTarget.textContent=`ORBIT PATHS: ${showOrbits?"ON":"OFF"}`;event.currentTarget.setAttribute("aria-pressed",String(showOrbits));});
  canvas.addEventListener("wheel",event=>{event.preventDefault();zoom=Math.max(.7,Math.min(1.8,zoom+(event.deltaY>0?-0.08:0.08)));},{passive:false});
  canvas.addEventListener("pointerdown",event=>{dragging=true;dragStart=0;lastX=event.clientX;lastY=event.clientY;canvas.setPointerCapture?.(event.pointerId);});
  canvas.addEventListener("pointermove",event=>{
    if(dragging){
      const deltaX=event.clientX-lastX;
      const deltaY=event.clientY-lastY;
      dragStart+=Math.abs(deltaX)+Math.abs(deltaY);
      panX=Math.max(-width*.32,Math.min(width*.32,panX+deltaX));
      panY=Math.max(-height*.32,Math.min(height*.32,panY+deltaY));
      lastX=event.clientX;
      lastY=event.clientY;
    }
    const bounds=canvas.getBoundingClientRect(),x=event.clientX-bounds.left,y=event.clientY-bounds.top;
    const hover=isInteractiveObjectAt(x,y);canvas.classList.toggle("interactive-hover",Boolean(hover));canvas.dataset.hover=hover||"";
  });
  addEventListener("pointerup",()=>dragging=false);
  canvas.addEventListener("pointerup",event=>{if(dragStart>8){dragStart=0;return;}const bounds=canvas.getBoundingClientRect(),x=event.clientX-bounds.left,y=event.clientY-bounds.top;const target=isInteractiveObjectAt(x,y);if(target=== "Moon")openDestination("MOON");else if(target=== "Mars") {selectPlanet("Mars");openDestination("MARS");}});
  addEventListener("resize",resize);resize();resetView();draw();
})();
