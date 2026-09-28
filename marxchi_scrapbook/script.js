const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const video = $("#video");
const canvas = $("#canvas");
const ctx = canvas.getContext("2d");
const gallery = $("#gallery");
const emptyState = $("#emptyState");
const cameraToggle = $("#cameraToggle");
const placeholderStart = $("#placeholderStart");
const heroStart = $("#heroStart");
const cameraPlaceholder = $("#cameraPlaceholder");
const cameraStatus = $("#cameraStatus");
const captureBtn = $("#capture");
const captureLabel = $("#captureLabel");
const captureSub = $("#captureSub");
const resetBtn = $("#reset");
const countdown = $("#countdown");
const stickerLayer = $("#stickerLayer");
const filterName = $("#filterName");
const frameName = $("#frameName");
const modeName = $("#modeName");
const stripNote = $("#stripNote");
const captionInput = $("#caption");
const flipCamera = $("#flipCamera");
const timerBtn = $("#timerBtn");
const clearStickers = $("#clearStickers");
const toast = $("#toast");
const dateStamp = $("#dateStamp");
const frameLive = $("#frameLive");
const liveFrameLabel = $("#liveFrameLabel");
const stickerGrid = $("#stickerGrid");
const cameraHint = $("#cameraHint");
const shapeName = $("#shapeName");
const privacyModal = $("#privacyModal");
const contactModal = $("#contactModal");
const contactEmailLink = $("#contactEmailLink");

const CONTACT_EMAIL = "makuramos5@gmail.com"; // Add your real feedback/contact email here before publishing.
const EMAIL_SUBJECT = "Marxchi Studio Feedback";

let stream = null;
let currentFilter = "none";
let currentFrame = "cream";
let photoMode = "single";
let photoShape = "classic";
let facingMode = "user";
let timerSeconds = 3;
let sequenceShots = [];
let stickerCounter = 0;
let toastTimer = null;
let activeStickerTab = "cute";

const frameThemes = {
  cream:{name:"Cream Paper",bg:"#efe2cf",edge:"#fffaf0",accent:"#dfb16c",text:"#4b403b",tape:"#eccb86",note:"keep this one"},
  pink:{name:"Blush Mail",bg:"#f0ccd5",edge:"#fff4f4",accent:"#c76f8c",text:"#704756",tape:"#eab0bf",note:"love this"},
  mint:{name:"Mint Journal",bg:"#d6e7dc",edge:"#f8fffa",accent:"#79a18e",text:"#436452",tape:"#b9d6c7",note:"little joy"},
  blue:{name:"Blue Postcard",bg:"#cfe0e9",edge:"#f5fbff",accent:"#6d94aa",text:"#425c6b",tape:"#a9c9d8",note:"weekend"},
  berry:{name:"Berry Doodle",bg:"#d6a5b8",edge:"#fff2f5",accent:"#ab4969",text:"#663447",tape:"#efb1c5",note:"xoxo"},
  checker:{name:"Checker Fun",bg:"#efe2c4",edge:"#fff7ec",accent:"#585157",text:"#3f393d",tape:"#f0c97d",note:"lol"},
  kraft:{name:"Kraft Note",bg:"#caaa7e",edge:"#f7ead7",accent:"#7a5f45",text:"#4d3c2c",tape:"#e1c09a",note:"found"},
  night:{name:"Midnight Page",bg:"#35323c",edge:"#e8dce9",accent:"#c3accf",text:"#f8eef7",tape:"#c7afcf",note:"late night"}
};

const filterMap = {
  none:"none",
  soft:"brightness(1.06) saturate(1.08)", vivid:"brightness(1.04) saturate(1.32) contrast(1.06)",
  film:"contrast(1.1) saturate(.92) sepia(.08)", vintage:"sepia(.34) saturate(.78) contrast(.94) brightness(1.06)",
  faded:"contrast(.83) saturate(.72) brightness(1.08)", noir:"grayscale(1) contrast(1.18)", mono:"grayscale(1) contrast(1.04)",
  dreamy:"brightness(1.1) saturate(1.02) contrast(.92)", cool:"hue-rotate(188deg) saturate(.9) brightness(1.03)",
  sunset:"sepia(.16) saturate(1.28) hue-rotate(326deg)", polaroid:"contrast(1.08) saturate(1.16) brightness(1.04)",
  vhs:"contrast(1.15) saturate(1.25) hue-rotate(348deg)", peach:"sepia(.08) saturate(1.25) brightness(1.05)",
  coffee:"contrast(1.02) saturate(.86) brightness(1.02) hue-rotate(14deg)", candy:"brightness(1.02) saturate(1.34) hue-rotate(8deg)",
  matte:"contrast(.93) saturate(.86) brightness(1.03)", golden:"sepia(.18) saturate(1.15) hue-rotate(345deg) brightness(1.04)",
  rose:"sepia(.12) saturate(1.24) hue-rotate(318deg) brightness(1.05)", dramatic:"contrast(1.26) saturate(1.08) brightness(.97)"
};

