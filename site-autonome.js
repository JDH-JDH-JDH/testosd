(function () {
  'use strict';
  const config = window.OSD_CONTACT || {mode:'email', recipients:['osdomes.contact@gmail.com']};
  const searchForm = document.querySelector('#osd-search-form');
  function normalize(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
  }
  if (searchForm) {
    const input = searchForm.querySelector('input');
    const params = new URLSearchParams(location.search);
    input.value = params.get('q') || params.get('search') || '';
    function search() {
      const query=input.value.trim();
      const host=document.querySelector('#osd-search-results');
      const status=document.querySelector('#osd-search-status');
      host.replaceChildren();
      if (!query) { status.textContent='Saisissez un mot, un nom ou une œuvre à rechercher.'; return; }
      const terms=normalize(query).split(/\s+/).filter(Boolean);
      const results=(window.OSD_SEARCH_INDEX || []).map(page=>{
        const title=normalize(page.title), text=normalize(page.text);
        const found=terms.every(term=>title.includes(term)||text.includes(term));
        return {page,score:found?terms.reduce((sum,term)=>sum+(title.includes(term)?10:1),0):0};
      }).filter(result=>result.score).sort((a,b)=>b.score-a.score);
      status.textContent=results.length+' résultat'+(results.length===1?'':'s')+' pour « '+query+' »';
      for(const {page} of results) {
        const li=document.createElement('li');
        const a=document.createElement('a'); a.href=page.url; a.textContent=page.title;
        const p=document.createElement('p');
        const pos=Math.max(0,normalize(page.text).indexOf(terms[0]));
        const start=Math.max(0,pos-70); p.textContent=(start?'… ':'')+page.text.slice(start,start+240)+(page.text.length>start+240?'…':'');
        li.append(a,p); host.append(li);
      }
    }
    searchForm.addEventListener('submit',event=>{event.preventDefault();search();});
    search();
  }
  const form=document.querySelector('#osd-contact-form');
  if (form) {
    const local=true;
    const submit=form.querySelector('button[type=submit]');
    const status=form.querySelector('[role=status]');
    const hint=form.querySelector('.osd-contact-hint');
    const emailLink=form.querySelector('.osd-contact-email');
    emailLink.href='mailto:'+config.recipients.join(',');
    emailLink.textContent=config.recipients[0];
    submit.textContent=local?'Préparer un e-mail':'Envoyer le message';
    hint.textContent=local?'Ce bouton ouvre votre application de messagerie avec votre message prêt à envoyer.':'Les champs marqués d’un astérisque sont obligatoires.';
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values=Object.fromEntries(new FormData(form));
      if (values.website) return;
      if (local) {
        const body='Nom : '+values.name+'\nPrénom : '+values.firstName+'\nAdresse e-mail : '+values.email+'\n\n'+values.message;
        location.href='mailto:'+config.recipients.join(',')+'?subject='+encodeURIComponent('Contact — Orchestre Symphonique des Dômes')+'&body='+encodeURIComponent(body);
        status.textContent='Votre message a été préparé. Envoyez-le depuis votre application de messagerie.';
        return;
      }

    });
  }
})();
