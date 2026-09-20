# Weftly Customer Template

Dieses Template ist deine eigenständige Next.js-Website. Weftly unter
`https://app.weftly.site` verwaltet Workspaces, Projekte, Seiten und Inhalte.
Du entwickelst die Website-Komponenten lokal und betreibst die Website in einem
eigenen Repository bei Vercel, Coolify oder einem anderen Node.js-Host.

Die Website lädt veröffentlichte Snapshots vom CDN und dynamische CMS-Abfragen
über die Content API. Sie braucht keine eigene Datenbank, Prisma oder den
Builder-Monorepo. Die SDK-Pakete kommen aus npm.

## Ziel: ein Repository, zwei Domains

| Umgebung | Git-Branch | Vercel-Umgebung | Beispiel-Domain | Weftly-Inhalte |
| --- | --- | --- | --- | --- |
| Staging / Builder | `staging` | Preview | `staging.formaturf.com` | Auf Staging veröffentlichte Inhalte |
| Produktion | `main` | Production | `www.formaturf.com` | Auf Produktion veröffentlichte Inhalte |

Beide Domains gehören dir und werden beim DNS-Anbieter mit Vercel verbunden.
Die Namen sind Beispiele. Weftly legt keine Domains, GitHub-Repositories oder
Vercel-Projekte automatisch an. Website-Code geht von deinem Mac über GitHub
zu Vercel; Seiten und Inhalte verwaltest und veröffentlichst du in Weftly.

## 1. Auf dem Mac starten

