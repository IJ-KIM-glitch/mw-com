function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

/* ---------- Lightbox (Image/PDF zoom) ---------- */
function initLightbox(){
  let lb = qs("#lightbox");
  if(!lb){
    lb = document.createElement("div");
    lb.id = "lightbox";
    document.body.appendChild(lb);
  }
  lb.classList.add("lightbox");

  // Ensure required markup exists (prevents "click but nothing happens")
  const rebuildNeeded = !lb.querySelector(".inner") || !lb.querySelector("img") || !lb.querySelector(".cap") || !lb.querySelector(".close");
  if(rebuildNeeded){
    lb.innerHTML = `
      <div class="inner">
        <button class="close" type="button" aria-label="Close">×</button>
        <img src="" alt="">
        <div class="cap"></div>
      </div>`;
  }

  const inner = qs(".inner", lb);
  const img = qs("img", lb);
  const cap = qs(".cap", lb);
  const closeBtn = qs(".close", lb);

  const close = () => {
    lb.classList.remove("open");
    img.src = "";
    cap.textContent = "";
    document.body.style.overflow = "";
  };

  const open = (src, caption="") => {
    img.src = src;
    img.alt = caption || "";
    cap.textContent = caption || "";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  closeBtn.addEventListener("click", close);
  lb.addEventListener("click", (e)=>{ if(e.target === lb) close(); });
  document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") close(); });

  // Bind zoom handlers (images + brochure pages)
  qsa("img[data-zoom]").forEach(el=>{
    el.style.cursor = "zoom-in";
    el.addEventListener("click", (ev)=>{
      ev.preventDefault();
      ev.stopPropagation();
      open(el.getAttribute("src"), el.getAttribute("alt") || "");
    });
  });
}

/* ---------- Contact Inquiry Form (mailto) ---------- */
function initInquiryForm(){
  const form = qs("#inquiryForm");
  if(!form) return;

  // Use the visible mailto address on the page (keeps it consistent with site content)
  const mailLink = qs('a[href^="mailto:"]');
  const to = mailLink ? mailLink.getAttribute("href").replace("mailto:","").trim() : "";

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name")||"").toString().trim();
    const company = (data.get("company")||"").toString().trim();
    const email = (data.get("email")||"").toString().trim();
    const phone = (data.get("phone")||"").toString().trim();
    const message = (data.get("message")||"").toString().trim();

    const subject = encodeURIComponent(`[IJTEC] Website Inquiry${name ? " - "+name : ""}`);
    const body = encodeURIComponent(
`Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}

Message:
${message}
`);
    const href = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
    window.location.href = href;
  });
}

document.addEventListener("DOMContentLoaded", initLightbox);
document.addEventListener("DOMContentLoaded", initInquiryForm);
