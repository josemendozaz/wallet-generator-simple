# API DE GENERACIÓN DE WALLETS (Sin estructura)

REST API en NodeJS que permite generar la dirección wallet en las redes de BTC, ETH|BEP20, DASH, LTC. Sin estructura, de unico archivo.


### 📋 Pre-requisitos

* NodeJS V.14.17.5

### ⚙️ Configuración
* Utils\auth.js: Se debe configurar las API KEY de los clientes en el array de Objetos "this.clients".

### 💻 Uso
* Para instalar dependencias se debe ejecutar el comando "npm install" dentro del directorio.
* Iniciar el api ejecutando el comando "npm start" dentro del directorio.
* Para Generar la wallet se utiliza el ENDPOINT wallet/generate/:network mediante el método POST, donde :network es la red donde se generara, dentro de las redes se tiene ERC20, BEP20, BTC, DASH, LTC. Es importante enviar en los encabezados de Autenticación tipo Bearer Token el api key de autenticación, de lo contrario mostrará un error. De ejecutar de Forma Exitosa se mostrara una respuesta como la siguiente (suponiendo que se haya ejecutado el endpoint para generar una wallet BTC):
```javascript
{
    "success": true,
    "payload": {
        "address": "18RSdhtndzGjUSJaBK1ak9fxQyWCy745JM",
        "wif": "L539LK7aStNUttfq8MGPaeLsVRk9zPhKdcYapwkRGdcLB3299gu1",
        "privateKey": "E9436F81690B4AEA24084BED846537CE6DE3E9B159DA4D26923F2277D9AB040C",
        "mnemonic": "general excite mesh assist evidence educate bundle badge father brand near flag"
    }
}
```

## 🛠️ Librerias utilizadas.
* [BIP32 V3.0.1](https://www.npmjs.com/package/bip32) - A BIP32 compatible library written in TypeScript with transpiled JavaScript committed to git.
* [BIP39 V3.0.4](https://www.npmjs.com/package/bip39) - JavaScript implementation of Bitcoin BIP39: Mnemonic code for generating deterministic keys.
* [BitcoinJS (bitcoinjs-lib) V6.0.2](https://www.npmjs.com/package/bitcoinjs-lib) - A javascript Bitcoin library for node.js and browsers. Written in TypeScript, but committing the JS files to verify.
* [Body-Parser V1.20.0](https://www.npmjs.com/package/body-parser) - Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
* [EJS V3.1.18](https://www.npmjs.com/package/ejs) - Embedded JavaScript templates.
* [Elliptic V6.5.4](https://www.npmjs.com/package/elliptic) - Fast elliptic-curve cryptography in a plain javascript implementation.
* [Ethereumjs-Wallet V1.0.2](https://www.npmjs.com/package/ethereumjs-wallet) - A lightweight wallet implementation. At the moment it supports key creation and conversion between various formats.
* [Express V4.18.1](https://www.npmjs.com/package/express) - Fast, unopinionated, minimalist web framework for node.
* [locutus V2.0.16](https://npm.io/package/locutus) - All your standard libraries will be assimilated into our JavaScript collective. Resistance is futile.
* [Tiny-SECP256k1 V2.2.1](https://www.npmjs.com/package/tiny-secp256k1) - This library is under development, and, like the secp256k1 C library (through secp256k1-sys Rust crate) it depends on, this is a research effort to determine an optimal API for end-users of the bitcoinjs ecosystem.
* [ICONO FOR README](https://www.freepik.com/free-vector/illustration-bitcoin-concept_3232525.htm#query=crypto%20wallet%20icon&position=8&from_view=keyword) - Icono para el Readme, obtenido de forma gratuita del sitio web Freepik del usuario rawpixel.com


## ✒️ Autor
* **José Mendoza** - [josemendozaz](https://github.com/josemendozaz/)