document.querySelectorAll('.brand').forEach(brand=>{
  const image=brand.querySelector('img');
  const fallback=document.createElement('span');
  fallback.className='brand-fallback';
  fallback.textContent='812 OB';
  brand.appendChild(fallback);
  const markMissing=()=>brand.classList.add('logo-missing');
  image?.addEventListener('error',markMissing);
  if(image?.complete&&!image.naturalWidth)markMissing();
});

const heroSlides=[...document.querySelectorAll('.hero-bg')];
const heroDots=[...document.querySelectorAll('.hero .dot')];
let currentSlide=0;
function showSlide(index){if(!heroSlides.length)return;currentSlide=(index+heroSlides.length)%heroSlides.length;heroSlides.forEach((slide,i)=>slide.classList.toggle('active',i===currentSlide));heroDots.forEach((dot,i)=>dot.classList.toggle('active',i===currentSlide));}
heroDots.forEach((dot,index)=>dot.addEventListener('click',()=>showSlide(index)));
if(heroSlides.length>1)setInterval(()=>showSlide(currentSlide+1),4000);

const projectImages=[['project1-1.jpg','project1-2.jpg','project1-3.jpg','project1-4.jpg','project1-5.jpg','project1-6.jpg','project1-7.jpg','project1-8.jpg','project1-9.jpg','project1-10.jpg','project1-11.jpg','project1-12.jpg','project1-13.jpg','project1-14.jpg','project1-15.jpg','project1-16.jpg','project1-17.jpg','project1-18.jpg','project1-19.jpg','project1-20.jpg'],['project2-1.jpg','project2-2.jpg','project2-3.jpg','project2-4.jpg','project2-5.jpg','project2-6.jpg'] ,['project3-1.jpg'] ];
const projectIndexes=[0,0,0];
document.querySelectorAll('.project-card').forEach(card=>{const project=Number(card.dataset.project),img=card.querySelector('img');card.querySelector('.prev')?.addEventListener('click',()=>{projectIndexes[project]=(projectIndexes[project]-1+projectImages[project].length)%projectImages[project].length;img.src=projectImages[project][projectIndexes[project]];});card.querySelector('.next')?.addEventListener('click',()=>{projectIndexes[project]=(projectIndexes[project]+1)%projectImages[project].length;img.src=projectImages[project][projectIndexes[project]];});});

const projectCarousel=document.querySelector('.project-carousel');
if(projectCarousel){const galleryGrid=projectCarousel.querySelector('.gallery-grid'),cards=[...galleryGrid.querySelectorAll('.project-card')],galleryDots=projectCarousel.querySelector('.gallery-dots');let activeProject=0;cards.forEach((_,index)=>{const dot=document.createElement('button');dot.className='gallery-dot';dot.type='button';dot.setAttribute('aria-label',`Show project ${index+1}`);dot.addEventListener('click',()=>showProject(index));galleryDots.appendChild(dot);});const dots=[...galleryDots.querySelectorAll('.gallery-dot')];function showProject(index){activeProject=(index+cards.length)%cards.length;galleryGrid.style.transform=`translateX(-${activeProject*100}%)`;dots.forEach((dot,i)=>dot.classList.toggle('active',i===activeProject));}projectCarousel.querySelector('.gallery-prev')?.addEventListener('click',()=>showProject(activeProject-1));projectCarousel.querySelector('.gallery-next')?.addEventListener('click',()=>showProject(activeProject+1));let touchStartX=0;galleryGrid.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX;},{passive:true});galleryGrid.addEventListener('touchend',e=>{const distance=e.changedTouches[0].clientX-touchStartX;if(Math.abs(distance)>50)showProject(activeProject+(distance<0?1:-1));},{passive:true});showProject(0);}

const enBtn=document.getElementById('enBtn'),esBtn=document.getElementById('esBtn');
function setLanguage(language){document.querySelectorAll('[data-en]').forEach(el=>{if(el.dataset[language]!==undefined)el.textContent=el.dataset[language];});document.querySelectorAll('[data-placeholder-en]').forEach(el=>{el.placeholder=el.dataset[language==='en'?'placeholderEn':'placeholderEs'];});document.documentElement.lang=language;enBtn?.classList.toggle('active',language==='en');esBtn?.classList.toggle('active',language==='es');localStorage.setItem('812ob-language',language);}
enBtn?.addEventListener('click',()=>setLanguage('en'));esBtn?.addEventListener('click',()=>setLanguage('es'));setLanguage(localStorage.getItem('812ob-language')||'en');

const menuToggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.navbar nav');menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');}));

const photoInputs=document.getElementById('photoInputs'),addPhotoInput=document.getElementById('addPhotoInput');
addPhotoInput?.addEventListener('click',()=>{const row=document.createElement('div');row.className='photo-input-row';const input=document.createElement('input');input.type='file';input.name='house_photos[]';input.accept='image/*';input.multiple=true;const remove=document.createElement('button');remove.type='button';remove.className='remove-photo-input';remove.setAttribute('aria-label','Remove photo selection');remove.textContent='×';remove.addEventListener('click',()=>row.remove());row.append(input,remove);photoInputs.appendChild(row);input.click();});

const quoteForm=document.getElementById('quoteForm'),quoteSubmit=document.getElementById('quoteSubmit'),formStatus=document.getElementById('formStatus');
quoteForm?.addEventListener('submit',async event=>{event.preventDefault();if(!quoteForm.reportValidity())return;const language=document.documentElement.lang;quoteSubmit.disabled=true;quoteSubmit.textContent=language==='es'?'Enviando...':'Submitting...';formStatus.classList.remove('error');formStatus.textContent=language==='es'?'Por favor espera mientras enviamos tu información.':'Please wait while we send your information.';try{const response=await fetch(quoteForm.action,{method:'POST',body:new FormData(quoteForm),headers:{Accept:'application/json'}});if(!response.ok)throw new Error('Submission failed');quoteForm.reset();photoInputs?.querySelectorAll('.photo-input-row:not(:first-child)').forEach(row=>row.remove());formStatus.textContent=language==='es'?'¡Gracias! Recibimos tu solicitud y nos comunicaremos contigo pronto.':'Thank you! We received your request and will contact you soon.';}catch(error){formStatus.classList.add('error');formStatus.textContent=language==='es'?'No pudimos enviar el formulario. Revisa tu conexión e inténtalo de nuevo.':'We could not submit the form. Please check your connection and try again.';}finally{quoteSubmit.disabled=false;quoteSubmit.textContent=quoteSubmit.dataset[language];}});
