import "./styles/tailwind/tailwind.css"
import "./styles/tailwind/typography.css"
import "./styles/tailwind/utility.css"
import "./styles/tailwind/editorial.css"

import { mount } from "svelte";
import App from './App.svelte'

document.getElementById('proj-container').innerHTML = ""
const app = mount(App, {
  target: document.getElementById('proj-container')
})

export default app