Voraussetzungen: Git, Node.js 22.13 oder neuer, npm 11 und Zugriff auf das
[Customer-Template](https://github.com/appsolution-mw/weftly-customer-template).
Produktive SDK-Nutzung benötigt einen gültigen Weftly-Lizenzschlüssel gemäß den
Lizenzen der `@weftly/*`-Pakete.

Wähle auf GitHub **Use this template → Create a new repository** und erstelle
ein eigenes, vorzugsweise privates Repository (z. B. `formaturf-website`). Klone dann dein
Repository; ersetze die Beispieladresse:

```bash
git clone https://github.com/DEIN-ACCOUNT/DEIN-PROJEKT.git kundenwebsite
cd kundenwebsite
npm ci
cp .env.example .env.local
```

Alternativ kannst du das Template direkt klonen:

```bash
git clone https://github.com/appsolution-mw/weftly-customer-template.git kundenwebsite
```

Danach ebenfalls `cd kundenwebsite`, `npm ci` und `cp .env.example .env.local`
ausführen. Vor dem ersten Push den Remote auf dein eigenes, leeres Repository
umstellen (Adresse ersetzen):

```bash
git remote set-url origin https://github.com/DEIN-ACCOUNT/DEIN-PROJEKT.git
```

## 2. Mit deinem Weftly-Projekt verbinden

Erstelle ein Projekt in deinem Workspace. Öffne dessen **Einstellungen →
Verbindung**, erstelle einen API-Schlüssel und kopiere die generierte
Konfiguration in `.env.local`. Der Schlüssel wird nur beim Erstellen vollständig
angezeigt. Eine bestehende Schlüssel-ID ersetzt den geheimen Schlüssel nicht.

| Variable | Zweck |
| --- | --- |
| `WEFTLY_ENVIRONMENT` | `staging` lokal und für Vercel Preview; `production` für Vercel Production |
| `NEXT_PUBLIC_WEFTLY_PROJECT_ID` | ID des Projekts, dessen Seiten gerendert werden |
| `NEXT_PUBLIC_WEFTLY_DEFAULT_LOCALE` | Standardsprache, zum Beispiel `de` |
| `NEXT_PUBLIC_BUNNY_PULLZONE_HOSTNAME` | CDN-Hostname, ohne `https://` |
| `WEFTLY_CONTENT_API_URL` | Builder-Origin, z. B. `https://app.weftly.site` |
| `WEFTLY_CONTENT_API_KEY` | Geheimer Projekt-API-Schlüssel; nur serverseitig |
| `WEFTLY_BUILDER_ORIGINS` | Erlaubte Builder-Origins für die eingebettete Live-Vorschau |

Der Konfigurationsblock zeigt bei einem nicht neu erstellten Schlüssel einen
Platzhalter. Ersetze ihn durch deinen gespeicherten Schlüssel oder erstelle
einen neuen. `.env.local` ist von Git ausgeschlossen. Hinterlege später dieselben
Werte separat beim Hosting-Anbieter. Fehlt die CDN-Adresse, muss sie durch den
Betreiber der Weftly-Plattform konfiguriert werden.

## 3. Entwickeln

```bash
npm run dev
```

Öffne `http://localhost:3000`. `/` leitet zur konfigurierten Standardsprache um.
Falls Port 3000 belegt ist: `npm run dev -- --port 3001`.

Veröffentliche zuerst eine Seite in Weftly auf **Staging**: Die öffentliche Route
`/[locale]/[[...slug]]` lädt mit `WEFTLY_ENVIRONMENT=staging` Staging-Snapshots
(`STAGED`), mit `production` Produktions-Snapshots (`PUBLISHED`). Ohne passenden
Snapshot oder Projekt-Konfiguration erscheint ein Platzhalter (`DynamicStub`).
Lokale Codeänderungen erscheinen durch Next.js Hot Reload; unveröffentlichte
Builder-Entwürfe erscheinen nicht automatisch auf dieser öffentlichen Route.

- Eigene React-Komponenten und SCSS Modules: `components/blocks/`.
- Registrierung der Komponenten und ihrer Builder-Eigenschaften: `lib/registry.ts`.
- Registrierung mit `defineComponent` / `createRegistry` aus `@weftly/host`.
- Registrierte Komponenten müssen browserfähig bleiben, weil die Live-Vorschau
  sie im Browser lädt. Serverzugriffe und geheime Schlüssel gehören nicht hinein.

Prüfe vor einem Deployment:

```bash
npm test
npm run build
```

`next.config.ts` enthält bereits `output: 'standalone'` und `transpilePackages`
für die Weftly-SDKs. Die Website braucht einen Node.js-Server; ein statischer
HTML-Export deckt ihre serverseitigen Abfragen nicht ab.

## 4. GitHub mit Vercel verbinden: Staging und Produktion

### Repository importieren

1. Push deinen Website-Code in dein eigenes GitHub-Repository. Erstelle dort den
   Branch `staging`, ausgehend von `main`. Lokal geht das mit:

   ```bash
   git switch -c staging
   git push -u origin staging
   ```

2. Öffne [Vercel New Project](https://vercel.com/new), verbinde GitHub und
   importiere **dein** Repository. Wähle Next.js, Repository-Wurzel (`./`),
   Install Command `npm ci` und Build Command `npm run build`. Der eigenständige
   Template-Export hat keinen Unterordner `apps/customer-template`.
3. Hinterlege die Variablen aus der Weftly-Einrichtung vor dem ersten Build.
   Projekt-ID, Locale, CDN, API-URL und erlaubte Builder-Origin sind in beiden
   Umgebungen gleich. Der API-Key bleibt serverseitig; du kannst getrennte
   Projekt-Keys für Staging und Produktion erstellen.
4. Setze `WEFTLY_ENVIRONMENT=production` ausschließlich für **Production** und
   `WEFTLY_ENVIRONMENT=staging` für **Preview** und **Development**. `NODE_ENV`
   bleibt Vercels Einstellung; es steuert nicht das Weftly-Inhaltsziel.
5. Unter **Settings → Environments → Production** muss `main` der Production
   Branch sein. `staging` wird automatisch als Preview gebaut. Nach neuen
   Variablen einen neuen Build starten; sie ändern bestehende Deployments nicht.

### Zwei feste Subdomains verbinden

1. Unter **Settings → Domains** `www.formaturf.com` hinzufügen und mit
   **Production** verbinden.
2. `staging.formaturf.com` hinzufügen. Unter **Edit → Connect to an environment**
   **Preview** wählen und im Feld **Git Branch** `staging` eintragen.
3. Bei deinem DNS-Anbieter die für jede Domain von Vercel angezeigten Records
   eintragen. Verwende die tatsächlich angezeigten Ziele; warte auf **Valid
   Configuration** und HTTPS. Die Staging-Domain darf kein Redirect auf `www` sein.
4. Für die Einbettung in Weftly muss die Staging-Domain ohne Vercel-Login
   erreichbar sein. Unter **Settings → Deployment Protection** Vercel
   Authentication für dieses Website-Projekt deaktivieren und speichern.
   Dadurch werden auch andere Preview-Deployments dieses Projekts öffentlich.
   Falls dein Tarif Domain-Ausnahmen unterstützt, kannst du stattdessen nur die
   feste Staging-Domain freigeben. Weftly übergibt keinen Vercel-Bypass-Schlüssel.
5. Erzeuge **nach dem Vercel-Import und der Konfiguration** einen neuen Commit
   auf `staging`. Nur den Branch vor dem Import anzulegen startet noch kein
   Preview-Deployment. Ohne lokale Codeänderung geht das so:

   ```bash
   git switch staging
   git commit --allow-empty -m "Start staging deployment"
   git push origin staging
   ```

   Alternativ auf GitHub den Branch `staging` auswählen, die README bearbeiten
   (z. B. den Projektnamen setzen) und direkt auf `staging` committen.
   Warte in Vercel auf **Ready**. Öffne die feste Staging-URL im privaten
   Browserfenster: Es darf weder eine Vercel-Anmeldung noch ein Fehler erscheinen.
   Der Inhaltsplatzhalter vor der ersten Weftly-Veröffentlichung ist normal.

`NEXT_PUBLIC_*`-Werte werden beim Build festgelegt. Eine Änderung erfordert
immer einen neuen Build. `WEFTLY_CONTENT_API_KEY` bekommt **kein**
`NEXT_PUBLIC_`-Präfix und gehört niemals ins Git-Repository.

Die öffentliche Staging-Seite und die Builder-Preview setzen `noindex`.
Das ist Suchmaschinensteuerung, keine Zugriffssperre. Auf Staging veröffentlichte
Inhalte sind über die URL erreichbar; unveröffentlichte Builder-Entwürfe kommen
nur über die eingebettete Builder-Sitzung in die Vorschau.

### Auf dem Mac entwickeln und per Push veröffentlichen

```bash
git switch staging
npm ci
npm run dev
```

Bearbeite und registriere Komponenten, prüfe sie lokal und anschließend:

```bash
npm test
npm run build
git add components lib app styles
git commit -m "Update website components"
git push origin staging
```

Vercel aktualisiert die feste Staging-Domain automatisch. Prüfe dort und im
Weftly-Builder. Erstelle anschließend auf GitHub einen Pull Request von
`staging` nach `main` und merge ihn. Vercel deployt den Code dann auf `www`.
Ein Git-Push veröffentlicht **Code**. Neue Seiteninhalte veröffentlichst du
separat in Weftly auf Staging oder Produktion.

Offizielle Anleitungen:
[Git-Deployments](https://vercel.com/docs/git),
[Domain an einen Branch binden](https://vercel.com/docs/domains/working-with-domains/assign-domain-to-a-git-branch),
[Umgebungsvariablen](https://vercel.com/docs/environment-variables),
[Vercel Authentication konfigurieren](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication).

## 5. Auf Coolify veröffentlichen

Verbinde dein eigenes Repository als Anwendung. Wähle Nixpacks, Basisverzeichnis
`/`, Server-Anwendung ("Is it a static site?" deaktiviert) und internen Port 3000.
Nutze dieselbe Node.js-Version wie lokal. Prüfe bzw. überschreibe die erkannten
Befehle für die bereits konfigurierte Standalone-Ausgabe:

**Install Command:**

```bash
npm ci
```

**Build Command:**

```bash
npm run build && cp -r .next/static .next/standalone/.next/ && if [ -d public ]; then cp -r public .next/standalone/; fi
```

**Start Command:**

```bash
HOSTNAME=0.0.0.0 PORT=3000 node .next/standalone/server.js
```

Hinterlege die Projektvariablen als Runtime-Variablen; setze `NEXT_PUBLIC_*` und
`WEFTLY_BUILDER_ORIGINS` zusätzlich als Build-Variablen. Der Build wertet auch
`next.config.ts` aus. Konfiguriere deine Domain mit HTTPS, deploye und prüfe die
Anwendungslogs. Die Kopierschritte liefern JavaScript/CSS und gegebenenfalls
`public/` mit aus; Next.js kopiert diese nicht selbst in Standalone.

Offizielle Anleitungen: [Coolify mit Nixpacks](https://coolify.io/docs/applications/builds/nixpacks/deploy),
[Next.js Standalone-Ausgabe](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

## 6. Mit Weftly verbinden und den Builder öffnen

1. Trage in der **Projekteinrichtung** die Staging-Domain als **Staging / Remote**
   und die öffentliche Domain als **Produktion / Remote** ein. Keine wechselnde
   Deployment-URL verwenden; die beiden festen Domains bleiben bei jedem Push gleich.
2. Stelle sicher, dass beide Deployments den Projekt-API-Schlüssel und
   `WEFTLY_BUILDER_ORIGINS=https://app.weftly.site` enthalten. Staging benötigt
   `WEFTLY_ENVIRONMENT=staging`, Produktion `WEFTLY_ENVIRONMENT=production`.
3. Öffne `https://staging.formaturf.com/preview/de` (bzw. deine Projektsprache).
   Die Route meldet sich serverseitig mit dem API-Schlüssel bei Weftly. Sie zeigt
   außerhalb des Builders einen Vorschauhinweis statt einer fertigen Website.
4. Kehre zur Weftly-Einrichtung zurück und aktualisiere den Verbindungsstatus.
   Sobald Staging verifiziert ist, kannst du den Builder öffnen. Die Vorlage
   bringt unter anderem Hero, Überschrift, Text, Buttons, Bilder, Cards und Grid
   als registrierte Bausteine mit; baue damit deine erste Seite.
5. Veröffentliche die Seite auf Staging und prüfe `https://staging.formaturf.com/de`.
   Zum Produktionsstart auch `https://www.formaturf.com/preview/de` zur
   Verifikation öffnen, dann die Inhalte in Weftly auf Produktion veröffentlichen.

Der Builder verwendet die registrierte Remote-Staging-Domain und wartet auf
deren Verifikation; ohne Staging bleibt eine verifizierte Produktionsdomain
als Vorschauziel möglich. Neue
Projekte starten in der Einrichtung, solange keine Vorschau verbunden ist.
Ein LOCAL-Domaineintrag allein wählt keinen Entwicklungsserver auf deinem Mac
als Vorschauziel aus. Codeänderungen für die gehostete Builder-Vorschau brauchen
einen Push nach GitHub und das Staging-Deployment. Lokal kannst du die auf
Staging veröffentlichten Inhalte mit deinem aktuellen Komponentencode entwickeln.

### Wenn die Verbindung fehlt

- **Vercel-Anmeldeseite:** Deployment Protection für die Staging-Domain prüfen.
- **Keine Verifikation:** Domain-Rolle und `WEFTLY_ENVIRONMENT` müssen passen;
  API-Key darf nicht widerrufen sein und muss zu diesem Weftly-Projekt gehören.
- **Keine Komponenten:** Deployment muss dieses Template mit registrierten
  Bausteinen enthalten; Builder-Origin und die `/preview/de`-Route prüfen.
- **Öffentliche Seite zeigt Platzhalter:** Seite in der passenden Umgebung
  veröffentlichen; Projekt-ID, Sprache und CDN-Konfiguration kontrollieren.
- **Geänderte Umgebungsvariable wirkt nicht:** In Vercel neu deployen.

Inhalte veröffentlichst du in Weftly. Website-Code veröffentlichst du über Git
und Vercel. Das Customer-Projekt bleibt zur Laufzeit mit der Weftly Content API
und dem CDN verbunden.
