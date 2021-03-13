export default class AlertMessage extends HTMLElement {
	constructor(message, alert_class = "") {
		super();
		this.setAttribute("class", "alert " + `alert_${alert_class}`);
		let html = document.createElement("DIV");
		html.setAttribute("class", "alert_content");
		let content = document.createElement("DIV");
		content.setAttribute("class", "alert_message");
		content.textContent = message;
		html.appendChild(content);
		this.appendChild(html);
	}
	connectedCallback() {
		super.connectedCallback && super.connectedCallback();
		window.setTimeout(() => {
			this.classList.add("alert_close");
			window.setTimeout(() => {
				this.parentElement.removeChild(this);
			}, 1000);
		}, 3000);
	}
}
