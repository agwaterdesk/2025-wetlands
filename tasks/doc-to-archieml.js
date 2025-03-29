// Combination of https://github.com/rdmurphy/doc-to-archieml and https://github.com/The-Politico/gootenberg/blob/main/src/parse/archie/_docsToArchie.js with some additions for Axios
import archieml from 'archieml';
import docs from '@googleapis/docs';

const wrap = (wrapped, wrapper) => {
	const startsWithBreak = wrapped[0] === '\n';
	const endsInBreak = wrapped.substring(wrapped.length - 1) === '\n';

	const pureStr = wrapped.substring(
		startsWithBreak ? 1 : 0,
		endsInBreak ? wrapped.length - 1 : wrapped.length
	);

	return `${startsWithBreak ? '\n' : ''}${wrapper}${pureStr}${wrapper}${
		endsInBreak ? '\n' : ''
	}`;
};

let classes = {};

const blockStyles = [
	{
		name: 'Links',
		condition: (text, style) => style.link,
		effect: (text, style) => `<a href="${style.link.url}">${text}</a>`
	},

	{
		name: 'Bold Text',
		condition: (text, style) => style.bold,
		effect: (text) => `<strong>${text}</strong>`
	},

	{
		name: 'Italic Text',
		condition: (text, style) => style.italic,
		effect: (text) => `<em>${text}</em>`
	},

	{
		name: 'Underline Text',
		condition: (text, style) => style.underline && !style.link,
		effect: (text) => `<u>${text}</u>`
	},

	{
		name: 'Span Wrap',
		condition: (text, style) => {
			let rgb = style?.backgroundColor?.color.rgbColor;
		
			if (!rgb || JSON.stringify(rgb) === '{"red":1,"green":1,"blue":1}') {
				return false;
			}

			return true;
		},
		effect: (text, style) => {
			console.log(JSON.stringify(style?.backgroundColor?.color.rgbColor))
			return `<span class='${
				classes?.[JSON.stringify(style?.backgroundColor?.color.rgbColor)]?.replaceAll('\n', '')
			}'>${text}</span>`;
		}
	}
];

function readParagraphElement(element) {
	// pull out the text
	const textRun = element.textRun;

	// sometimes it's not there, skip this all if so
	if (textRun) {
		// sometimes the content isn't there, and if so, make it an empty string
		let content = textRun.content || '';

		// If we don't have any styles, just return the content we have
		if (!textRun.textStyle) {
			return content;
		}

		const textStyle = textRun.textStyle;

		let classType = 'class$';
		if (textRun.content.includes(classType)) {
			console.log(textRun.content, textStyle);
			let rgb = textStyle?.backgroundColor?.color.rgbColor;
			if (rgb)
				classes[JSON.stringify(rgb)] = textRun.content.replace(classType, '');
		}

		// If the font-family is Consolas, it's likely an ArchieML key, so we want to ignore it
		if (textStyle.weightedFontFamily?.fontFamily === 'Consolas') {
			return content;
		}

		blockStyles.forEach((block) => {
			content = block.condition(content, textStyle)
				? block.effect(content, textStyle)
				: content;
		});

		return content;
	} else {
		return '';
	}
}

function readElements(document) {
	// prepare the text holder
	let text = '';

	// check if the body key and content key exists, and give up if not
	if (!document.body) return text;
	if (!document.body.content) return text;

	// loop through each content element in the body
	document.body.content.forEach((element) => {
		if (element.paragraph) {
			// get the paragraph within the element
			const paragraph = element.paragraph;

			// this is a list
			const needsBullet = paragraph.bullet != null;

			if (paragraph.elements) {
				// all values in the element
				const values = paragraph.elements;

				values.forEach((value, idx) => {
					// we only need to add a bullet to the first value, so we check
					const isFirstValue = idx === 0;

					// prepend an asterisk if this is a list item
					const prefix = needsBullet && isFirstValue ? '* ' : '';

					// concat the text
					text += `${prefix}${readParagraphElement(value)}`;
				});
			}
		}
	});

	// Remove smart quotes from inside HTML, square or curly brackets to allow for markdown
	text = text.replace(/<[^<>]*>|\[[^[\]]*\]|{[^<>]*}/g, function (match) {
		return match.replace(/”|“/g, '"').replace(/‘|’/g, "'");
	});

	return text;
}

async function docToArchieML({ auth, client, documentId }) {
	// create docs client if not provided
	if (!client) {
		client = docs.docs({
			version: 'v1',
			auth
		});
	}

	// pull the data out of the doc
	const { data } = await client.documents.get({
		documentId
	});

	// convert the doc's content to text ArchieML will understand
	const text = readElements(data);

	// pass text to ArchieML and return results
	return archieml.load(text);
}

export { docToArchieML };
