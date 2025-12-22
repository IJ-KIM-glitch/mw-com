
function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

function initLightbox(){
  const lb = qs("#lightbox");
  if(!lb) return;
  const img = qs("img", lb);
  const cap = qs(".cap", lb);
  const closeBtn = qs(".close", lb);
  const close = () => { lb.classList.remove("open"); img.src=""; cap.textContent=""; document.body.style.overflow=""; };
  closeBtn.addEventListener("click", close);
  lb.addEventListener("click", (e)=>{ if(e.target===lb) close(); });
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") close(); });
  window.openLightbox = (src, caption="") => {
    img.src = src; cap.textContent = caption || "";
    lb.classList.add("open"); document.body.style.overflow="hidden";
  };
  qsa("img[data-zoom]").forEach(el=>{
    el.addEventListener("click", ()=> window.openLightbox(el.getAttribute("src"), el.getAttribute("alt")||""));
  });
}
document.addEventListener("DOMContentLoaded", initLightbox);
