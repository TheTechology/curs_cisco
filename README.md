# Academie Cisco Adjud - Website Oficial

Website static bilingv (RO/EN) pentru prezentarea programelor Cisco Networking Academy, admitere online și comunicare academică.

## Autor
- **Marian Dumitru**

## Despre proiect
Proiectul livrează o platformă web completă pentru:
- prezentarea academiei și a echipei de formatori;
- publicarea catalogului de cursuri pe domenii și niveluri;
- pagini individuale pentru fiecare curs;
- flux de înscriere cu formular de admitere;
- confirmări email automate pentru candidat + notificare internă;
- pagini legale și conformitate SEO/tehnică pentru producție.

## Ce s-a făcut în proiect
- Implementare site static complet în **română + engleză**.
- Creare homepage orientat pe carieră IT, cu secțiuni de impact, FAQ și CTA-uri de admitere.
- Creare pagină catalog `cursuri.html` / `cursuri-en.html` cu:
  - overview pe domenii;
  - filtre dinamice (domeniu, nivel, status badge);
  - export/print în PDF.
- Publicare pagini dedicate pentru cursuri (`curs-*.html`), cu panel-uri dinamice despre:
  - rezultate de carieră;
  - beneficii;
  - badge-uri relevante;
  - mentorat cu instructorul.
- Implementare pagină admitere `inregistrare.html` / `inregistrare-en.html` cu:
  - Netlify form + honeypot anti-spam;
  - precompletare automată curs/nivel/domeniu din query params;
  - tracking sursă lead (`lead_source`).
- Implementare funcție serverless `netlify/functions/send-enrollment-emails.js`:
  - validări stricte input;
  - protecții anti-abuz (rate limit + timing checks + origin checks);
  - trimitere email intern + autoresponder candidat prin Resend.
- Implementare sistem de badge-uri din `data/badges.json`, afișat dinamic pe pagini.
- Implementare switch de limbă RO/EN și meniu responsive optimizat mobile.
- Implementare quick actions mobile (call/email/apply).
- Optimizare branding și elemente vizuale (imagini, strip-uri academice, trust signals).
- Implementare pagini legale complete:
  - politică de confidențialitate;
  - politică cookies;
  - termeni și condiții;
  - regulament.
- Implementare SEO tehnic:
  - meta tags, Open Graph, Twitter cards;
  - canonical + hreflang;
  - JSON-LD (`EducationalOrganization`, FAQ);
  - `sitemap.xml`, `robots.txt`, `llms.txt`.
- Implementare hardening securitate în:
  - `netlify.toml` (security headers + CSP);
  - `.htaccess` (metode HTTP blocate, HTTPS redirect, protecție fișiere sensibile, cache/compression);
  - `.well-known/security.txt`.

## Structura proiectului
- `index.html`, `index-en.html` - homepage RO/EN
- `cursuri.html`, `cursuri-en.html` - catalog cursuri
- `curs-*.html` - pagini individuale cursuri
- `inregistrare.html`, `inregistrare-en.html` - formular admitere
- `despre*.html`, `echipa*.html`, `contact*.html` - pagini de prezentare
- `politica-*.html`, `termeni-*.html`, `regulament*.html` - pagini legale
- `assets/styles.css` - stiluri globale
- `assets/main.js` - logică UI + interacțiuni + tracking + submit hook
- `data/badges.json` - catalog badge-uri
- `netlify/functions/send-enrollment-emails.js` - funcție email notificări
- `netlify.toml` - config Netlify + headers securitate
- `.htaccess` - hardening pentru hosting Apache/cPanel
- `sitemap.xml`, `robots.txt`, `llms.txt` - SEO/discovery
- `Imagini/` - imagini, logo-uri, insigne

## Statistici curente
- **Total pagini HTML:** 88
- **Pagini curs RO:** 33
- **Pagini curs EN:** 33

## Tehnologii
- HTML5
- CSS3
- JavaScript (vanilla)
- Netlify Functions (Node.js runtime)
- Resend API (email delivery)

## Rulare locală
Acest proiect este static, deci poate fi rulat cu orice server HTTP simplu.

Exemplu (din rădăcina proiectului):

```bash
python3 -m http.server 8080
```

Apoi deschide:
- `http://localhost:8080/index.html`

## Deploy
### Varianta Netlify
1. Conectezi repository/folderul în Netlify.
2. Publish directory: rădăcina proiectului.
3. Functions directory: `netlify/functions` (deja setat în `netlify.toml`).
4. Configurezi variabilele de mediu:
   - `RESEND_API_KEY`
   - `ENROLLMENT_OWNER_EMAIL` (opțional)
   - `ENROLLMENT_FROM_EMAIL` (opțional)
   - `ENROLLMENT_FROM_NAME` (opțional)
   - `ALLOWED_ORIGINS` (opțional)

### Varianta Apache/cPanel
- Uploadezi fișierele în web root.
- Păstrezi `.htaccess` activ.
- Verifici HTTPS și redirecționarea corectă.

## Flux admitere (rezumat)
1. Utilizatorul intră pe pagină curs sau catalog.
2. Link-urile către admitere primesc automat parametri de context (`src`, curs, domeniu, nivel).
3. Formularul preia contextul și trimite datele.
4. Funcția Netlify validează cererea și trimite:
   - email intern către academie;
   - email de confirmare către candidat.
5. Formularul continuă către pagina de mulțumire.

## Observații
- Proiectul nu depinde de framework frontend.
- Logica principală este centralizată în `assets/main.js`.
- Pentru producție, se recomandă actualizare periodică a `sitemap.xml` când se adaugă pagini noi.

## Licență și drepturi
Conținutul, designul și materialele acestui website aparțin proiectului Academie Cisco Adjud / Asociația Grupul Verde, dacă nu este specificat altfel.

---
Pentru administrare academică și actualizări conținut: **Marian Dumitru**.