const filterLabels = {
  none:"Natural",soft:"Soft",vivid:"Vivid",film:"Film",vintage:"Vintage",faded:"Faded",noir:"Noir",mono:"Mono",
  dreamy:"Dreamy",cool:"Cool",sunset:"Sunset",polaroid:"Polaroid",vhs:"VHS",peach:"Peach",coffee:"Coffee",candy:"Candy",
  matte:"Matte",golden:"Golden",rose:"Rose",dramatic:"Dramatic"
};

const stickerSets = {
  cute:[
    {v:"🎀",label:"bow"},{v:"🌸",label:"sakura"},{v:"🧸",label:"bear"},{v:"🍓",label:"berry"},{v:"☁️",label:"cloud"},{v:"🩷",label:"heart"},
    {v:"✨",label:"sparkle"},{v:"☆",label:"star"},{v:"♡",label:"love"},{v:"🫶",label:"hands"},{v:"🐰",label:"bunny"},{v:"🍒",label:"cherry"}
  ],
  meme:[
    {v:"BRUH",label:"bruh",word:true},{v:"LOL",label:"lol",word:true},{v:"OMG",label:"omg",word:true},{v:"NOPE",label:"nope",word:true},{v:"OOPS",label:"oops",word:true},{v:"HEHE",label:"hehe",word:true},
    {v:"MAIN CHARACTER",label:"main",word:true},{v:"caught!",label:"caught",word:true},{v:"say cheese!",label:"cheese",word:true},{v:"mood",label:"mood",word:true},{v:"???",label:"huh",word:true},{v:"100%",label:"100",word:true},
    {v:"bro 💀",label:"bro",word:true},{v:"plot twist",label:"plot",word:true},{v:"real",label:"real",word:true},{v:"I'M FINE",label:"fine",word:true},{v:"SEND HELP",label:"help",word:true},{v:"NICE TRY",label:"try",word:true}
  ],
  doodle:[
    {v:"✦",label:"shine"},{v:"✎",label:"pen"},{v:"+1",label:"plus",word:true},{v:":3",label:"cat",word:true},{v:"XD",label:"xd",word:true},{v:"☼",label:"sun"},
    {v:"☕",label:"coffee"},{v:"📌",label:"pin"},{v:"🧷",label:"safety pin"},{v:"✿",label:"flower"},{v:"⌁",label:"line"},{v:"📎",label:"clip"}
  ],
  food:[
    {v:"🍙",label:"rice"},{v:"🍜",label:"noodles"},{v:"🍔",label:"burger"},{v:"🍟",label:"fries"},{v:"🍩",label:"donut"},{v:"🍰",label:"cake"},
    {v:"🍒",label:"cherry"},{v:"🍋",label:"lemon"},{v:"🥤",label:"drink"},{v:"🍦",label:"ice cream"},{v:"☕",label:"coffee"},{v:"🍪",label:"cookie"}
  ]
};

