import projectConfig from '../../project.config.json';

export const base =
	import.meta.env.MODE === 'production'
		? projectConfig.build.cdnBaseUrl.replace(/\/?$/, '/')
		: '';
