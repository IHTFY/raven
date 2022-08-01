import 'axentix/dist/axentix.esm.js';
import 'axentix/dist/axentix.min.css';
import 'axentix/dist/axentix.min.js';
import 'neu-axentix/dist/css/neu-axentix.min.css';
import 'neu-axentix/dist/js/neu-axentix.min.js';
// import '@materializecss/materialize/dist/js/materialize.min.js';
// import '@materializecss/materialize/dist/css/materialize.min.css';

// M.AutoInit();

import App from './components/App.svelte';

const app = new App({
	target: document.body,
	// props: {
	// 	name: 'world'
	// }
});

export default app;