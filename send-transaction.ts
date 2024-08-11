import * as web3 from '@solana/web3.js'
import { getKeypairFromFile } from '@solana-developers/helpers'

async function main() {
	const senderFile = process.argv[2];
	const recieverFile  = process.argv[3];
	if (!senderFile || !recieverFile) {
		throw new Error("No Arguments");
	}

	const senderKeypair = await getKeypairFromFile(senderFile);
	const recieverKeypair = await getKeypairFromFile(recieverFile);

	console.log("Sender Public Key: ", senderKeypair.publicKey.toBase58());
	console.log("Reciever Public Key: ", recieverKeypair.publicKey.toBase58());
	console.log("Successfully parsed sender and reciever keypair");	

	const recieverPubkey = await new web3.PublicKey(recieverKeypair.publicKey);
	console.log('recieverPubkey: ', recieverPubkey.toBase58());

	// Set Connection
	const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
	
	console.log("Connection Established");

	// Transaction
	const transaction = new web3.Transaction();
	
	// Create Instruction
	const LAMPORTS_TO_SEND = 175031;
	const instruction = web3.SystemProgram.transfer({
		fromPubkey: senderKeypair.publicKey,
		toPubkey: recieverPubkey,
		lamports: LAMPORTS_TO_SEND
	})

	transaction.add(instruction);

	// Send and Confirm
	const signature = await web3.sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
	console.log(
		`You can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`,
	);	

	// Check new Balances
	const senderBalance = await connection.getBalance(senderKeypair.publicKey);
	const recieverBalance = await connection.getBalance(recieverPubkey);

	console.log(`Balance of ${senderKeypair.publicKey.toBase58()}: ${senderBalance}`);
	console.log(`Balance of ${recieverPubkey.toBase58()}: ${recieverBalance}`);
};

main();
