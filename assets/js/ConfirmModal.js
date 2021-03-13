import socket from '/js/app.js';
import AlertMessage from '/js/Alert.js';
import utils from "/js/Utils.js";
export default class ConfirmModal extends HTMLElement {
	constructor(message = null, delete_text = null, cancel_text = null) {
		super();

		message = message ? message : this.getAttribute("message");
		delete_text = delete_text ? delete_text : this.getAttribute("delete_text");
		cancel_text = cancel_text ? cancel_text : this.getAttribute("cancel_text");

		let modal = `
        <div class="confirm_delete">
            <div class="confirm_delete_container">
                <div class="content">
                    ${message}
                </div>
                <div class="actions">
                </div>
            </div>
        </div>
        `;
		let delete_btn = document.createElement("BUTTON");
		delete_btn.setAttribute("class", "delete");
		delete_btn.innerHTML = delete_text ? delete_text : "Delete";

		delete_btn.addEventListener("click", (e) => {
			e.preventDefault();
			document
				.querySelector("#custom_element_confirm_modal .confirm_delete")
				.classList.remove("show");
			// get comment backend id
			let comment_id = utils.get_comment(window.ACTION_COMMENT.comment_to_delete.id)?.id;
			comment_id = comment_id !== null? comment_id: utils.get_comment(window.ACTION_COMMENT.comment_to_delete.id, is_child=true)?.id;
			// Send delete request to the socket handler
			socket.emit("delete comment event", {
				comment_html_id: window.ACTION_COMMENT.comment_to_delete.id,
				comment_id
			});
		
			document.body.appendChild(new AlertMessage("Commentaire a été supprimé"));
		});
		let cancel_btn = document.createElement("BUTTON");
		cancel_btn.setAttribute("class", "cancel");
		cancel_btn.innerHTML = cancel_text ? cancel_text : "Cancel";
		cancel_btn.addEventListener("click", (e) => {
			e.preventDefault();
			document
				.querySelector("#custom_element_confirm_modal .confirm_delete")
				.classList.remove("show");
		});
		this.innerHTML = modal;
		this.querySelector(".actions").appendChild(delete_btn);
		this.querySelector(".actions").appendChild(cancel_btn);
	}
}
