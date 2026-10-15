/*
 * Medição da campanha do Google Ads (15/10/2026, plano em marketing-ops
 * campanhas/2026-10-15-google-ads-ez-personal.md §3, itens M3 e M5).
 *
 * - Os IDs vêm das <meta name="ez-..."> do <head> do index.html. Vazios (o padrão): nada carrega, nenhum banner
 *   aparece e o site fica exatamente como antes.
 * - Consent Mode v2: tudo começa NEGADO; o banner pergunta; a escolha fica no localStorage ("ez_consentimento").
 *   Com "Recusar", a tag ainda carrega em modo sem cookies (pings anônimos do Consent Mode).
 * - Evento `clique_cadastro` em todo link para painel.ezpersonal.com.br/login?mode=signup (e a conversão do Ads,
 *   se houver rótulo).
 * - UTMs (utm_*) e gclid/gbraid/wbraid da URL da landing seguem nos links para o painel.
 */
(function () {
  'use strict';

  function meta(nome) {
    var el = document.querySelector('meta[name="' + nome + '"]');
    return el ? (el.getAttribute('content') || '').trim() : '';
  }

  var GA4 = meta('ez-ga4-id'); // G-XXXXXXX
  var ADS = meta('ez-ads-id'); // AW-XXXXXXXXX
  var ROTULO_CLIQUE = meta('ez-ads-rotulo-clique-cadastro'); // rótulo da conversão "clique_cadastro"
  var CHAVE = 'ez_consentimento';
  var PAINEL = 'painel.ezpersonal.com.br';
  var PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'gclid', 'gbraid', 'wbraid'];

  // ---------- UTMs e gclid nos links para o painel (vale mesmo sem tag) ----------
  var daUrl = new URLSearchParams(window.location.search);
  var repassar = [];
  PARAMS.forEach(function (p) {
    var v = daUrl.get(p);
    if (v) repassar.push([p, v]);
  });
  if (repassar.length) {
    document.querySelectorAll('a[href*="' + PAINEL + '"]').forEach(function (a) {
      try {
        var u = new URL(a.href);
        repassar.forEach(function (par) { if (!u.searchParams.has(par[0])) u.searchParams.set(par[0], par[1]); });
        a.href = u.toString();
      } catch (e) { /* link inválido: deixa como está */ }
    });
  }

  var temTag = Boolean(GA4 || ADS);
  if (!temTag) return;

  // ---------- Google tag com Consent Mode v2 ----------
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500,
  });

  function lerEscolha() {
    try { return window.localStorage.getItem(CHAVE); } catch (e) { return null; }
  }
  function gravarEscolha(v) {
    try { window.localStorage.setItem(CHAVE, v); } catch (e) { /* sem armazenamento: pergunta de novo na próxima visita */ }
  }
  function aplicar(v) {
    var s = v === 'aceito' ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage: s, ad_user_data: s, ad_personalization: s, analytics_storage: s });
  }

  var escolha = lerEscolha();
  if (escolha === 'aceito' || escolha === 'recusado') aplicar(escolha);

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4 || ADS);
  document.head.appendChild(script);
  gtag('js', new Date());
  if (GA4) gtag('config', GA4);
  if (ADS) gtag('config', ADS);

  // ---------- clique_cadastro ----------
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href*="' + PAINEL + '"]') : null;
    if (!a || a.href.indexOf('mode=signup') < 0) return;
    var onde = a.id || a.getAttribute('data-posicao') || (a.closest('section, header') || {}).className || 'pagina';
    gtag('event', 'clique_cadastro', { posicao: String(onde).split(' ')[0], transport_type: 'beacon' });
    if (ADS && ROTULO_CLIQUE) gtag('event', 'conversion', { send_to: ADS + '/' + ROTULO_CLIQUE, transport_type: 'beacon' });
  });

  // ---------- Banner de cookies (LGPD) ----------
  function banner() {
    var caixa = document.createElement('div');
    caixa.className = 'cookies-banner';
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-live', 'polite');
    caixa.setAttribute('aria-label', 'Cookies');
    caixa.innerHTML =
      '<p>Usamos cookies para medir as visitas e o resultado dos nossos anúncios. Você escolhe: ' +
      '<a href="privacidade.html">saiba mais na Política de Privacidade</a>.</p>' +
      '<div class="cookies-acoes">' +
      '<button type="button" class="btn btn-secondary" data-cookies="recusado">Recusar</button>' +
      '<button type="button" class="btn btn-primary" data-cookies="aceito">Aceitar</button>' +
      '</div>';
    caixa.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-cookies]');
      if (!b) return;
      var v = b.getAttribute('data-cookies');
      gravarEscolha(v);
      aplicar(v);
      caixa.remove();
    });
    document.body.appendChild(caixa);
  }

  if (escolha !== 'aceito' && escolha !== 'recusado') banner();

  // Link "Cookies" no rodapé para mudar a escolha.
  var rodape = document.querySelector('.footer-links');
  if (rodape) {
    var sep = document.createElement('span');
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';
    var link = document.createElement('a');
    link.href = '#';
    link.textContent = 'Cookies';
    link.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (!document.querySelector('.cookies-banner')) banner();
    });
    rodape.appendChild(document.createTextNode(' '));
    rodape.appendChild(sep);
    rodape.appendChild(document.createTextNode(' '));
    rodape.appendChild(link);
  }
})();
