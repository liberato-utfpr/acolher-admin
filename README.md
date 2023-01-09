# Acolher App (acolher-quasar)

Ministério Acolher - IPRCM

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).


### PWA
[Adicionando PWA.](https://quasar.dev/quasar-cli-vite/developing-pwa/introduction)

```bash
quasar mode add pwa
```
Executar PWA
```bash
quasar dev -m pwa
quasar build -m pwa
```



### Icon Genie CLI

[Gerando ícones para PWA](https://quasar.dev/quasar-cli-vite/developing-pwa/app-icons-pwa)

```bash
icongenie generate -m pwa -i ./icon.png
```
1. Copiar os icones para a pasta `public`
2. Copiar os links gerados no arquivo `index.html`