function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400)}
function setCameraFilter(){video.style.filter=filterMap[currentFilter]||"none"}
function setCameraMirror(){video.style.transform=facingMode==="user"?"scaleX(-1)":"scaleX(1)"}
function applyFrameUI(){
  const theme=frameThemes[currentFrame];
  frameName.textContent=theme.name;
  liveFrameLabel.textContent=`FRAME: ${theme.name}`;
  frameLive.className=`frame-live frame-${currentFrame}`;
  $("#cameraWrap").dataset.frame=currentFrame;
}
function setPlaceholder(title,text){$("#placeholderTitle").textContent=title;$("#placeholderText").textContent=text}

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showCameraError(
      "This browser does not support camera access."
    );

    return false;
  }

  if (stream) {
    cameraHint.textContent = "Camera is already running.";
    return true;
  }

  try {
    /*
     * Ask the browser for a high-quality camera stream.
     *
     * ideal = preferred resolution
     * max   = don't request something unreasonable
     */
    const constraints = {
      audio: false,

      video: {
        facingMode: {
          ideal: facingMode
        },

        width: {
          ideal: 1920,
          max: 1920
        },

        height: {
          ideal: 1080,
          max: 1080
        },

        frameRate: {
          ideal: 30,
          max: 60
        }
      }
    };

    stream = await navigator.mediaDevices.getUserMedia(
      constraints
    );

    video.srcObject = stream;

    await video.play();

    /*
     * Wait until the browser knows the actual
     * camera dimensions.
     */
    await new Promise((resolve) => {
      if (video.videoWidth && video.videoHeight) {
        resolve();
        return;
      }

      video.addEventListener(
        "loadedmetadata",
        resolve,
        { once: true }
      );
    });

    /*
     * Read the REAL resolution supplied
     * by the device/browser.
     */
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();

    const actualWidth =
      settings.width || video.videoWidth;

    const actualHeight =
      settings.height || video.videoHeight;

    console.log(
      `Marxchi camera: ${actualWidth} × ${actualHeight}`
    );

    /*
     * Show the real quality in the UI.
     */
    cameraHint.textContent =
      `Camera live · ${actualWidth}×${actualHeight}`;

    cameraPlaceholder.style.display = "none";

    cameraToggle.textContent =
      "◉ turn off camera";

    cameraStatus.classList.add("on");

    cameraStatus.innerHTML =
      "<i></i> camera on";

    setCameraFilter();
    setCameraMirror();

    showToast(
      `Camera ready · ${actualWidth}×${actualHeight} ✦`
    );

    return true;

  } catch (error) {
    console.error(
      "Camera start error:",
      error
    );

    stream = null;

    let message =
      "Camera could not start. Try again.";

    if (error?.name === "NotAllowedError") {
      message =
        "Camera permission was blocked. Allow camera access, then try again.";
    }

    else if (error?.name === "NotFoundError") {
      message =
        "No camera was found on this device.";
    }

    else if (error?.name === "OverconstrainedError") {
      message =
        "The camera does not support the requested quality. Trying a compatible resolution may help.";
    }

    showCameraError(message);

    return false;
  }
}
function stopCamera(showPlaceholder=true){
  if(stream)stream.getTracks().forEach(track=>track.stop());
  stream=null;video.srcObject=null;
  if(showPlaceholder){cameraPlaceholder.style.display="grid";setPlaceholder("Ready for your page?","Start the camera once, then the same button controls it on or off.")}
  cameraToggle.textContent="◉ turn on camera";cameraStatus.classList.remove("on");cameraStatus.innerHTML='<i></i> camera off';
  cameraHint.textContent="camera access is requested only after you press Start camera.";
  setCameraMirror();
}
function showCameraError(message){cameraPlaceholder.style.display="grid";setPlaceholder("Camera not ready",message)}
async function toggleCamera(){if(stream)stopCamera();else await startCamera()}
async function switchCamera(){facingMode=facingMode==="user"?"environment":"user";if(stream){stopCamera(false);await startCamera();}}

