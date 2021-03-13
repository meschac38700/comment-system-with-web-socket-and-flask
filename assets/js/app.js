import utils from "/js/Utils.js";
import {
	Comment,
	load_comments,
	update_comment_nbr_vote,
} from "/js/Comment.js";
import AlertMessage from "/js/Alert.js";
import ConfirmModal from "/js/ConfirmModal.js";
import CommentSince from "/js/Timers.js";
customElements.define("alert-message", AlertMessage);
customElements.define("comment-element", Comment);
customElements.define("confirm-modal", ConfirmModal);
customElements.define("comment-since", CommentSince);

// Socket io
const socket = io();

socket.on("add_handler_comment", (data) => {
	const date_added = new Date(Number.parseInt(data.date_added));
	if (data.is_child) {
		const el = document
			.getElementById(data.comment_id)
			.querySelector("#comment");
		let parent_el = utils.get_node(el, "comments_children_container");
		const top_parent_html_id = utils.get_node(
			parent_el,
			"comment_element",
			"comment_child"
		)?.id;
		let c = new Comment(
			`${data.author_firstname} ${data.author_lastname}`,
			data.content,
			data.nbr_vote,
			date_added,
			`comment_${date_added.getTime().toString()}`,
			top_parent_html_id
		);
		c.querySelector(".comment_vote_action").dataset.target = c.id;
		c.dataset.child = true;
		parent_el.prepend(c);
		utils.hide_or_add_show_children_btn(parent_el.parentElement);
		window.LOCAL_DATA = window.LOCAL_DATA.map((obj) => {
			let parent_html_id =
				"comment_" + new Date(obj.parent.added).getTime().toString();
			if (top_parent_html_id === parent_html_id) {
				obj.children = [
					...obj.children,
					{
						author_firstname: data.author_firstname,
						nbr_vote: data.nbr_vote,
						author_lastname: data.author_lastname,
						added: date_added,
						id: data.id,
						content: data.content,
					},
				];
			}
			return obj;
		});
		return;
	}
	let c = new Comment(
		`${data.author_firstname} ${data.author_lastname}`,
		data.content,
		data.nbr_vote,
		date_added,
		`comment_${date_added.getTime().toString()}`,
		`comment_${date_added.getTime().toString()}`,
		true
	);
	c.querySelector(".comment_actions.comment_vote_action").dataset.target = c.id;
	document
		.querySelector(".container .content form.add_parent_comment")
		.after(c);
	window.LOCAL_DATA = [
		...window.LOCAL_DATA,
		{
			children: [],
			parent: {
				author_firstname: data.author_firstname,
				nbr_vote: data.nbr_vote,
				author_lastname: data.author_lastname,
				added: date_added,
				id: data.id,
				content: data.content,
			},
		},
	];
});

socket.on("vote_handler_comment", (data) => {
	update_comment_nbr_vote(data.target, data.nbr_vote, data.is_child);
	document
		.getElementById(data.target)
		.querySelector(".comment_vote_btn").textContent = data.nbr_vote;
});

socket.on("delete_handler_comment", (data) => {
	const comment_to_delete = document.getElementById(data.comment_html_id);
	comment_to_delete?.remove();
	const parent = comment_to_delete?.parentElement;
	window.ACTION_COMMENT.comment_to_delete = null;
	// remove show children btn if no child in the node
	if (
		parent?.classList.contains("comments_children_container") &&
		parent?.childElementCount === 0
	) {
		utils.hide_or_add_show_children_btn(parent.parentElement);
	}
});

// End sockio actions
window.LOCAL_DATA = [];
window.ACTION_COMMENT = {
	comment_to_delete: null,
};

/****************  Add parent Comment  ****************
 ******************************************************/
let add_parent_comment = document.querySelector("form.add_parent_comment");
add_parent_comment.addEventListener("submit", (e) => {
	e.preventDefault();
	let el = add_parent_comment.querySelector(".new_parent_comment");
	if (el.value.trim() !== "") {
		const date_added = new Date().getTime();
		socket.emit("add comment event", {
			content: el.value,
			nbr_vote: 0,
			parent_id: null,
			author_firstname: "John",
			author_lastname: "DOE",
			date_added,
		});
		el.value = "";
	}
});

load_comments(socket);

// Get comments from socketio
socket.on("load_comments", (comments) => {
	comments.sort((a, b) => a.id - b.id);
	if (document.querySelectorAll(".comment_element").length === 0) {
		window.LOCAL_DATA = [];
		comments.forEach((comment_data) => {
			comment_data.added = new Date(
				Number.parseInt(comment_data.added)
			).toISOString();
			if (comment_data.parent_id === null) {
				// is parent comment
				window.LOCAL_DATA = [
					...window.LOCAL_DATA,
					{
						children: [],
						parent: comment_data,
					},
				];
			} else {
				window.LOCAL_DATA.find(
					(c) => c.parent.id == comment_data.parent_id
				)?.children.push(comment_data);
			}
		});
		load_comments(socket);
	}
});
utils.hide_or_add_show_children_btn();

export default socket;