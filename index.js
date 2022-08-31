/**
 * @var			express
 * @abstract	Importa Express
 */
const express		= require('express');
/**
 * @var			app
 * @abstract	Instancia Express a la variable app
 */
const app			= express();
/**
 * @var			app
 * @abstract	importa la libreria body-parse
 */
const bodyParser	= require('body-parser')
app.use( bodyParser.urlencoded( { extended: false } ) )
app.use( bodyParser.json() )
/**
 * @abstract	Permite Mostrar paginas html
 */
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
/**
 * @var			app
 * @abstract	importa la libreria locutus/bc adaptada de php
 */
const bc			= require('locutus/php/bc');
const clients		= [
	{
		apikey	: 'W189ndcbc558d7e6W36bs6b84ta3f35f1ra13056b87a2ed1',
		name	: 'APIKEY CMB',
		client  : 'cmb'

	}, 
	{
		apikey	: '7d11nd558cb8ctW36bsa2e8d7e66b1r35a6b8a3ff1830549',
		name	: 'APIKEY WCL',
		client  : 'wcl'
	},
	{
		apikey	: '58cb8d1eWb5a3635a18349b066a3ffct7s8d127586eb1rnd',
		name	: 'APIKEY TESTING',
		client  : 'testing'
	}
];
/**
 * @var			litecoinNetwork
 * @abstract	Datos para la red de LTC
 */
const litecoinNetwork = { //// https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/addresses.spec.ts
	messagePrefix	: '\x19Litecoin Signed Message:\n',
	bech32			: 'ltc',
	bip32			: {
		public		: 0x0488B21E,/* 0x019da462 */
		private		: 0x0488ADE4,/* 0x019d9cfe */
	},
	pubKeyHash		: 0x30,
	scriptHash		: 0x32, /* 0x05 */
	wif				: 0xb0,
};
/**
 * @var			dashNetwork
 * @abstract	Datos para la red de DASH
 */
 const dashNetwork = {
	messagePrefix	: '\x19Dash Signed Message:\n',
	bech32			: 'dash',
	bip32			: {
		public		: 0x019da462,/* VERIFY */
		private		: 0x019d9cfe,/* VERIFY */
	},
	pubKeyHash		: 0x4c,/* CHECK */
	scriptHash		: 0x05, /* 0x10 -> https://bitcoin.stackexchange.com/questions/83507/dash-constants-and-prefixes ///// 0x05 -> https://www.dash.org/forum/threads/help-integrating-dash-into-bitcoinjs-lib.7453/*/
	wif				: 0xCC,/* CHECK */
};
/**
 * @method 		strrev
 * @param		str : string a revertir
 * @abstract	Método que revierte una cadena de caracteres
 * @return		string
 */
function strrev( str ) {
	let splitString		= str.split("");
	let reverseArray	= splitString.reverse();
	let joinArray		= reverseArray.join("");
	return joinArray; // "olleh"
}
/**
 * @method 		bcmod
 * @param		x : Valor uno para realizar la función mod
 * @param		y : Valor dos para realizar la función mod
 * @abstract	Método custom que realiza la misma acción de la función bcmod de php
 * @return		integer
 */
function bcmod( x, y ) {
	// how many numbers to take at once? carefull not to exceed (int)
	let take	= 5;
	let mod		= '';
	do {
		a	= parseInt( mod + x.substr( 0, take ) );
		x	= x.substr( take );
		mod	= a % y;
	} while ( x.length );
	return parseInt( mod );
}
/**
 * @method 		encode_hex
 * @param		dec : string a convertir en hexadecimal
 * @abstract	Método que convierte lo recibido a hexadecimal
 * @return		string
 */
function encode_hex( dec ) {
	hexchars	= "0123456789ABCDEF";
	returnValue	= "";
	while ( bc.bccomp( dec, 0 ) == 1 ) {
		dv			= String( bc.bcdiv( dec, "16", 0 ) );
		rem			= parseInt( bcmod( dec, "16" ) );
		dec			= dv;
		returnValue	= returnValue + hexchars[ rem ];
	}
	return strrev( returnValue );
}
/**
 * @method 		decode_base58
 * @param		base58 : String en Base58
 * @abstract	Método que decodifica un string base58 (Para dirección wallet de bitcoin)
 * @return		string
 */
function decode_base58( base58 ) {
	let origbase58	= base58;
	let base58chars	= "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
	let returnValue	= "0";
	for ( i = 0; i < base58.length; i++ ) {
		current		= String( base58chars.indexOf( base58[ i ] ) );
		returnValue	= String( bc.bcmul( returnValue, "58", 0 ) );
		returnValue	= String( bc.bcadd( returnValue, current, 0 ) );
	}
	returnValue		= encode_hex(returnValue);
	//leading zeros
	for ( i = 0; i < origbase58.length && origbase58[ i ] == "1"; i++ ) { returnValue = "00" + returnValue; }
	return ( returnValue.length % 2 != 0 ) ? `0${returnValue}` : returnValue;
}
/**
 * @method 		generateWalletERC20OrBEP20
 * @abstract	Método que genera una wallet address con su PrivKey en ERC20|BEP20
 * @return		object
 */
function generateWalletERC20OrBEP20() {
	const wallet		= require('ethereumjs-wallet');
	const ethWallet		= wallet.default.generate();
	const walletData	= {
		address		: ethWallet.getAddressString(),
		privateKey	: ethWallet.getPrivateKeyString(),
		publicKey	: ethWallet.getPublicKeyString()
	}
	return walletData;
}
/**
 * @method		generateWalletEth
 * @abstract	Método que genera una wallet address con su PrivKey en BTC
 * @return		object
 */
