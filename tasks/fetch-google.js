//author: Russel Goldenberg, The Pudding
//https://github.com/the-pudding/starter/blob/master/scripts/fetch-doc.js

import { GoogleAuth } from 'google-auth-library';
import { docToArchieML } from './doc-to-archieml.js';
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs-extra';
import { camelCase } from 'change-case';

const CWD = process.cwd();
const CONFIG_PATH = `${CWD}/project.config.json`;
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const { doc } = CONFIG.google;

/**
 * Camel case all object keys. Modified from https://stackoverflow.com/a/41072596
 * @param {Object} input Object you want to mute
 * @returns Mutated object
 */
let objectKeysToLowerCase = function (input) {
	if (typeof input !== 'object') return input;
	if (Array.isArray(input)) return input.map(objectKeysToLowerCase);
	return Object.keys(input).reduce(function (newObj, key) {
		let val = input[key];
		let newVal =
			typeof val === 'object' && val !== null
				? objectKeysToLowerCase(val)
				: val;
		newObj[camelCase(key)] = newVal;
		return newObj;
	}, {});
};

async function main() {
	/**
	 * This method looks for the GOOGLE_APPLICATION_CREDENTIALS environment variables to establish authentication
	 */

	if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
		console.error(
			'\x1b[31mCould not find the credential files needed to authenticate with Google Docs. Try running the authentication script below or see the "Google Docs/Archie ML for copy: Setup" section in the README for more details.\n'
		);
		console.error('\x1b[33mRun: npm run doc-auth\n');
		return;
	}

	const auth = new GoogleAuth({
		scopes: 'https://www.googleapis.com/auth/documents.readonly'
	});

	const results = Promise.all(
		doc.map(async (d) => {
			const result = await docToArchieML({
				documentId: d.id,
				auth
			});

			if (!result) {
				return null;
			}
			return {
				filepath: d.filepath,
				data: result
			};
		})
	);

	results
		.then((files) => {
			files.forEach((file) => {
				const parsed = objectKeysToLowerCase(file.data);
				const str = JSON.stringify(parsed);
				const newFile = `${CWD}/${file.filepath || 'data/doc.json'}`;
				fs.writeFile(newFile, str, (err) => {
					if (err) console.error(err);

					console.log('\x1b[32mData saved to: ', newFile);
				});
			});
		})
		.catch((error) => {
			if (
				error.errors.some(
					(e) => e.message === 'The caller does not have permission'
				)
			) {
				console.error(
					'\x1b[31mCould not authenticate with Google. Double check that the Service Account has edit permissions on the Google Docs.'
				);
				console.error(
					'\x1b[33mShare the doc with: axios-visuals-projects@axios-visuals-auth.iam.gserviceaccount.com\n'
				);
			} else {
				console.error(error.errors);
			}
		});
}

main();