function buildStickerGrid(){
  stickerGrid.innerHTML="";
  (stickerSets[activeStickerTab]||[]).forEach(item=>{
    const btn=document.createElement("button");btn.type="button";btn.className=`sticker-btn ${item.word?"word-preview":""}`;btn.title=item.label;btn.textContent=item.v;
    btn.addEventListener("click",()=>addSticker(item.v,!!item.word));stickerGrid.appendChild(btn);
  });
}
function addSticker(value,word=false){
  const item=document.createElement("div");item.className=`sticker-item ${word?"word-sticker":""}`;item.dataset.id=String(++stickerCounter);item.dataset.word=word?"true":"false";item.dataset.value=value;item.textContent=value;
  const remove=document.createElement("button");remove.className="sticker-delete";remove.type="button";remove.textContent="×";remove.title="Remove sticker";remove.addEventListener("click",e=>{e.stopPropagation();item.remove()});item.appendChild(remove);
  item.style.left=`${18+Math.random()*64}%`;item.style.top=`${18+Math.random()*60}%`;item.style.transform=`translate(-50%,-50%) rotate(${(-8+Math.random()*16).toFixed(1)}deg)`;stickerLayer.appendChild(item);makeDraggable(item)
}
function makeDraggable(element){
  let dragging=false,offsetX=0,offsetY=0;
  element.addEventListener("pointerdown",event=>{if(event.target.closest(".sticker-delete"))return;const rect=element.getBoundingClientRect();dragging=true;offsetX=event.clientX-rect.left-offsetX;offsetY=event.clientY-rect.top;element.setPointerCapture?.(event.pointerId);element.style.cursor="grabbing";event.preventDefault()});
  element.addEventListener("pointermove",event=>{if(!dragging)return;const layerRect=stickerLayer.getBoundingClientRect();const x=Math.max(element.offsetWidth/2,Math.min(layerRect.width-element.offsetWidth/2,event.clientX-layerRect.left-(offsetX-element.offsetWidth/2)));const y=Math.max(element.offsetHeight/2,Math.min(layerRect.height-element.offsetHeight/2,event.clientY-layerRect.top-(offsetY-element.offsetHeight/2)));element.style.left=`${x}px`;element.style.top=`${y}px`;element.style.transform="translate(-50%,-50%) rotate(0deg)"});
  const end=()=>{dragging=false;element.style.cursor="grab"};element.addEventListener("pointerup",end);element.addEventListener("pointercancel",end)
}
function getStickerSnapshot(){
  const layerRect=stickerLayer.getBoundingClientRect();
  return $$(".sticker-item",stickerLayer).map(el=>{const rect=el.getBoundingClientRect();const size=parseFloat(getComputedStyle(el).fontSize)||26;return{text:el.dataset.value||el.textContent.replace("×","").trim(),word:el.dataset.word==="true",x:(rect.left-layerRect.left+rect.width/2)/layerRect.width,y:(rect.top-layerRect.top+rect.height/2)/layerRect.height,size}})
}
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function runCountdown(){countdown.classList.add("show");document.body.classList.add("busy");try{for(let n=timerSeconds;n>=1;n--){countdown.textContent=n;await wait(650)}countdown.textContent="✦";await wait(180)}finally{countdown.classList.remove("show");document.body.classList.remove("busy")}}
function drawCoverImage(targetCtx,source,dx,dy,dw,dh){
  const sw=source.videoWidth||source.width,sh=source.videoHeight||source.height,srcRatio=sw/sh,dstRatio=dw/dh;let sx=0,sy=0,cropW=sw,cropH=sh;
  if(srcRatio>dstRatio){cropW=sh*dstRatio;sx=(sw-cropW)/2}else{cropH=sw/dstRatio;sy=(sh-cropH)/2}
  targetCtx.drawImage(source,sx,sy,cropW,cropH,dx,dy,dw,dh)
}
function drawPaperTexture(target,x,y,w,h){target.save();target.globalAlpha=.09;for(let i=0;i<180;i++){const px=x+Math.random()*w,py=y+Math.random()*h,s=Math.random()*2+.5;target.fillStyle=i%2?"#6d554b":"#fff8ec";target.fillRect(px,py,s,s)}target.restore()}
function drawTape(target,x,y,w,h,color,angle=0){target.save();target.translate(x+w/2,y+h/2);target.rotate(angle);target.globalAlpha=.88;target.fillStyle=color;target.fillRect(-w/2,-h/2,w,h);target.globalAlpha=.16;target.strokeStyle="#6f574d";target.lineWidth=1;for(let i=-w/2+4;i<w/2;i+=8){target.beginPath();target.moveTo(i,-h/2);target.lineTo(i,h/2);target.stroke()}target.restore()}
function drawStickers(target,stickers,photoRect){
  target.save();stickers.forEach(sticker=>{const x=photoRect.x+sticker.x*photoRect.width,y=photoRect.y+sticker.y*photoRect.height,size=Math.max(20,sticker.size*(photoRect.width/Math.max(1,stickerLayer.clientWidth)));target.textAlign="center";target.textBaseline="middle";
    if(sticker.word){target.font=`700 ${Math.max(20,size*.82)}px "Gochi Hand"`;const width=target.measureText(sticker.text).width+size*.52;target.fillStyle="#fff4e9";target.strokeStyle="#322d31";target.lineWidth=Math.max(2,size*.055);target.save();target.translate(x,y);target.rotate(-.05);target.fillRect(-width/2,-size*.55,width,size*1.05);target.strokeRect(-width/2,-size*.55,width,size*1.05);target.fillStyle="#322d31";target.fillText(sticker.text,0,0);target.restore()}
    else{target.font=`${Math.max(24,size)}px "Gochi Hand", "Segoe UI Emoji", sans-serif`;target.shadowColor="rgba(40,30,30,.20)";target.shadowBlur=Math.max(3,size*.1);target.fillStyle="#312c30";target.fillText(sticker.text,x,y)}
  });target.restore()
}
function drawDoodleBorder(target,theme,outW,outH,pad){target.save();target.strokeStyle=theme.accent;target.globalAlpha=.58;target.lineWidth=Math.max(4,pad*.25);target.strokeRect(pad*.55,pad*.55,outW-pad*1.1,outH-pad*1.1);target.fillStyle=theme.accent;target.font=`${Math.max(20,pad*1.2)}px "Gochi Hand"`;target.fillText("✦",pad*.55,pad*.95);target.fillText("♡",outW-pad*1.05,outH-pad*.35);target.restore()}
function drawCheckerBorder(target,outW,outH,pad){
  const tile=Math.max(18,Math.round(pad*.65));
  target.save();
  const patternCanvas=document.createElement("canvas");patternCanvas.width=tile*2;patternCanvas.height=tile*2;const p=patternCanvas.getContext("2d");p.fillStyle="#f0dfc1";p.fillRect(0,0,tile*2,tile*2);p.fillStyle="#4e494f";p.fillRect(tile,0,tile,tile);p.fillRect(0,tile,tile,tile);
  const pattern=target.createPattern(patternCanvas,"repeat");target.fillStyle=pattern;
  target.fillRect(0,0,outW,pad);target.fillRect(0,outH-pad,outW,pad);target.fillRect(0,pad,pad,outH-pad*2);target.fillRect(outW-pad,pad,pad,outH-pad*2);target.restore()
}
function getOutputPhotoRect(w,h,pad){
  if(photoShape==="square") return {x:pad,y:pad,width:Math.min(w,h),height:Math.min(w,h)};
  if(photoShape==="postcard") return {x:pad,y:pad,width:w,height:Math.min(h,Math.round(w*.72))};
  return {x:pad,y:pad,width:w,height:h};
}
function renderPrint(source,stickerSnapshot){
  const theme=frameThemes[currentFrame],rawW=source.videoWidth||source.width||1280,rawH=source.videoHeight||source.height||720,pad=Math.round(Math.min(rawW,rawH)*.055);
  console.log(
  `Exporting photo at ${rawW} × ${rawH}`
);
  let photoW=rawW,photoH=rawH;if(photoShape==="square"){photoW=Math.min(rawW,rawH);photoH=photoW}else if(photoShape==="postcard"){photoW=rawW;photoH=Math.min(rawH,Math.round(rawW*.72))}
  const captionBand=Math.round(photoH*.18),outW=photoW+pad*2,outH=photoH+pad*2+captionBand;canvas.width=outW;canvas.height=outH;ctx.clearRect(0,0,outW,outH);ctx.fillStyle=theme.bg;ctx.fillRect(0,0,outW,outH);drawPaperTexture(ctx,0,0,outW,outH);
  const photoRect={x:pad,y:pad,width:photoW,height:photoH};ctx.save();ctx.filter=filterMap[currentFilter]||"none";if(facingMode==="user"){ctx.translate(outW,0);ctx.scale(-1,1)}drawCoverImage(ctx,source,photoRect.x,photoRect.y,photoRect.width,photoRect.height);ctx.restore();
  ctx.save();ctx.strokeStyle=theme.edge;ctx.lineWidth=Math.max(10,pad*.7);ctx.strokeRect(pad*.42,pad*.42,photoW+pad,photoH+pad);ctx.restore();
  if(currentFrame==="checker")drawCheckerBorder(ctx,outW,outH,pad);else drawDoodleBorder(ctx,theme,outW,outH,pad);
  drawTape(ctx,pad*.25,pad*.42,Math.max(80,photoW*.12),Math.max(18,pad*.58),theme.tape,-.08);drawTape(ctx,outW-pad*.25-Math.max(80,photoW*.12),outH-captionBand-pad*.35,Math.max(80,photoW*.12),Math.max(18,pad*.58),theme.tape,.08);
  drawStickers(ctx,stickerSnapshot,photoRect);
  const caption=captionInput.value.trim()||theme.note;ctx.fillStyle=theme.text;ctx.textBaseline="middle";ctx.textAlign="center";ctx.font=`700 ${Math.max(24,Math.round(photoW*.055))}px "Caveat", cursive`;ctx.fillText(caption,outW/2,photoH+pad+captionBand*.48);ctx.textAlign="left";ctx.font=`600 ${Math.max(12,Math.round(photoW*.025))}px "DM Mono", monospace`;ctx.fillText("MARXCHI STUDIO",pad,photoH+pad+captionBand*.83);ctx.textAlign="right";ctx.fillText(new Date().toLocaleDateString(undefined,{month:"short",day:"2-digit"}).toUpperCase(),outW-pad,photoH+pad+captionBand*.83);
  return canvas.toDataURL("image/png")
}
async function createMultiStrip(images,label,count){
  const loaded=await Promise.all(images.map(src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src})));const stripWidth=loaded[0].width;const gap=Math.max(16,Math.round(stripWidth*.03)),pad=gap,titleH=Math.max(76,Math.round(stripWidth*.13));const height=titleH+pad*2+loaded.reduce((sum,img)=>sum+img.height,0)+gap*(loaded.length-1);const c=document.createElement("canvas");c.width=stripWidth+pad*2;c.height=height;const cctx=c.getContext("2d");cctx.fillStyle="#e8dccb";cctx.fillRect(0,0,c.width,c.height);drawPaperTexture(cctx,0,0,c.width,c.height);cctx.fillStyle="#fffaf0";cctx.fillRect(pad,pad,stripWidth,height-pad*2);drawTape(cctx,pad*.7,pad*.55,Math.max(100,stripWidth*.16),34,"#efc8cf",-.05);drawTape(cctx,c.width-pad*.7-Math.max(100,stripWidth*.16),pad*.55,Math.max(100,stripWidth*.16),34,"#cfe1d7",.05);cctx.fillStyle="#332c30";cctx.textAlign="center";cctx.textBaseline="middle";cctx.font=`600 ${Math.max(22,stripWidth*.05)}px "Gochi Hand"`;cctx.fillText(`MARXCHI ${label.toUpperCase()}`,c.width/2,pad+titleH*.45);cctx.font=`500 ${Math.max(14,stripWidth*.028)}px "Caveat"`;cctx.fillStyle="#765f58";cctx.fillText(captionInput.value.trim()||"tiny moments, kept here",c.width/2,pad+titleH*.77);let y=pad+titleH+8;loaded.forEach((img,i)=>{cctx.fillStyle="#fff";cctx.shadowColor="rgba(65,48,40,.12)";cctx.shadowBlur=10;cctx.fillRect(pad-4,y-4,stripWidth+8,img.height+8);cctx.shadowBlur=0;cctx.drawImage(img,pad,y,stripWidth,img.height);cctx.fillStyle="#3f3635";cctx.font=`700 ${Math.max(13,stripWidth*.025)}px "Gochi Hand"`;cctx.fillText(String(i+1).padStart(2,"0"),pad+28,y+22);y+=img.height+gap});return c.toDataURL("image/png")
}
function addPhotoToGallery(imgData,label){emptyState.style.display="none";const card=document.createElement("article");card.className="photo-card";card.style.setProperty("--tilt",`${(-2+Math.random()*4).toFixed(2)}deg`);const frame=document.createElement("div");frame.className="photo-frame";const img=document.createElement("img");img.src=imgData;img.alt=`Marxchi Studio ${label}`;frame.appendChild(img);const info=document.createElement("div");info.className="photo-info";const text=document.createElement("span");text.textContent=label;const actions=document.createElement("div");actions.className="gallery-actions";const download=document.createElement("a");download.className="download-link";download.href=imgData;download.download=`marxchi-${Date.now()}.png`;download.textContent="save";const remove=document.createElement("button");remove.className="delete-photo";remove.type="button";remove.textContent="×";remove.title="Remove photo";remove.addEventListener("click",()=>{card.remove();if(!gallery.children.length)emptyState.style.display="grid"});actions.append(download,remove);info.append(text,actions);card.append(frame,info);gallery.prepend(card)}
async function captureShot(){
  if(!stream){const ok=await startCamera();if(!ok){showToast("Start the camera first, then try the shutter again.");return}}
  if(video.readyState<2||!video.videoWidth){showToast("Camera is still loading. Try again in a moment.");return}
  captureBtn.disabled=true;
  try{await document.fonts?.ready;await runCountdown();const stickers=getStickerSnapshot();const image=renderPrint(video,stickers);const count=photoMode==="duo"?2:photoMode==="strip"?4:photoMode==="film"?3:1;
    if(count>1){sequenceShots.push(image);const shot=sequenceShots.length;captureLabel.textContent=shot<count?`Take shot ${shot+1} / ${count}`:"Finishing…";captureSub.textContent=`${shot} of ${count} saved`;showToast(`Shot ${shot} / ${count} saved.`);if(shot===count){const result=await createMultiStrip(sequenceShots,photoMode==="film"?"FILM ROLL":"PHOTO STRIP",count);addPhotoToGallery(result,photoMode==="film"?"3-shot film roll":"4-shot photo strip");sequenceShots=[];captureLabel.textContent=photoMode==="strip"?"Start strip":photoMode==="film"?"Start film":"Start duo";captureSub.textContent="sequence ready";showToast("Your scrapbook sequence is ready ✦")}}
    else{addPhotoToGallery(image,frameThemes[currentFrame].name);showToast("Photo pinned to your memory page.")}
  }catch(error){console.error("Capture failed:",error);showToast("The photo could not be created. Please try again.")}finally{captureBtn.disabled=false}
}
function updateModeUI(){const labels={single:["Single","Take photo","single memory"],duo:["Duo","Start duo","2-shot memory"],strip:["Strip ×4","Start strip","4-shot strip"],film:["Film ×3","Start film","3-shot film roll"]};const [name,button,sub]=labels[photoMode];modeName.textContent=name;captureLabel.textContent=sequenceShots.length?`Take shot ${sequenceShots.length+1} / ${photoMode==="duo"?2:photoMode==="strip"?4:3}`:button;captureSub.textContent=sub;stripNote.style.display=photoMode==="single"?"none":"block";sequenceShots=[]}
function openModal(modal){modal.hidden=false;document.body.classList.add("modal-open")}
function closeModal(modal){modal.hidden=true;document.body.classList.remove("modal-open")}
function buildMailto(subject=EMAIL_SUBJECT){if(!CONTACT_EMAIL)return `mailto:?subject=${encodeURIComponent(subject)}`;return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`}

cameraToggle.addEventListener("click",toggleCamera);placeholderStart.addEventListener("click",startCamera);heroStart.addEventListener("click",async()=>{await startCamera();$("#booth").scrollIntoView({behavior:"smooth",block:"start"})});flipCamera.addEventListener("click",switchCamera);captureBtn.addEventListener("click",captureShot);
timerBtn.addEventListener("click",()=>{timerSeconds=timerSeconds===3?5:timerSeconds===5?10:3;timerBtn.textContent=`⏱ ${timerSeconds} sec`;showToast(`Timer set to ${timerSeconds} seconds.`)});
$$('.filter-chip').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter-chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');currentFilter=btn.dataset.filter;filterName.textContent=filterLabels[currentFilter]||"Natural";setCameraFilter()}));
$$('.border-card').forEach(btn=>btn.addEventListener('click',()=>{$$('.border-card').forEach(b=>b.classList.remove('active'));btn.classList.add('active');currentFrame=btn.dataset.frame;applyFrameUI();showToast(`${frameThemes[currentFrame].name} selected.`)}));
$$('.layout-card').forEach(btn=>btn.addEventListener('click',()=>{$$('.layout-card').forEach(b=>b.classList.remove('active'));btn.classList.add('active');photoMode=btn.dataset.mode;updateModeUI()}));
$$('.mode-btn').forEach(btn=>btn.addEventListener('click',()=>{$$('.mode-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');photoShape=btn.dataset.shape;shapeName.textContent=btn.dataset.shape==="classic"?"Classic":btn.dataset.shape==="square"?"Square":"Postcard";showToast(`${shapeName.textContent} shape selected.`)}));
$$('.sticker-tab').forEach(btn=>btn.addEventListener('click',()=>{$$('.sticker-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeStickerTab=btn.dataset.tab;buildStickerGrid()}));
clearStickers.addEventListener('click',()=>{stickerLayer.innerHTML="";showToast("All stickers removed.")});
resetBtn.addEventListener('click',()=>{gallery.innerHTML="";emptyState.style.display="grid";sequenceShots=[];updateModeUI();showToast("Album cleared.")});

["#privacyBtn","#privacyBtnBottom"].forEach(selector=>$(selector).addEventListener("click",()=>openModal(privacyModal)));
$("#contactBtn").addEventListener("click",()=>openModal(contactModal));
contactEmailLink.href=buildMailto();
$$('[data-close-modal]').forEach(el=>el.addEventListener('click',()=>{closeModal(privacyModal);closeModal(contactModal)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal(privacyModal);closeModal(contactModal)}});

const today=new Date();dateStamp && (dateStamp.textContent=today.toLocaleDateString(undefined,{month:"short",day:"2-digit",year:"numeric"}).toUpperCase());
setCameraFilter();setCameraMirror();applyFrameUI();buildStickerGrid();updateModeUI();
window.addEventListener("beforeunload",()=>stopCamera(false));

/* =========================================================
   MARXCHI PHOTO PREVIEW
   
========================================================= */

(function () {
    "use strict";

    let previewModal = null;
    let previewImage = null;
    let previewDownload = null;

    function createPreviewModal() {
        // Prevent duplicate modals
        const existing = document.getElementById(
            "marxchiPhotoPreview"
        );

        if (existing) {
            previewModal = existing;
            previewImage = existing.querySelector(
                ".photo-preview-image"
            );
            previewDownload = existing.querySelector(
                ".photo-preview-download"
            );

            return existing;
        }

        previewModal = document.createElement("div");

        previewModal.id = "marxchiPhotoPreview";
        previewModal.className = "photo-preview-modal";

        previewModal.innerHTML = `
            <div class="photo-preview-card">

                <button
                    type="button"
                    class="photo-preview-close"
                    aria-label="Close preview"
                >
                    ×
                </button>

                <div class="photo-preview-image-wrap">
                    <img
                        class="photo-preview-image"
                        src=""
                        alt="Photo preview"
                    >
                </div>

                <div class="photo-preview-footer">

                    <div class="photo-preview-label">
                        Your memory ✦

                        <small>
                            Marxchi Studio Photobooth
                        </small>
                    </div>

                    <div class="photo-preview-actions">

                        <button
                            type="button"
                            class="photo-preview-btn photo-preview-close-btn"
                        >
                            Close
                        </button>

                        <a
                            class="photo-preview-btn photo-preview-download"
                            href="#"
                            download="marxchi-memory.jpg"
                        >
                            ↓ Download
                        </a>

                    </div>

                </div>
            </div>
        `;

        document.body.appendChild(previewModal);

        previewImage = previewModal.querySelector(
            ".photo-preview-image"
        );

        previewDownload = previewModal.querySelector(
            ".photo-preview-download"
        );

        return previewModal;
    }


    /* =========================================================
       OPEN
    ========================================================= */

    function openPhotoPreview(src) {
        const modal = createPreviewModal();

        if (!src) {
            return;
        }

        previewImage.src = src;

        previewDownload.href = src;
        previewDownload.download =
            `marxchi-memory-${Date.now()}.jpg`;

        /*
         * IMPORTANT:
         * Force the modal to become clickable again.
         */
        modal.style.display = "flex";
        modal.style.opacity = "1";
        modal.style.visibility = "visible";
        modal.style.pointerEvents = "auto";

        modal.classList.add("show");

        document.body.style.overflow = "hidden";
    }


    /* =========================================================
       CLOSE
    ========================================================= */

    function closePhotoPreview() {
        const modal = document.getElementById(
            "marxchiPhotoPreview"
        );

        if (!modal) {
            return;
        }

        /*
         * Remove all interaction from the modal.
         * This is what lets you click the gallery again.
         */
        modal.classList.remove("show");

        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        modal.style.pointerEvents = "none";

        /*
         * Completely remove the modal from mouse interaction.
         */
        modal.style.display = "none";

        document.body.style.overflow = "";

        /*
         * Clear preview image after closing.
         */
        setTimeout(() => {
            if (previewImage) {
                previewImage.src = "";
            }
        }, 200);
    }


    /* =========================================================
       CREATE MODAL ONCE
    ========================================================= */

    createPreviewModal();


    /* =========================================================
       GALLERY CLICK
       Works even when photos are dynamically added later.
    ========================================================= */

    document.addEventListener(
        "click",
        function (event) {

            const clickedImage =
                event.target.closest(
                    ".photo-gallery .photo-frame img"
                );

            if (!clickedImage) {
                return;
            }

            /*
             * Do not open the modal when clicking
             * an image inside the preview itself.
             */
            if (
                clickedImage.closest(
                    "#marxchiPhotoPreview"
                )
            ) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const source =
                clickedImage.currentSrc ||
                clickedImage.src;

            openPhotoPreview(source);
        },
        false
    );


    /* =========================================================
       CLOSE BUTTON
    ========================================================= */

    document.addEventListener(
        "click",
        function (event) {

            const closeButton =
                event.target.closest(
                    "#marxchiPhotoPreview .photo-preview-close, " +
                    "#marxchiPhotoPreview .photo-preview-close-btn"
                );

            if (!closeButton) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            closePhotoPreview();
        },
        false
    );


    /* =========================================================
       CLICK OUTSIDE
    ========================================================= */

    document.addEventListener(
        "click",
        function (event) {

            const modal =
                document.getElementById(
                    "marxchiPhotoPreview"
                );

            if (!modal) {
                return;
            }

            if (!modal.classList.contains("show")) {
                return;
            }

            /*
             * Only close when clicking the dark backdrop.
             */
            if (event.target === modal) {
                closePhotoPreview();
            }
        },
        false
    );


    /* =========================================================
       ESC KEY
    ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            const modal =
                document.getElementById(
                    "marxchiPhotoPreview"
                );

            if (
                modal &&
                modal.classList.contains("show")
            ) {
                closePhotoPreview();
            }
        }
    );

})();

/* =========================================================
   MOBILE MENU
========================================================= */

(function () {

    const menuToggle =
        document.getElementById("menuToggle");

    const topNav =
        document.getElementById("topNav");

    if (!menuToggle || !topNav) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                topNav.classList.toggle("open");

            menuToggle.classList.toggle(
                "active",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation"
                    : "Open navigation"
            );
        }
    );


    /* Close after selecting a link */
    topNav.addEventListener(
        "click",
        function (event) {

            const link =
                event.target.closest("a");

            if (!link) {
                return;
            }

            topNav.classList.remove("open");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation"
            );
        }
    );


    /* Close when clicking outside */
    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(".site-header")
            ) {

                topNav.classList.remove("open");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    );


    /* ESC */
    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                topNav.classList.remove("open");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    );

})();