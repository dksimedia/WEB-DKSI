/**
 * DKSI CMS — ADMIN LOGIC
 * Version: 2.0.0
 */

(function () {
  'use strict';

  const admin = {};

  const navItems = () => document.querySelectorAll('.nav-item[data-view]');
  const views = () => document.querySelectorAll('.view');

  function setView(name) {
    const allNav = navItems();
    allNav.forEach(a => a.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-view="${name}"]`);
    if (activeNav) activeNav.classList.add('active');

    const bc = document.getElementById('breadcrumb');
    if (bc) {
      const label = activeNav ? activeNav.textContent.trim() : name;
      bc.innerHTML = `<span class="text-slate-500">Dashboard</span> <i class="ri-arrow-right-s-line text-slate-600"></i> <span class="text-white">${label}</span>`;
    }

    if (name === 'dashboard') {
      document.getElementById('view-dashboard')?.classList.add('active');
      document.getElementById('view-editor')?.classList.remove('active');
      document.getElementById('view-editor')?.classList.add('hidden');
      refreshDashboard();
    } else {
      document.getElementById('view-dashboard')?.classList.remove('active');
      const ed = document.getElementById('view-editor');
      ed.classList.remove('hidden');
      ed.classList.add('active');
      renderEditor(name);
    }
  }

  function showToast(msg, type = 'info') {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = `<i class="ri-${type === 'success' ? 'checkbox-circle' : type === 'error' ? 'error-warning' : 'information'}-line"></i> ${msg}`;
    c.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; setTimeout(() => el.remove(), 300); }, 3000);
  }

  function confirmDialog(title, msg, danger = false) {
    return new Promise(resolve => {
      document.getElementById('confirmTitle').textContent = title;
      document.getElementById('confirmMsg').textContent = msg;
      const modal = document.getElementById('confirmModal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      const ok = document.getElementById('confirmOk');
      const cancel = document.getElementById('confirmCancel');
      ok.textContent = danger ? 'Delete' : 'Confirm';
      ok.className = danger ? 'btn-danger' : 'btn-primary';
      function cleanup(val) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        ok.removeEventListener('click', onOk);
        cancel.removeEventListener('click', onCancel);
        resolve(val);
      }
      function onOk() { cleanup(true); }
      function onCancel() { cleanup(false); }
      ok.addEventListener('click', onOk);
      cancel.addEventListener('click', onCancel);
    });
  }

  function refreshDashboard() {
    const data = window.CMS.get();
    const pfCount = Object.keys(data.portfolio.items || {}).length;
    const pubCount = Object.values(data.portfolio.items || {}).filter(v => v.status === 'published').length;
    const svcCount = (data.services || []).length;

    const elStatPub = document.getElementById('stat-published');
    const elStatDrafts = document.getElementById('stat-drafts');
    const elStatPf = document.getElementById('stat-portfolio');
    const elStatSvc = document.getElementById('stat-services');
    const elLastPub = document.getElementById('lastPublished');

    if (elStatPub) elStatPub.textContent = pubCount;
    if (elStatDrafts) elStatDrafts.textContent = (pfCount - pubCount);
    if (elStatPf) elStatPf.textContent = pfCount + ' Projects';
    if (elStatSvc) elStatSvc.textContent = svcCount + ' Services';
    if (elLastPub) {
      const d = data.meta?.lastPublished ? new Date(data.meta.lastPublished) : null;
      elLastPub.textContent = d ? d.toLocaleDateString('id-ID') : '—';
    }

    const actList = document.getElementById('activityList');
    if (actList) {
      const acts = window.CMS.getActivity().slice(0, 6);
      if (!acts.length) {
        actList.innerHTML = `<div class="empty-state py-6"><i class="ri-history-line"></i><p>No activity yet.</p></div>`;
      } else {
        actList.innerHTML = acts.map(a => `
          <div class="flex items-start gap-3 py-3 border-b border-slate-700/60 last:border-0">
            <div class="w-8 h-8 rounded-full bg-cyan/15 text-cyan grid place-items-center flex-shrink-0 mt-0.5"><i class="ri-edit-2-line text-xs"></i></div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-white">${a.action}</p>
              <p class="text-[11px] text-slate-400">${a.target}</p>
              <p class="text-[10px] text-slate-500 mt-1">${a.user} &middot; ${new Date(a.time).toLocaleString('id-ID')}</p>
            </div>
          </div>`).join('');
      }
    }
  }

  function renderEditor(name) {
    const ed = document.getElementById('view-editor');
    if (!ed) return;
    const data = window.CMS.get();

    const editors = {
      homepage: renderHomepageEditor,
      about: renderAboutEditor,
      process: renderProcessEditor,
      services: renderServicesEditor,
      solutions: renderSolutionsEditor,
      portfolio: renderPortfolioEditor,
      trusted: renderTrustedEditor,
      why: renderWhyEditor,
      compliance: renderComplianceEditor,
      contact: renderContactEditor,
      cta: renderCtaEditor,
      company: renderCompanyEditor,
      branding: renderBrandingEditor,
      leadership: renderLeadershipEditor,
      seo: renderSeoEditor,
      social: renderSocialEditor,
      media: renderMediaEditor,
      revisions: renderRevisionsEditor,
      activity: renderActivityEditor,
      contacts: renderContactsEditor,
      settings: renderSettingsEditor
    };

    const fn = editors[name];
    if (fn) ed.innerHTML = fn(data);
    else ed.innerHTML = `<div class="empty-state"><i class="ri-tools-line"></i><h3>${name.toUpperCase()} Editor</h3><p>Coming soon. You can request this content type to be implemented next.</p><button class="btn-primary mt-4" data-view="dashboard">Back to Dashboard</button></div>`;

    bindEditorEvents(name);
  }

  function bindEditorEvents(name) {
    const ed = document.getElementById('view-editor');

    ed.querySelectorAll('[data-view]').forEach(b => {
      b.addEventListener('click', e => {
        e.preventDefault();
        const v = b.getAttribute('data-view');
        if (v) setView(v);
      });
    });

    ed.querySelectorAll('[data-action]').forEach(b => {
      b.addEventListener('click', e => {
        const act = b.getAttribute('data-action');
        if (act === 'saveDraft') { doSave(name); }
        else if (act === 'preview') { window.open('../../frontend/index.html?preview=1', '_blank'); }
        else if (act === 'publish') { doPublish(name); }
        else if (act === 'addService') { addService(); }
        else if (act === 'addPortfolio') { addPortfolioItem(); }
        else if (act === 'addSolutionCategory') { addSolItem(); }
        else if (act === 'addWhy') { addWhyItem(); }
        else if (act === 'addCompliance') { addComplianceItem(); }
        else if (act === 'addTrusted') { addTrustedItem(); }
        else if (act === 'addProcess') { addProcessStep(); }
        else if (act === 'resetToDefault') { doReset(); }
      });
    });

    ed.querySelectorAll('.toggle-switch').forEach(el => {
      el.addEventListener('click', () => el.classList.toggle('on'));
    });
  }

  function collectFields_UNUSED() {
    const fields = {};
    document.querySelectorAll('[data-field]').forEach(el => {
      const key = el.getAttribute('data-field');
      if (el.type === 'checkbox') fields[key] = el.checked;
      else fields[key] = el.value;
    });
    return fields;
  }

  async function doSave(editorName) {
    const changes = {};
    let hasDataField = false;
    document.querySelectorAll('[data-field]').forEach(el => {
      hasDataField = true;
      const path = el.getAttribute('data-field');
      let rawVal;
      if (el.type === 'checkbox') rawVal = el.checked;
      else rawVal = el.value;
      // Handle textarea with one-per-line list (points/badges) — split by newline
      if (path.endsWith('.points') || path.endsWith('.badges')) rawVal = rawVal.split('\n').map(s => s.trim()).filter(Boolean);
      // Handle comma-separated list (sols/features/benefits)
      if ((path.endsWith('.sols') || path.endsWith('.features') || path.endsWith('.benefits')) && typeof rawVal === 'string' && rawVal.includes(',')) rawVal = rawVal.split(',').map(s => s.trim()).filter(Boolean);
      // Nested set via dotted path
      const parts = path.split('.');
      let cur = changes;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!(parts[i] in cur) || typeof cur[parts[i]] !== 'object' || Array.isArray(cur[parts[i]])) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = rawVal;
    });
    // Merge collected fields into live CMS data
    if (hasDataField && Object.keys(changes).length) {
      window.CMS.set(changes);
      // Dynamic renderer lives in js/script.js via #solutions-dynamic,
      // so no direct app call here — just notify
    } else {
      // Fallback: editor with no data-field inputs (e.g., portfolio table), skip merge
    }
    window.CMS.addActivity('Saved draft', editorName);
    window.CMS.revisionsPush(window.CMS.get());
    showToast('Draft saved successfully — data live in localStorage', 'success');
  }

  async function doPublish(editorName) {
    const ok = await confirmDialog('Publish this content?', 'This version will become visible on the live website.', false);
    if (!ok) return;
    const data = window.CMS.get();
    data.meta = data.meta || {};
    data.meta.lastPublished = new Date().toISOString();
    window.CMS.save(data);
    window.CMS.addActivity('Published content', editorName);
    window.CMS.revisionsPush(data);
    showToast('Published successfully!', 'success');
    refreshDashboard();
  }

  async function doReset() {
    const ok = await confirmDialog('Reset to defaults?', 'All custom edits will be permanently removed and Company Profile defaults restored. This action cannot be undone.', true);
    if (!ok) return;
    window.CMS.reset();
    window.CMS.addActivity('Reset to default', 'System reset');
    showToast('Reverted to Company Profile defaults', 'success');
    renderEditor(document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'dashboard');
    refreshDashboard();
  }

  function addService() {
    const data = window.CMS.get();
    data.services.push({ tag: String(data.services.length + 1).padStart(2, '0'), title: 'New Service', sub: 'Service subtitle', desc: 'Description here.', points: ['Feature 1', 'Feature 2'], visible: true });
    window.CMS.save(data);
    window.CMS.addActivity('Added service', 'New Service');
    showToast('Service added', 'success');
    renderEditor('services');
  }

  function addPortfolioItem() {
    const data = window.CMS.get();
    const key = 'new_' + Date.now();
    data.portfolio.items[key] = { title: 'New Project', client: 'Client Name', loc: 'Location', shortDesc: 'Short description', desc: 'Detailed description of project.', img: 'https://images.unsplash.com/photo-1556761175-5973aa6160b3?auto=format&fit=crop&w=800&q=80', cat: 'smart', featured: false, status: 'draft' };
    window.CMS.save(data);
    window.CMS.addActivity('Added portfolio', 'New Project');
    showToast('Portfolio added (Draft)', 'success');
    renderEditor('portfolio');
  }

  function addSolItem() {
    const data = window.CMS.get();
    data.solInfra.push({ icon: 'ri-service-line', title: 'New Solution', desc: 'Description placeholder.', visible: true });
    window.CMS.save(data);
    window.CMS.addActivity('Added solution', 'New Solution');
    showToast('Solution added', 'success');
    renderEditor('solutions');
  }

  function addWhyItem() {
    const data = window.CMS.get();
    data.why.push({ icon: 'ri-brain-line', title: 'New Reason', desc: 'Why customers choose DKSI.' });
    window.CMS.save(data);
    window.CMS.addActivity('Added why card', 'New Reason');
    showToast('Why card added', 'success');
    renderEditor('why');
  }

  function addComplianceItem() {
    const data = window.CMS.get();
    data.compliance.push({ icon: 'ri-shield-check-line', title: 'New Certification', subtitle: 'Subtitle', desc: 'Description.', points: ['Point 1', 'Point 2'] });
    window.CMS.save(data);
    window.CMS.addActivity('Added certification', 'New Certification');
    showToast('Certification added', 'success');
    renderEditor('compliance');
  }

  function addTrustedItem() {
    const data = window.CMS.get();
    data.trusted.push({ name: 'NEW CLIENT', subtitle: 'Client subtitle' });
    window.CMS.save(data);
    window.CMS.addActivity('Added client', 'NEW CLIENT');
    showToast('Client added', 'success');
    renderEditor('trusted');
  }

  function addProcessStep() {
    const data = window.CMS.get();
    const num = String(data.process.steps.length + 1).padStart(2, '0');
    data.process.steps.push({ num, title: 'New Step', desc: 'Step brief.', detail: 'Detailed description.' });
    window.CMS.save(data);
    window.CMS.addActivity('Added process step', 'Step ' + num);
    showToast('Process step added', 'success');
    renderEditor('process');
  }

  function editorHeader(title, subtitle) {
    return `
      <div class="editor-header">
        <div>
          <h2 class="editor-title">${title}</h2>
          <p class="editor-subtitle">${subtitle}</p>
        </div>
        <div class="editor-actions">
          <button class="btn-ghost" data-action="saveDraft"><i class="ri-save-line"></i> Save Draft</button>
          <button class="btn-secondary" data-action="preview"><i class="ri-eye-line"></i> Preview</button>
          <button class="btn-primary" data-action="publish"><i class="ri-upload-cloud-line"></i> Publish</button>
        </div>
      </div>`;
  }

  function inputField(label, placeholderOrValue, dataField, type = 'text', hint = '') {
    return `<div class="field"><label class="field-label">${label}</label><input data-field="${dataField}" type="${type}" class="field-input" placeholder="${placeholderOrValue}" value="${escapeHtml(placeholderOrValue)}" />${hint ? `<p class="field-hint">${hint}</p>` : ''}</div>`;
  }

  function textareaField(label, value, dataField, rows = 4, hint = '') {
    return `<div class="field"><label class="field-label">${label}</label><textarea data-field="${dataField}" class="field-textarea" rows="${rows}">${escapeHtml(value)}</textarea>${hint ? `<p class="field-hint">${hint}</p>` : ''}</div>`;
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  }

  function renderHomepageEditor(data) {
    const h = data.homepage;
    const heroPreview = `
      <h1 style="font-size: 2rem; font-weight: 800; color: #0A2D7A; line-height: 1;">${escapeHtml(h.headline)} <span style="background: linear-gradient(90deg, #0A2D7A, #25D6FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${escapeHtml(h.headlineAccent)}</span> ${escapeHtml(h.headlineSuffix)}</h1>
      <p style="color: #475569; margin-top: 1rem; line-height: 1.6;">${escapeHtml(h.description)}</p>
      <div style="display: flex; gap: .5rem; margin-top: 1rem;">
        <span style="background: #0A2D7A; color: #fff; padding: 10px 18px; border-radius: 999px; font-size: 10px; font-weight: 800;">${escapeHtml(h.primaryCtaText)}</span>
        <span style="background: #fff; color: #0A2D7A; border: 1px solid #e2e8f0; padding: 10px 18px; border-radius: 999px; font-size: 10px; font-weight: 800;">${escapeHtml(h.secondaryCtaText)}</span>
      </div>
    `;
    const heroBadgesPreview = (h.heroBadges || []).map(b => `<span style="background: #0A2D7A; color: #25D6FF; padding: 4px 10px; border-radius: 999px; font-size: 9px; font-weight: 800;">${escapeHtml(b)}</span>`).join(' ');
    return `
      ${editorHeader('Homepage Management', 'Edit hero section and trust bar. Changes apply on next site load after publish.')}
      <div class="editor-grid">
        <div class="cms-card"><div class="cms-card-header"><h3 class="cms-card-title">Hero Section</h3><span class="tag">Live Preview — Right Panel</span></div>
          <div class="p-6 field-group">
            ${inputField('Eyebrow (small label)', h.eyebrow, 'homepage.eyebrow')}
            <div class="field-row">
              ${inputField('Main Headline (line 1)', h.headline, 'homepage.headline')}
              ${inputField('Accent word (gradient)', h.headlineAccent, 'homepage.headlineAccent')}
            </div>
            ${inputField('Headline Suffix (line 2)', h.headlineSuffix, 'homepage.headlineSuffix')}
            ${textareaField('Description', h.description, 'homepage.description', 4)}
            <div class="field-row">
              ${inputField('Primary CTA Text', h.primaryCtaText, 'homepage.primaryCtaText')}
              ${inputField('Primary CTA Link', h.primaryCtaLink, 'homepage.primaryCtaLink')}
            </div>
            <div class="field-row">
              ${inputField('Secondary CTA Text', h.secondaryCtaText, 'homepage.secondaryCtaText')}
              ${inputField('Secondary CTA Link', h.secondaryCtaLink, 'homepage.secondaryCtaLink')}
            </div>
            ${inputField('Hero Image URL', h.heroImage, 'homepage.heroImage', 'text', 'Shown on the right side of hero. Use Media Library for uploads.')}
            ${textareaField('Badges (one per line)', (h.heroBadges || []).join('\n'), 'homepage.badges', 3)}
          </div>
        </div>
        <div class="preview-panel">
          <div class="preview-header"><h4>Live Preview — Hero</h4><span style="font-size: 10px; color: #94a3b8;">Desktop</span></div>
          <div class="preview-body">
            <div style="background: #eef2ff; border: 1px solid #dbeafe; display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; color: #0A2D7A;">${escapeHtml(h.eyebrow)}</div>
            ${heroPreview}
            <div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: .35rem;">${heroBadgesPreview}</div>
            <img src="${escapeHtml(h.heroImage)}" style="margin-top: 1.25rem; border-radius: 16px; width: 100%; height: 180px; object-fit: cover;">
          </div>
        </div>
      </div>
      <div class="cms-card mt-6">
        <div class="cms-card-header"><h3 class="cms-card-title">Trust Bar (5 stats)</h3></div>
        <div class="p-6">
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
            ${(data.trustBar || []).map((item, i) => `
              <div class="field"><label class="field-label">${escapeHtml(item.label)}</label>
                <input data-field="trustBar.${i}.label" class="field-input" value="${escapeHtml(item.label)}">
                <input data-field="trustBar.${i}.value" class="field-input mt-2" value="${escapeHtml(item.value)}" placeholder="Value">
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function renderAboutEditor(data) {
    const a = data.about;
    const cm = data.company;
    return `
      ${editorHeader('About DKSI', 'Profile and sector tabs. Maps to #about on the website.')}
      <div class="editor-grid">
        <div class="space-y-6">
          <div class="cms-card"><div class="cms-card-header"><h3 class="cms-card-title">Section Header</h3></div>
            <div class="p-6 field-group">
              ${inputField('Label (small badge)', a.label, 'about.label')}
              ${inputField('Headline', a.headline, 'about.headline')}
              ${textareaField('Description', a.paragraphs.join('\n\n'), 'about.paragraphs', 4, 'Two paragraphs separated by a blank line.')}
              <div class="field-row">
                ${inputField('ECT As button', a.ctaPrimary, 'about.ctaPrimary')}
                ${inputField('Link', a.ctaSecondary, 'about.ctaLink')}
              </div>
            </div>
          </div>
          <div class="cms-card"><div class="cms-card-header"><h3 class="cms-card-title">Sectors (3 tabs)</h3></div>
            <div class="p-6 repeater">
              ${Object.entries(data.sectors).map(([key, s]) => `
                <div class="repeater-item">
                  <div class="repeater-head"><span class="repeater-title">${escapeHtml(key)}</span><span class="tag">${escapeHtml(s.sols ? s.sols.length + ' sols' : '')}</span></div>
                  <textarea data-field="sectors.${key}.desc" class="field-textarea" rows="2">${escapeHtml(s.desc)}</textarea>
                  <input data-field="sectors.${key}.sols" class="field-input mt-2" value="${escapeHtml((s.sols || []).join(', '))}" placeholder="Bullets (comma-separated)">
                </div>`).join('')}
            </div>
          </div>
        </div>
        <div class="cms-card">
          <div class="cms-card-header"><h3 class="cms-card-title">Company Card (right)</h3></div>
          <div class="p-6 field-group">
            ${inputField('Company Tagline', cm.tagline, 'company.tagline')}
            ${inputField('Short Label (Since)', cm.city, 'company.city')}
            ${inputField('Established Year', cm.established, 'company.established')}
            ${inputField('Cert 1', cm.stats?.cert1 || 'ISO 9001:2015', 'company.stats.cert1')}
            ${inputField('Cert 2', cm.stats?.cert2 || 'TKDN Support', 'company.stats.cert2')}
          </div>
        </div>
      </div>`;
  }

  function renderProcessEditor(data) {
    const p = data.process;
    return `
      ${editorHeader('Process Management', '6-step interactive timeline (#process). Drag, add, delete, reorder.')}
      <div class="cms-card">
        <div class="cms-card-header">
          <h3 class="cms-card-title">Steps</h3>
          <button class="btn-primary" data-action="addProcess"><i class="ri-add-line"></i> Add Step</button>
        </div>
        <div class="p-6">
          <div class="field-row mb-4">
            ${inputField('Label', p.label, 'process.label')}
            ${inputField('Headline', p.headline, 'process.headline')}
          </div>
          <div class="repeater">
            ${(p.steps || []).map((s, i) => `
              <div class="repeater-item">
                <div class="repeater-head">
                  <span class="repeater-title">${escapeHtml(s.num)} — ${escapeHtml(s.title)}</span>
                  <div class="repeater-actions">
                    <button class="icon-btn" title="Reorder" disabled><i class="ri-drag-move-line"></i></button>
                    <button class="icon-btn danger" title="Delete" onclick="(function(){const d=CMS.get();d.process.steps.splice(${i},1);CMS.save(d);CMS.addActivity('Deleted process step', '${escapeHtml(s.title)}');location.reload();})()"><i class="ri-delete-bin-line"></i></button>
                  </div>
                </div>
                <div class="field-row">
                  ${inputField('Number', s.num, 'process.steps.'+i+'.num')}
                  ${inputField('Title', s.title, 'process.steps.'+i+'.title')}
                </div>
                ${inputField('Short Description', s.desc, 'process.steps.'+i+'.desc')}
                ${textareaField('Detail (long)', s.detail, 'process.steps.'+i+'.detail', 3)}
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function renderServicesEditor(data) {
    return `
      ${editorHeader('Services Management', 'Manage service cards (#services). 5 cards by default — add, duplicate, delete, reorder, publish/unpublish.')}
      <div class="cms-card">
        <div class="cms-card-header">
          <h3 class="cms-card-title">Services</h3>
          <button class="btn-primary" data-action="addService"><i class="ri-add-line"></i> Add Service</button>
        </div>
        <div class="p-6 repeater">
          ${(data.services || []).map((s, i) => `
            <div class="repeater-item">
              <div class="repeater-head">
                <span class="repeater-title">${escapeHtml(s.tag || String(i+1).padStart(2,'0'))} — ${escapeHtml(s.title)}</span>
                <div class="repeater-actions">
                  <button class="icon-btn primary ${s.visible === false ? '' : 'danger'}" title="Toggle visible"><i class="ri-${s.visible === false ? 'eye-close' : 'eye'}-line"></i></button>
                  <button class="icon-btn danger" title="Delete" onclick="(function(){const d=CMS.get();d.services.splice(${i},1);CMS.save(d);CMS.addActivity('Deleted service', '${escapeHtml(s.title)}');location.reload();})()"><i class="ri-delete-bin-line"></i></button>
                </div>
              </div>
              <div class="field-row">
                ${inputField('Tag', s.tag, 'services.'+i+'.tag')}
                ${inputField('Icon (RemixIcon class)', s.icon || 'ri-service-line', 'services.'+i+'.icon', 'text', 'e.g. ri-server-line')}
              </div>
              ${inputField('Title', s.title, 'services.'+i+'.title')}
              ${inputField('Subtitle', s.sub, 'services.'+i+'.sub')}
              ${textareaField('Description', s.desc, 'services.'+i+'.desc', 3)}
              ${textareaField('Features (one per line)', (s.points || []).join('\n'), 'services.'+i+'.points', 3)}
            </div>`).join('')}
        </div>
      </div>`;
  }

  function renderSolutionsEditor(data) {
    const cats = data.solCategories || [
      { id: 'solInfra', name: 'IT Infrastructure' },
      { id: 'solEdu', name: 'Smart Education' },
      { id: 'solAi', name: 'AI & Smart Innovation' }
    ];
    const addCatBtn = (cat) => `
      <div class="cms-card mt-6">
        <div class="cms-card-header">
          <h3 class="cms-card-title">Add New Solution Category</h3>
          <span class="status-pill">Admin Tool</span>
        </div>
        <div class="p-6">
          <p class="text-sm text-slate-400 mb-4">Create a new solution category. Each category will become a section in the website with its own grid of solutions.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input class="field-input" placeholder="Category ID (e.g. solCloud)" id="newCatId">
            <input class="field-input" placeholder="Display Name" id="newCatName">
            <input class="field-input sm:col-span-2" placeholder="Short Description" id="newCatDesc">
            <input class="field-input" placeholder="Icon class (RemixIcon)" id="newCatIcon">
          </div>
          <button class="btn-primary mt-4" onclick="admin.addSolutionCategory()"><i class="ri-add-line"></i> Create Category</button>
        </div>
      </div>`;

    return `
      ${editorHeader('Solutions Management', 'Add new solution categories, manage solutions per category, upload images, edit details.')}
      <div class="grid lg:grid-cols-3 gap-6">
        ${cats.map(cat => {
          const arr = data[cat.id] || [];
          return `<div class="cms-card">
            <div class="cms-card-header">
              <h3 class="cms-card-title">${escapeHtml(cat.name)}</h3>
              <span class="status-pill">${arr.length} items</span>
            </div>
            <div class="p-4">
              ${cat.desc ? `<p class="text-xs text-slate-400 mb-4">${escapeHtml(cat.desc)}</p>` : ''}
              <div class="repeater">
                ${arr.map((s, i) => `
                  <div class="repeater-item">
                    <div class="repeater-head">
                      <span class="repeater-title">${escapeHtml(s.icon || 'icon')} &middot; ${escapeHtml(s.title)}</span>
                      <div class="repeater-actions">
                        <button class="icon-btn danger" title="Delete" onclick="admin.deleteSolutionItem('${cat.id}', ${i})"><i class="ri-delete-bin-line"></i></button>
                      </div>
                    </div>
                    <div class="flex gap-3 mb-3">
                      <img src="${escapeHtml(s.img || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=200&q=60')}" class="w-20 h-20 rounded-xl object-cover bg-slate-800 flex-shrink-0" onerror="this.src='https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=200&q=60'">
                      <div class="flex-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Solution Image</label>
                        <div class="flex gap-2 mt-1">
                          <input class="field-input flex-1" data-field="${cat.id}.${i}.img" value="${escapeHtml(s.img || '')}" placeholder="Image URL or /assets/...">
                          <label class="btn-secondary cursor-pointer flex items-center gap-1">
                            <i class="ri-image-line"></i> Upload
                            <input type="file" accept="image/*" class="hidden" onchange="admin.uploadSolutionImage(this, '${cat.id}', ${i})">
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="field-row">
                      <input data-field="${cat.id}.${i}.icon" class="field-input" value="${escapeHtml(s.icon || '')}" placeholder="ri-server-line">
                      <input data-field="${cat.id}.${i}.title" class="field-input" value="${escapeHtml(s.title || '')}" placeholder="Solution Title">
                    </div>
                    <textarea data-field="${cat.id}.${i}.shortDesc" class="field-textarea mt-2" rows="2" placeholder="Short description (1-2 lines)">${escapeHtml(s.shortDesc || s.desc || '')}</textarea>
                    <textarea data-field="${cat.id}.${i}.desc" class="field-textarea mt-2" rows="3" placeholder="Detailed description">${escapeHtml(s.desc || '')}</textarea>
                    <input data-field="${cat.id}.${i}.features" class="field-input mt-2" value="${escapeHtml((s.features || []).join(', '))}" placeholder="Features (comma-separated)">
                    <input data-field="${cat.id}.${i}.benefits" class="field-input mt-2" value="${escapeHtml((s.benefits || []).join(', '))}" placeholder="Benefits (comma-separated)">
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-[10px] font-bold uppercase text-slate-400">Status</span>
                      <select data-field="${cat.id}.${i}.status" class="field-input flex-1">
                        <option value="published" ${s.status === 'published' ? 'selected' : ''}>Published</option>
                        <option value="draft" ${s.status === 'draft' ? 'selected' : ''}>Draft</option>
                        <option value="archived" ${s.status === 'archived' ? 'selected' : ''}>Archived</option>
                      </select>
                    </div>
                  </div>`).join('')}
                <button class="btn-primary w-full mt-3" onclick="admin.addSolutionItem('${cat.id}')"><i class="ri-add-line"></i> Add Solution</button>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
      ${addCatBtn()}`;
  }

  function renderPortfolioEditor(data) {
    const items = data.portfolio?.items || {};
    const rows = Object.entries(items).map(([k, v]) => `
      <tr>
        <td><b>${escapeHtml(v.title)}</b></td>
        <td>${escapeHtml(v.client)}</td>
        <td><span class="status-pill ${v.status === 'published' ? 'published' : 'draft'}">${escapeHtml(v.status || 'draft')}</span></td>
        <td>${escapeHtml(v.loc)}</td>
        <td class="flex gap-1">
          <button class="icon-btn" title="Edit" onclick="admin.editPortfolio('${escapeHtml(k)}')" ><i class="ri-edit-2-line"></i></button>
          <button class="icon-btn danger" title="Delete" onclick="admin.deletePortfolio('${escapeHtml(k)}')"><i class="ri-delete-bin-line"></i></button>
        </td>
      </tr>`).join('');
    return `
      ${editorHeader('Portfolio Management', 'Project showcase (#portfolio). Add, edit, delete, filter, publish/unpublish.')}
      <div class="cms-card">
        <div class="cms-card-header">
          <h3 class="cms-card-title">Projects</h3>
          <div class="flex gap-2">
            <button class="btn-primary" data-action="addPortfolio"><i class="ri-add-line"></i> Add Project</button>
          </div>
        </div>
        <div class="overflow-auto">
          <table class="cms-table">
            <thead><tr><th>Project</th><th>Client</th><th>Status</th><th>Location</th><th>Action</th></tr></thead>
            <tbody>${rows || '<tr><td colspan="5" class="text-center text-slate-500 py-6">No projects</td></tr>'}</tbody>
          </table>
        </div>
      </div>`;
  }

  function renderTrustedEditor(data) {
    return `
      ${editorHeader('Trusted By — Clients', 'Logo strip (#trusted). Add, edit, delete, reorder.')}
      <div class="cms-card">
        <div class="cms-card-header">
          <h3 class="cms-card-title">Client Logos</h3>
          <button class="btn-primary" data-action="addTrusted"><i class="ri-add-line"></i> Add Client</button>
        </div>
        <div class="p-6 repeater">
          ${(data.trusted || []).map((c, i) => `
            <div class="repeater-item">
              <div class="repeater-head">
                <span class="repeater-title">${escapeHtml(c.name)}</span>
                <button class="icon-btn danger" onclick="(function(){const d=CMS.get();d.trusted.splice(${i},1);CMS.save(d);location.reload();})()"><i class="ri-delete-bin-line"></i></button>
              </div>
              <div class="field-row">
                ${inputField('Name', c.name, 'trusted.'+i+'.name')}
                ${inputField('Subtitle', c.subtitle || '', 'trusted.'+i+'.subtitle')}
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function renderWhyEditor(data) {
    return `
      ${editorHeader('Why DKSI', '4 cards (#why).')}
      <div class="cms-card">
        <div class="cms-card-header">
          <h3 class="cms-card-title">Why Cards</h3>
          <button class="btn-primary" data-action="addWhy"><i class="ri-add-line"></i> Add Card</button>
        </div>
        <div class="p-6 repeater">
          ${(data.why || []).map((w, i) => `
            <div class="repeater-item">
              <div class="repeater-head">
                <span class="repeater-title">${escapeHtml(w.title)}</span>
                <button class="icon-btn danger" onclick="(function(){const d=CMS.get();d.why.splice(${i},1);CMS.save(d);location.reload();})()"><i class="ri-delete-bin-line"></i></button>
              </div>
              ${inputField('Icon class', w.icon, 'why.'+i+'.icon')}
              ${inputField('Title', w.title, 'why.'+i+'.title')}
              ${textareaField('Description', w.desc, 'why.'+i+'.desc', 2)}
            </div>`).join('')}
        </div>
      </div>`;
  }

  function renderComplianceEditor(data) {
    return `
      ${editorHeader('Certification & Compliance', '2 cards (#compliance: ISO & TKDN).')}
      <div class="cms-card">
        <div class="cms-card-header">
          <h3 class="cms-card-title">Certificates</h3>
          <button class="btn-primary" data-action="addCompliance"><i class="ri-add-line"></i> Add Certificate</button>
        </div>
        <div class="p-6 repeater">
          ${(data.compliance || []).map((c, i) => `
            <div class="repeater-item">
              <div class="repeater-head">
                <span class="repeater-title">${escapeHtml(c.title)}</span>
                <button class="icon-btn danger" onclick="(function(){const d=CMS.get();d.compliance.splice(${i},1);CMS.save(d);location.reload();})()"><i class="ri-delete-bin-line"></i></button>
              </div>
              ${inputField('Title', c.title, 'compliance.'+i+'.title')}
              ${inputField('Subtitle', c.subtitle, 'compliance.'+i+'.subtitle')}
              ${textareaField('Description', c.desc, 'compliance.'+i+'.desc', 2)}
              ${textareaField('Points (one per line)', (c.points || []).join('\n'), 'compliance.'+i+'.points', 2)}
            </div>`).join('')}
        </div>
      </div>`;
  }

  function renderContactEditor(data) {
    const c = data.contact;
    const cm = data.company;
    return `
      ${editorHeader('Contact Management', 'Contact info and message form (#contact + footer).')}
      <div class="cms-card"><div class="cms-card-header"><h3 class="cms-card-title">Contact Info</h3></div>
        <div class="p-6 field-group">
          <div class="field-row">
            ${inputField('Company Email', cm.email, 'company.email')}
            ${inputField('Phone / WhatsApp', cm.phone, 'company.phone')}
          </div>
          ${textareaField('Address', cm.address, 'company.address', 3)}
          ${inputField('Website', cm.website, 'company.website')}
          ${inputField('Contact Headline', c.title, 'contact.title')}
          <div class="field-row">
            ${inputField('Submit Button Text', c.submitText, 'contact.submitText')}
            ${inputField('Success Message', c.successMsg, 'contact.successMsg')}
          </div>
        </div>
      </div>`;
  }

  function renderCtaEditor(data) {
    const f = data.finalCta;
    return `
      ${editorHeader('CTA Management', 'Final call-to-action banner + hero CTA.')}
      <div class="cms-card"><div class="cms-card-header"><h3 class="cms-card-title">Final CTA (full-width banner)</h3></div>
        <div class="p-6 field-group">
          ${inputField('Small Label', f.label, 'finalCta.label')}
          ${inputField('Headline', f.headline, 'finalCta.headline')}
          ${textareaField('Description', f.description, 'finalCta.description', 3)}
          <div class="field-row">
            ${inputField('Primary CTA Text', f.primaryText, 'finalCta.primaryText')}
            ${inputField('Primary Link', f.primaryLink, 'finalCta.primaryLink')}
          </div>
          <div class="field-row">
            ${inputField('Secondary CTA Text', f.secondaryText, 'finalCta.secondaryText')}
            ${inputField('Secondary Link', f.secondaryLink, 'finalCta.secondaryLink')}
          </div>
        </div>
      </div>`;
  }

  function renderCompanyEditor(data) {
    const cm = data.company;
    return `
      ${editorHeader('Company Information', 'Global company data used across header, about, footer, contact, SEO.')}
      <div class="cms-card"><div class="cms-card-header"><h3 class="cms-card-title">Company Profile</h3></div>
        <div class="p-6 field-group">
          ${inputField('Company Name (Legal)', cm.name, 'company.name')}
          ${inputField('Brand / Short Name', cm.shortName, 'company.shortName')}
          ${inputField('Tagline', cm.tagline, 'company.tagline')}
          ${inputField('Sub-Tagline', cm.subTagline, 'company.subTagline')}
          <div class="field-row">
            ${inputField('Established Year', cm.established, 'company.established')}
            ${inputField('City / Region', cm.city, 'company.city')}
          </div>
          ${inputField('Budged? (footer city line)', cm.city, 'company.city')}
        </div>
      </div>`;
  }

  function renderBrandingEditor(data) {
    const b = data.branding || {};
    const preview = (label, url, field) => `
      <div class="cms-card">
        <div class="cms-card-header"><h3 class="cms-card-title">${label}</h3>${label === 'Favicon' ? '<span class="tag">32×32</span>' : ''}</div>
        <div class="p-6">
          <div class="aspect-[3/1] rounded-xl border border-slate-700 flex items-center justify-center p-4 bg-slate-800 mb-4">
            <img src="${escapeHtml(url || b.mainLogo || 'assets/logo/main.png')}" class="max-h-20 max-w-full" alt="${label}">
          </div>
          <div class="flex items-center gap-2">
            <input data-field="branding.${field}" class="field-input flex-1" value="${escapeHtml(url || '')}" placeholder="assets/logo/...png">
            <label class="btn-primary cursor-pointer flex items-center gap-2">
              <i class="ri-upload-line"></i> Upload
              <input type="file" accept="image/*" class="hidden" onchange="admin.uploadLogo(this, '${field}')">
            </label>
          </div>
        </div>
      </div>`;
    return `
      ${editorHeader('Branding & Logo', 'Main logo (footer) + secondary light/dark + favicon. Auto-switch on theme.')}
      <div class="grid lg:grid-cols-2 gap-6">
        ${preview('Main Logo', b.mainLogo, 'mainLogo')}
        ${preview('Secondary Light', b.secondaryLight, 'secondaryLight')}
      </div>
      <div class="grid lg:grid-cols-2 gap-6 mt-6">
        ${preview('Secondary Dark', b.secondaryDark, 'secondaryDark')}
        ${preview('Favicon', b.favicon || b.mainLogo, 'favicon')}
      </div>
      <div class="cms-card mt-6"><div class="cms-card-header"><h3 class="cms-card-title">Tips</h3></div>
        <div class="p-6 text-sm text-slate-400 space-y-2">
          <p><b class="text-white">Main:</b> footer (always above dark).</p>
          <p><b class="text-white">Secondary Light:</b> navbar + about card (light theme).</p>
          <p><b class="text-white">Secondary Dark:</b> navbar + about card (dark theme).</p>
          <p><b class="text-white">Favicon:</b> browser tab icon. Use 32×32 PNG or ICO. Leave empty to keep Main logo.</p>
          <p>Max 200KB per logo. PNG / SVG / WebP / ICO supported.</p>
        </div>
      </div>`;
  }

  function renderLeadershipEditor(/*data*/) {
    return `${editorHeader('Leadership', 'Personnel management (structure ready, add team members here).')}
      <div class="cms-card"><div class="p-6"><div class="empty-state"><i class="ri-team-line"></i><h3>No leadership data yet</h3><p>Add Director, Commissioner, and operational heads.</p><button class="btn-primary" onclick="showToast('Add leadership — implement form UI next','info')"><i class="ri-add-line"></i> Add Member</button></div></div></div>`;
  }

  function renderSeoEditor(data) {
    const s = data.seo;
    const prevTitle = s.title || data.company.name;
    const prevDesc = s.description || '';
    return `
      ${editorHeader('SEO Management', 'Title, meta description, OG, and slug. Previews shown below.')}
      <div class="editor-grid">
        <div class="cms-card"><div class="cms-card-header"><h3 class="cms-card-title">Meta Fields</h3></div>
          <div class="p-6 field-group">
            ${inputField('SEO Title', s.title, 'seo.title')}
            ${textareaField('Meta Description', s.description, 'seo.description', 3)}
            ${inputField('Keywords', s.keywords, 'seo.keywords')}
            ${inputField('OG Image URL', s.ogImage, 'seo.ogImage')}
            ${inputField('Canonical URL', s.canonical || cmUrl(), 'seo.canonical')}
          </div>
        </div>
        <div class="preview-panel">
          <div class="preview-header"><h4>Google Search Preview</h4></div>
          <div class="preview-body">
            <div style="background: #fff; border-radius: 8px; padding: 1rem; border: 1px solid #e2e8f0;">
              <p style="color: #1a0dab; font-size: 18px; margin-bottom: .25rem;">${escapeHtml(prevTitle)}</p>
              <p style="color: #006621; font-size: 13px; margin-bottom: .35rem;">${escapeHtml(data.company.website)}</p>
              <p style="color: #545454; font-size: 13px;">${escapeHtml(prevDesc.slice(0, 160))}</p>
            </div>
            <div style="margin-top: 1.5rem; background: #1e293b; border-radius: 8px; padding: 1rem; color: #cbd5e1;">
              <p style="font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #94a3b8; margin-bottom: .75rem;">Social Sharing</p>
              <img src="${escapeHtml(s.ogImage || '')}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: .75rem;">
              <p style="color: #fff; font-weight: 700;">${escapeHtml(prevTitle)}</p>
              <p style="color: #94a3b8; font-size: 12px;">${escapeHtml(prevDesc.slice(0, 120))}</p>
            </div>
          </div>
        </div>
      </div>`;
    function cmUrl() { return (window.CMS.get()?.company?.website) || ''; }
  }

  function renderSocialEditor(data) {
    const sc = data.social || {};
    return `
      ${editorHeader('Social Media', 'Links used in footer and contact.')}
      <div class="cms-card"><div class="cms-card-header"><h3 class="cms-card-title">Social Profiles</h3></div>
        <div class="p-6 field-group">
          ${inputField('LinkedIn URL', sc.linkedin, 'social.linkedin')}
          ${inputField('Instagram URL', sc.instagram, 'social.instagram')}
          ${inputField('Twitter / X URL', sc.twitter, 'social.twitter')}
          ${inputField('Facebook URL', sc.facebook, 'social.facebook')}
          ${inputField('YouTube URL', sc.youtube, 'social.youtube')}
          ${inputField('Email (mailto:)', sc.email, 'social.email')}
          <div class="field"><label class="field-label">Social Icons in Footer Preview</label><div class="flex gap-3 pt-2">${['linkedin','instagram','youtube','facebook','email'].map(k=>`<span class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs">${k.charAt(0).toUpperCase()}</span>`).join('')}</div></div>
        </div>
      </div>`;
  }

  function renderMediaEditor() {
    const media = window.CMS.getMedia();
    return `
      ${editorHeader('Media Library', 'Centralized uploads — images, logos, hero, portfolio, etc.')}
      <div class="cms-card">
        <div class="cms-card-header">
          <h3 class="cms-card-title">Uploads</h3>
          <label class="btn-primary cursor-pointer">
            <i class="ri-upload-line"></i> Upload
            <input type="file" id="mediaFile" accept="image/*" class="hidden" onchange="admin.handleMediaUpload(this)">
          </label>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            ${media.length ? media.map(m => `
              <div class="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <img src="${escapeHtml(m.url)}" alt="" style="width: 100%; height: 120px; object-fit: cover;">
                <div class="p-3">
                  <p class="text-xs font-bold text-white truncate">${escapeHtml(m.name)}</p>
                  <p class="text-[10px] text-slate-400 truncate">${escapeHtml(m.alt || m.url.slice(0, 28))}</p>
                  <button class="btn-ghost w-full mt-2 text-[10px]" onclick="navigator.clipboard.writeText('${escapeHtml(m.url)}');showToast('URL copied','success')">Copy URL</button>
                </div>
              </div>`).join('') : `<div class="empty-state col-span-full"><i class="ri-image-2-line"></i><h3>No media yet</h3><p>Upload hero, portfolio, and client images here.</p></div>`}
          </div>
        </div>
      </div>`;
  }

  function renderRevisionsEditor() {
    const revs = window.CMS.revisionsList();
    return `
      ${editorHeader('Revision History', 'Every save/publish creates a snapshot. Restore any version.')}
      <div class="cms-card">
        <div class="overflow-auto">
          <table class="cms-table">
            <thead><tr><th>Version</th><th>User</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              ${revs.length ? revs.map((r, i) => `
                <tr>
                  <td><span class="tag">v${revs.length - i}</span></td>
                  <td>${escapeHtml(r.user)}</td>
                  <td class="text-[11px] text-slate-400">${new Date(r.date).toLocaleString('id-ID')}</td>
                  <td><button class="btn-secondary" onclick="admin.restoreRevision(${r.id})">Restore</button></td>
                </tr>`).join('') : '<tr><td colspan="4" class="text-center text-slate-500 py-6">No revisions</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderActivityEditor() {
    const acts = window.CMS.getActivity();
    return `
      ${editorHeader('Activity Log', 'Login, create, edit, delete, publish, upload, restore.')}
      <div class="cms-card">
        <div class="overflow-auto">
          <table class="cms-table">
            <thead><tr><th>Action</th><th>Content</th><th>User</th><th>Time</th></tr></thead>
            <tbody>
              ${acts.length ? acts.map(a => `
                <tr>
                  <td><span class="status-pill published">${escapeHtml(a.action)}</span></td>
                  <td>${escapeHtml(a.target)}</td>
                  <td>${escapeHtml(a.user)}</td>
                  <td class="text-[11px] text-slate-400">${new Date(a.time).toLocaleString('id-ID')}</td>
                </tr>`).join('') : '<tr><td colspan="4" class="text-center text-slate-500 py-6">No activity</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderContactsEditor() {
    const contacts = window.CMS.contactsList();
    return `
      ${editorHeader('Inquiries — Contact Submissions', 'Form submissions from #contact. Status: New / Read / Contacted / Closed.')}
      <div class="cms-card">
        <div class="overflow-auto">
          <table class="cms-table">
            <thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              ${contacts.length ? contacts.map(c => `
                <tr>
                  <td><b>${escapeHtml(c.name)}</b></td>
                  <td>${escapeHtml(c.company)}</td>
                  <td class="text-cyan text-xs">${escapeHtml(c.email)}</td>
                  <td class="text-xs text-slate-300">${escapeHtml(c.phone || '-')}</td>
                  <td><span class="status-pill ${c.status === 'New' ? 'new' : c.status === 'Contacted' ? 'contacted' : c.status === 'Closed' ? 'closed' : 'read'}">${escapeHtml(c.status)}</span></td>
                  <td class="text-[11px] text-slate-400">${new Date(c.date).toLocaleString('id-ID')}</td>
                </tr>`).join('') : '<tr><td colspan="6" class="text-center text-slate-500 py-6">No inquiries yet. Fill the contact form on the website to test.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderSettingsEditor() {
    const data = window.CMS.get();
    return `
      ${editorHeader('Settings', 'Global settings and system tools.')}
      <div class="cms-card"><div class="cms-card-header"><h3 class="cms-card-title">System</h3></div>
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div><p class="font-bold text-white">Storage location</p><p class="text-xs text-slate-400">localStorage key: <code>${window.CMS.KEY}</code></p></div>
            <button class="btn-secondary" onclick="admin.exportData()"><i class="ri-download-line"></i> Export</button>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div><p class="font-bold text-white">Import data</p><p class="text-xs text-slate-400">Replace CMS contents from a JSON file.</p></div>
            <button class="btn-secondary" onclick="admin.importData()"><i class="ri-upload-line"></i> Import</button>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div><p class="font-bold text-rose-300">Reset to Company Profile defaults</p><p class="text-xs text-slate-400">Permanently discards all custom edits.</p></div>
            <button class="btn-danger" data-action="resetToDefault"><i class="ri-refresh-line"></i> Reset</button>
          </div>
          <div class="divider"></div>
          <div class="flex items-center justify-between">
            <div><p class="font-bold text-white">Revisions</p><p class="text-xs text-slate-400">${window.CMS.revisionsList().length} snapshots / 30 max</p></div>
            <span class="text-xs font-bold text-cyan">${data.meta?.version ? 'v' + data.meta.version : 'v2'}</span>
          </div>
        </div>
      </div>`;
  }

  function initAuth() {
    const loginScreen = document.getElementById('loginScreen');
    const adminApp = document.getElementById('adminApp');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const AUTH_KEY = 'dksi_admin_auth';

    function showAdmin() {
      loginScreen.style.display = 'none';
      adminApp.classList.remove('hidden');
      refreshDashboard();
    }

    function showLogin() {
      loginScreen.style.display = 'flex';
      adminApp.classList.add('hidden');
    }

    if (localStorage.getItem(AUTH_KEY) === '1') showAdmin();
    else showLogin();

    loginForm?.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value?.trim();
      const pass = document.getElementById('loginPass')?.value;
      if (email && pass) {
        localStorage.setItem(AUTH_KEY, '1');
        window.CMS.addActivity('Admin login', email);
        showAdmin();
        showToast('Signed in — welcome back', 'success');
      } else {
        showToast('Please enter email and password', 'error');
      }
    });

    logoutBtn?.addEventListener('click', () => {
      localStorage.removeItem(AUTH_KEY);
      window.CMS.addActivity('Admin logout', 'Session ended');
      showLogin();
      showToast('Signed out', 'info');
    });
  }

  window.admin = {
    showToast, confirmDialog,

    exportData() {
      const blob = new Blob([JSON.stringify(window.CMS.get(), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dksi-cms-export-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported JSON', 'success');
    },

    importData() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result);
            window.CMS.save(data);
            window.CMS.addActivity('Imported data', file.name);
            window.CMS.revisionsPush(data);
            showToast('Import successful — reload', 'success');
            setTimeout(() => location.reload(), 500);
          } catch (err) {
            showToast('Invalid JSON', 'error');
          }
        };
        reader.readAsText(file);
      };
      input.click();
    },

    resetData() { doReset(); },

    uploadLogo(input, field) {
      const file = input.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) { showToast('Only images allowed', 'error'); return; }
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result;
        const cur = window.CMS.get();
        cur.branding = cur.branding || {};
        cur.branding[field] = url;
        window.CMS.save(cur);
        window.CMS.addActivity('Uploaded logo (' + field + ')', file.name);
        window.CMS.revisionsPush(cur);
        showToast('Logo updated — publish to reflect on website', 'success');
        renderEditor('branding');
      };
      reader.readAsDataURL(file);
    },

    handleMediaUpload(input) {
      const file = input.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) { showToast('Only images allowed', 'error'); return; }
      const reader = new FileReader();
      reader.onload = () => {
        window.CMS.addMedia({ url: reader.result, name: file.name, alt: file.name, size: file.size, category: 'general' });
        window.CMS.addActivity('Uploaded media', file.name);
        showToast('Uploaded — ' + file.name, 'success');
        renderEditor('media');
      };
      reader.readAsDataURL(file);
    },

    uploadSolutionImage(input, catId, idx) {
      const file = input.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) { showToast('Only images allowed', 'error'); return; }
      const reader = new FileReader();
      reader.onload = () => {
        const cur = window.CMS.get();
        cur[catId] = cur[catId] || [];
        cur[catId][idx] = cur[catId][idx] || {};
        cur[catId][idx].img = reader.result;
        window.CMS.save(cur);
        window.CMS.addActivity('Uploaded solution image', catId + '#' + idx);
        window.CMS.revisionsPush(cur);
        showToast('Image uploaded for solution — Save Draft → Publish', 'success');
        renderEditor('solutions');
      };
      reader.readAsDataURL(file);
    },

    addSolutionItem(catId) {
      const cur = window.CMS.get();
      cur[catId] = cur[catId] || [];
      cur[catId].push({ id: catId + '-' + Date.now(), icon: 'ri-service-line', title: 'New Solution', shortDesc: 'Short description.', desc: 'Detailed description here.', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', features: ['Feature 1', 'Feature 2'], benefits: ['Benefit 1'], status: 'draft' });
      window.CMS.save(cur);
      window.CMS.addActivity('Added solution', catId + ' — New Solution');
      showToast('Solution added (Draft)', 'success');
      renderEditor('solutions');
    },

    deleteSolutionItem(catId, idx) {
      const cur = window.CMS.get();
      const item = cur[catId]?.[idx];
      confirmDialog('Delete this solution?', item?.title ? '"' + item.title + '" will be permanently removed.' : 'This solution will be deleted.', true).then(ok => {
        if (!ok) return;
        cur[catId].splice(idx, 1);
        window.CMS.save(cur);
        window.CMS.addActivity('Deleted solution', catId + '#' + idx);
        showToast('Solution deleted', 'success');
        renderEditor('solutions');
      });
    },

    addSolutionCategory() {
      const idEl = document.getElementById('newCatId');
      const nameEl = document.getElementById('newCatName');
      const descEl = document.getElementById('newCatDesc');
      const iconEl = document.getElementById('newCatIcon');
      const id = (idEl?.value || '').trim();
      const name = (nameEl?.value || '').trim();
      if (!id || !name) { showToast('Please fill Category ID and Name', 'error'); return; }
      if (!/^sol[A-Za-z]+$/.test(id)) { showToast('Category ID must start with sol (e.g. solCloud)', 'error'); return; }
      const cur = window.CMS.get();
      if (cur[id]) { showToast('Category ID already exists', 'error'); return; }
      cur[id] = [];
      cur.solCategories = cur.solCategories || [];
      cur.solCategories.push({ id, name, desc: descEl?.value || '', icon: iconEl?.value || 'ri-service-line', color: 'royal' });
      window.CMS.save(cur);
      window.CMS.addActivity('Added category', name);
      showToast('Category created — add solutions now', 'success');
      renderEditor('solutions');
    },

    restoreRevision(id) {
      const list = window.CMS.revisionsList();
      const rev = list.find(r => String(r.id) === String(id));
      if (!rev) return;
      confirmDialog('Restore this version?', 'Current content will be replaced by this snapshot. A new revision will be created first.', false).then(ok => {
        if (!ok) return;
        window.CMS.revisionsPush(window.CMS.get());
        window.CMS.save(rev.data);
        showToast('Version restored', 'success');
        renderEditor(document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'revisions');
      });
    },

    editPortfolio(key) {
      const item = window.CMS.get().portfolio.items[key];
      if (!item) return;
      const nextTitle = prompt('Project title', item.title);
      if (nextTitle === null) return;
      item.title = nextTitle;
      const nextClient = prompt('Client', item.client);
      if (nextClient !== null) item.client = nextClient;
      const nextLoc = prompt('Location', item.loc);
      if (nextLoc !== null) item.loc = nextLoc;
      const nextShort = prompt('Short description', item.shortDesc || item.desc);
      if (nextShort !== null) item.shortDesc = nextShort;
      const data = window.CMS.get();
      data.portfolio.items[key] = item;
      window.CMS.save(data);
      window.CMS.addActivity('Edited portfolio', item.title);
      showToast('Portfolio updated', 'success');
      renderEditor('portfolio');
    },

    deletePortfolio(key) {
      const item = window.CMS.get().portfolio.items[key];
      confirmDialog('Delete this project?', '\"' + escapeHtml(item.title) + '\" will be permanently removed.', true).then(ok => {
        if (!ok) return;
        const d = window.CMS.get();
        delete d.portfolio.items[key];
        window.CMS.save(d);
        window.CMS.addActivity('Deleted portfolio', item.title);
        showToast('Project deleted', 'success');
        renderEditor('portfolio');
      });
    }
  };

  function initNav() {
    document.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const view = el.getAttribute('data-view');
        if (view) setView(view);
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
      });
    });

    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    sidebarToggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));

    const consultClose = document.getElementById('confirmModal');
    consultClose?.addEventListener('click', e => {
      if (e.target.id === 'confirmModal') {
        consultClose.classList.add('hidden');
        consultClose.classList.remove('flex');
      }
    });

    document.addEventListener('click', e => {
      if (e.target.id === 'confirmModal') {
        const m = document.getElementById('confirmModal');
        m.classList.add('hidden'); m.classList.remove('flex');
      }
    });
  }

  if (document.getElementById('loginScreen')) initAuth();
  if (document.querySelector('nav.sidebar-nav')) initNav();
  if (document.querySelector('#view-dashboard')) refreshDashboard();

  window.addEventListener('cms:update', () => { refreshDashboard(); });
  if (window.BroadcastChannel) {
    try {
      const bc = new BroadcastChannel('dksi_cms');
      bc.onmessage = (e) => { if (e.data?.type === 'update') refreshDashboard(); };
    } catch (e) {}
  }

  window.adminInit = { setView, refreshDashboard, showToast };
  window.__cmsAdmin = window.admin;

  if (window.location.hash && window.location.hash.startsWith('#')) {
    const hashView = window.location.hash.slice(1);
    if (document.querySelector(`.nav-item[data-view="${hashView}"]`)) setTimeout(() => setView(hashView), 0);
  }

  console.log('[CMS] admin.js loaded');
})();
