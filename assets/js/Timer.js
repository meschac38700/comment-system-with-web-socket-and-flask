export default class CommentSince extends HTMLElement {
	static get observedAttributes() {
		return ["since"];
	}
	constructor(comment_added) {
		super();
		comment_added = this.getAttribute("since")
			? this.getAttribute("since")
			: comment_added;
		comment_added =
			typeof comment_added === "string"
				? new Date(comment_added)
				: comment_added;
		let since = moment(comment_added).locale("fr").fromNow();
		let div = document.createElement("DIV");
		div.setAttribute("class", "comment_since");
		div.innerText = since;
		this.appendChild(div);
		window.setInterval(function () {
			window.requestAnimationFrame(() => {
				since = moment(comment_added).locale("fr").fromNow();
				div.innerText = since;
			});
		}, 60000);
	}
}