function generateWalletBTCOrLTC( networkAlias ) {
	//Import dependencies
	const bip39				= require('bip39');
	const ecc				= require('tiny-secp256k1');
	const { BIP32Factory }	= require('bip32');
	const bip32				= BIP32Factory(ecc); // You must wrap a tiny-secp256k1   compatible implementation
	const bitcoin			= require('bitcoinjs-lib');
	//Define the networks
	const network			= ( networkAlias === 'btc' ) ? bitcoin.networks.bitcoin : ( ( networkAlias === 'ltc' ) ? litecoinNetwork : dashNetwork ); //use networks.testnet for testnet
	// Derivation path
	const path				= `m/49'/0'/0'/0` // Use m/49'/1'/0'/0 for testnet
	//// Genera la llave Mnemotecnica
	let mnemonic			= bip39.generateMnemonic();
	const seed				= bip39.mnemonicToSeedSync(mnemonic);
	let root				= bip32.fromSeed(seed, network);
	let account				= root.derivePath(path)
	let node				= account.derive(0).derive(0)
	let btcAddress			= bitcoin.payments.p2pkh({
		pubkey	: node.publicKey, network	: network
	}).address;
	let privateKey			= decode_base58(node.toWIF());
	privateKey				= ( node.toWIF().substr(0, 1) == '5' ) ? ( privateKey.substr( 2 ) ).substr( 0, ( privateKey.length - 10 ) ) : ( privateKey.substr( 2 ) ).substr( 0, ( privateKey.length - 12 ) );
	const walletData		= {
		address		: btcAddress,
		wif			: node.toWIF(),
		privateKey	: privateKey,
		mnemonic	: mnemonic
	}
	return walletData;
}
/**
 * @method 		response
 * @param		res 	: Parametros para la respuesta de devolución
 * @param		code 	: Código de respuesta de petición
 * @param		data 	: Datos a devolver (Datos de la Wallet)
 * @param		message : Mensaje a Devolver
 * @abstract	Método que genera una wallet address con su PrivKey en ERC20|BEP20
 * @return		res.status.json
 */
function response( res, code, data, message = undefined ) {
	if ( code === 200 ) {
		res.status( code ).json({ success : true, payload : data });
	} else {
		res.status( code ).json({ success : false, message	: message });
	}
}
/**
 * @method 		authHeaders
 * @param		req 	: Parametros enviados en los headers
 * @param		res 	: Parametros para la respuesta de devolución
 * @abstract	Método que verifica la autenticación para la API
 * @return		res.status.json|boolean
 */
function authHeaders( req, res ) {
	if ( req.headers.authorization !== undefined ) {
		headerAuth	= req.headers.authorization.split(' ');
		tokenAuth	= headerAuth[1];
		if ( tokenAuth !== undefined ) {
			sentToken	= clients.find( x => x.apikey === tokenAuth );
			if ( sentToken !== undefined ) {
				return true;
			} else {
				response( res, 401, undefined, 'AUTHORIZATION TOKEN IS NOT ALLOWED' );
			}
		} else {
			response( res, 401, undefined, 'SESSION TOKEN WAS NOT SENT IN THE AUTHORIZATION HEADERS' );	
		}
	} else {
		response( res, 401, undefined, 'THE WORD "BEARER" OR SESSION TOKEN WAS NOT SENT IN THE AUTHORIZATION HEADERS' );
	}
}
/**
 * @method 		POST:/generator/wallet/:network
 * @param		req 	: Parametros enviados en los headers
 * @param		res 	: Parametros para la respuesta de devolución
 * @abstract	Petición para la generación de las wallets, dentro de la petición se espera
 * 				recibir la red donde se generará la dirección wallet
 * @return		res.status.json
 */
app.post('/generator/wallet/:network', function( req, res ) {
	if ( authHeaders( req, res ) ) {
		const networks	= ['btc', 'bep20', 'erc20', 'ltc', 'dash']; /*'trc20'*/
		let code		= 404;
		let message		= 'ERROR GENERATING WALLET ADDRESS';
		let network		= req.params.network.toLowerCase();
		////// Se evalua la Red de la blockchain donde se generá la Dirección Wallet
		if ( networks.includes( network ) ) {
			let data	= ( network === 'bep20' || network === 'erc20' ) ? generateWalletERC20OrBEP20() : generateWalletBTCOrLTC( network );
			code		= ( data.address !== undefined ) ? 200 : 500;
			response( res, code, ( ( data !== undefined ) ? data : undefined ) );
		} else {
			message	= 'THE SPECIFIED BLOCKCHAIN NETWORK DOES NOT EXIST, PLEASE TRY AGAIN.';
			response( res, code, undefined, message );
		}
	}
});
/**
 * @abstract	Redirecciona a una pagina 404 NOT FOUND cuando se intenta acceder a la raiz o cuando no se 
 * @return		res.status.json
 */
app.use( function( req, res, next ) {
	res.status( 404 );
	// respond with html page
	if ( req.accepts('html') ) {
		// res.sendFile('404.html');
		res.status(404).render( __dirname + '/views/404.html', {title: "Sorry, page not found"});
		return;
	}
	// respond with json
	if ( req.accepts('json') ) {
		res.json({ error: 'Not found' });
		return;
	}
	// default to plain-text. send()
	res.type('txt').send('Not found');
});
/**
 * @method 		listen
 * @abstract	Muestra mensaje en la consola cuando se esta ejecutando la aplicación y el puerto
 */
app.listen( 8081,'127.0.0.1', ()=>{
	console.log( 'Listening on port: ', 8081 );
});