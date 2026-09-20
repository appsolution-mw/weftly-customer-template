# Weftly Customer Template

Dieses Template ist deine eigenständige Next.js-Website. Weftly unter
`https://app.weftly.site` verwaltet Workspaces, Projekte, Seiten und Inhalte.
Du entwickelst die Website-Komponenten lokal und betreibst die Website in einem
eigenen Repository bei Vercel, Coolify oder einem anderen Node.js-Host.

Die Website lädt veröffentlichte Snapshots vom CDN und dynamische CMS-Abfragen
über die Content API. Sie braucht keine eigene Datenbank, Prisma oder den
Builder-Monorepo. Die SDK-Pakete kommen aus npm.

## 1. Auf dem Mac starten

Voraussetzungen: Git, Node.js 22.13 oder neuer, npm 11 und Zugriff auf das
[Customer-Template](https://github.com/appsolution-mw/weftly-customer-template).
Produktive SDK-Nutzung benötigt einen gültigen Weftly-Lizenzschlüssel gemäß den
Lizenzen der `@weftly/*`-Pakete.

Erstelle auf GitHub aus dem Template ein eigenes Repository. Klone dann dein
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

Veröffentliche zuerst eine Seite in Weftly: Die öffentliche Route
`/[locale]/[[...slug]]` lädt **veröffentlichte** Snapshots. Ohne passenden
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

## 4. Auf Vercel veröffentlichen

1. Committe und pushe den Website-Code in dein eigenes Repository.
2. Importiere es in Vercel; wähle Next.js und die Repository-Wurzel als
   Projektverzeichnis. Build-Befehl: `npm run build`.
3. Hinterlege die Variablen aus `.env.local` für die gewünschten Umgebungen
   (Production und gegebenenfalls Preview), bevor du den Build startest.
4. Deploye und öffne die zugewiesene HTTPS-Domain.

`NEXT_PUBLIC_*`-Werte werden beim Build festgelegt. Eine Änderung erfordert
immer einen neuen Build. `WEFTLY_CONTENT_API_KEY` bleibt eine serverseitige
Variable und bekommt **kein** `NEXT_PUBLIC_`-Präfix.

Offizielle Anleitungen: [Next.js auf Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs),
[Umgebungsvariablen](https://vercel.com/docs/environment-variables).

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

## 6. Live-Vorschau mit dem gehosteten Builder

1. Trage deine Website-Domain in Weftly unter **Einstellungen → Verbindung →
   Domains** als **Produktion / Remote** ein. Bei mehreren Produktionsdomains
   markiere die gewünschte Domain als kanonisch.
2. Stelle sicher, dass die Website den Projekt-API-Schlüssel und
   `WEFTLY_BUILDER_ORIGINS=https://app.weftly.site` enthält.
3. Öffne `https://DEINE-DOMAIN/preview/de` (bzw. deine Projektsprache).
   Diese Route meldet sich serverseitig mit dem API-Schlüssel bei Weftly.
4. Lade den Builder erneut. Nach erfolgreicher Verifikation bindet er
   `/preview/[locale]/[[...slug]]` ein und sendet Live-Entwürfe an das Iframe.

Die Builder-Vorschau verwendet aktuell die verifizierte **Remote-Produktionsdomain**.
Ein LOCAL-Domaineintrag allein wählt keinen Entwicklungsserver auf deinem Mac
als Vorschauziel aus. Codeänderungen für diese Remote-Vorschau benötigen daher
ein Deployment. Lokal kannst du veröffentlichte Inhalte mit deinem geänderten
Komponentencode prüfen.

Bei einem selbst lokal betriebenen Builder gibt es einen globalen
Entwicklungs-Fallback: `WEFTLY_BUILDER_PREVIEW_URL=http://localhost:3001/preview`
und `WEFTLY_BUILDER_PREVIEW_ORIGINS=http://localhost:3001` im **Builder**.
Die Website muss dessen Origin über `WEFTLY_BUILDER_ORIGINS` erlauben. Der
Fallback greift nur ohne registrierte Remote-Produktionsdomain. Dies ist keine
pro Projekt einstellbare lokale Vorschau im gehosteten Builder.

Inhalte veröffentlichst du in Weftly. Website-Code veröffentlichst du über Git
und den Hosting-Anbieter. Das Customer-Projekt bleibt zur Laufzeit mit der
Weftly Content API und dem CDN verbunden.
