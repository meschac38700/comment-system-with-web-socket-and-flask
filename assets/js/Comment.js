import socket from '/js/app.js';
import utils from "/js/Utils.js";
export class Comment extends HTMLElement {
	constructor(
		owner,
		content,
		likes,
		added_since,
		id,
		comment_parent_html_id,
		isParent = null
	) {
		super();
		this.setAttribute("class", "comment_element");
		this.setAttribute("id", id);
		let comment = document.createElement("DIV");
		comment.setAttribute("class", "comment");
		let comment_container = document.createElement("DIV");
		comment_container.setAttribute("class", "comment_container");
		let comment_content = `
            <div class="comment_content">
                <div class="comment_content_header inline_flex_space">
                    <h1 class="user_name">${owner}</h1>
                    <comment-since since=${added_since.toISOString()}></comment-since>
                </div>
                <div class="comment_content_body">
                    <p>${content}</p>
                </div>
                <div class="comment_content_footer">
                    <div class="actions inline_flex_space"></div>
                    <div class="form"></div>
                </div>
            </div>
        `;
		comment_container.innerHTML = comment_content;
		let svg_icon = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="comment" class="svg-inline--fa fa-comment fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z"></path></svg>`;
		let response_action = utils.createFooterBtnAction(
			"comment_actions comment_response_action",
			"icon comment_response_icon",
			"Comment response icon",
			svg_icon,
			"comment_response_btn",
			"Répondre"
		);
		response_action.addEventListener("click", function () {
			let target_node = utils.get_node(this, "form");
			target_node.classList.toggle("show");
			this.parentElement.nextElementSibling
				.querySelector(".new_comment")
				.focus();
		});
		svg_icon = [
			`<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" class="svg-inline--fa fa-star fa-w-18 unvoted" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path></svg>`,
			`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" class="svg-inline--fa fa-star fa-w-18 voted" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>`,
		];
		let vote_action = utils.createFooterBtnAction(
			"comment_actions comment_vote_action",
			"icon comment_vote_icon",
			"Comment vote icon",
			svg_icon,
			"comment_vote_btn",
			likes
		);
		vote_action.addEventListener("click", () => {
			vote_action.classList.toggle("voted");
			const is_child = !!document.getElementById(vote_action.dataset.target)
				?.dataset.child;
			const curr_comment = utils.get_comment(
				vote_action.dataset.target,
				is_child
			);
			let nbr_vote = curr_comment?.nbr_vote;
			// update nbr_vote (unvote -1 / vote +1)
			nbr_vote = vote_action.classList.contains("voted")
				? ++nbr_vote
				: --nbr_vote;
			nbr_vote = nbr_vote >= 0 ? nbr_vote : 0; // prevent negative number
			socket.emit("vote comment event", {
				target: vote_action.dataset.target,
				comment_id: curr_comment?.id,
				nbr_vote,
				is_child,
			});
		});
		svg_icon = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg>`;
		let delete_action = utils.createFooterBtnAction(
			"comment_actions comment_delete_action",
			"icon comment_delete_icon",
			"Comment delete icon",
			svg_icon,
			"comment_delete_btn",
			"Supprimer",
			id
		);
		delete_action.addEventListener("click", () => {
			// display confirm modal
			document
				.querySelector("#custom_element_confirm_modal .confirm_delete")
				.classList.add("show");
			let el = document.getElementById(delete_action.dataset.comment);
			window.ACTION_COMMENT.comment_to_delete = el;
		});

		comment_container
			.querySelector(".comment_content_footer .actions")
			.appendChild(response_action);
		comment_container
			.querySelector(".comment_content_footer .actions")
			.appendChild(vote_action);
		comment_container
			.querySelector(".comment_content_footer .actions")
			.appendChild(delete_action);
		let add_comment = document.createElement("DIV");
		add_comment.setAttribute("class", "add_comment");
		add_comment.innerHTML = `<textarea class="new_comment" name="new_comment" id="comment" rows="10" data-comment=${comment_parent_html_id} placeholder="Ajouter un commentaire public"></textarea>`;
		let new_comment = add_comment.querySelector(".new_comment");
		new_comment.addEventListener("keyup", function (e) {
			if (
				!(
					(e.ctrlKey && e.keyCode === 13) ||
					(e.shiftKey && e.keyCode === 13)
				) &&
				e.keyCode === 13
			) {
				this.value = "";
			}
		});
		new_comment.addEventListener("keydown", (e) => {
			if (
				!(
					(e.ctrlKey && e.keyCode === 13) ||
					(e.shiftKey && e.keyCode === 13)
				) &&
				e.keyCode === 13
			) {
				let child_container = utils.get_node(
					new_comment,
					"comments_children_container"
				);
				if (!child_container.classList.contains("show"))
					child_container.classList.add("show");
				if (new_comment.value.trim() !== "") {
					add_comment.parentElement.classList.toggle("show");
					this.add_child_comment(new_comment);
					let comment_parent = utils.get_node(
						child_container,
						"comment_element",
						"comment_child"
					);
					if (!comment_parent.classList.contains("show"))
						comment_parent.classList.add("show");
					utils.hide_show_child_comment_text(new_comment);
					new_comment.value = "";
				}
			}
		});
		comment_container
			.querySelector(".comment_content_footer .form")
			.appendChild(add_comment);
		if (isParent) {
			// child comment doesn't have an id
			let comment_icon_svg = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="comments" class="svg-inline--fa fa-comments fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M532 386.2c27.5-27.1 44-61.1 44-98.2 0-80-76.5-146.1-176.2-157.9C368.3 72.5 294.3 32 208 32 93.1 32 0 103.6 0 192c0 37 16.5 71 44 98.2-15.3 30.7-37.3 54.5-37.7 54.9-6.3 6.7-8.1 16.5-4.4 25 3.6 8.5 12 14 21.2 14 53.5 0 96.7-20.2 125.2-38.8 9.2 2.1 18.7 3.7 28.4 4.9C208.1 407.6 281.8 448 368 448c20.8 0 40.8-2.4 59.8-6.8C456.3 459.7 499.4 480 553 480c9.2 0 17.5-5.5 21.2-14 3.6-8.5 1.9-18.3-4.4-25-.4-.3-22.5-24.1-37.8-54.8zm-392.8-92.3L122.1 305c-14.1 9.1-28.5 16.3-43.1 21.4 2.7-4.7 5.4-9.7 8-14.8l15.5-31.1L77.7 256C64.2 242.6 48 220.7 48 192c0-60.7 73.3-112 160-112s160 51.3 160 112-73.3 112-160 112c-16.5 0-33-1.9-49-5.6l-19.8-4.5zM498.3 352l-24.7 24.4 15.5 31.1c2.6 5.1 5.3 10.1 8 14.8-14.6-5.1-29-12.3-43.1-21.4l-17.1-11.1-19.9 4.6c-16 3.7-32.5 5.6-49 5.6-54 0-102.2-20.1-131.3-49.7C338 339.5 416 272.9 416 192c0-3.4-.4-6.7-.7-10C479.7 196.5 528 238.8 528 288c0 28.7-16.2 50.6-29.7 64z"></path></svg>`;
			let comment_icon = document.createElement("DIV");
			comment_icon.innerHTML = comment_icon_svg;
			comment_icon.setAttribute("class", "icon comments_icon");
			let children_container = document.createElement("DIV");
			children_container.setAttribute("class", "comments_children_container");
			comment_container.appendChild(children_container);
			comment.appendChild(comment_icon);
			comment.appendChild(comment_container);
			this.appendChild(comment);
		} else {
			// add show children button action
			comment_container.setAttribute("class", "");
			comment_container
				.querySelector(".comment_content")
				.classList.add("comment_content_child");
			this.classList.add("comment_child");
			this.appendChild(comment_container);
		}
	}
	already_exist(el_selector, search_selector) {
		return el_selector.querySelector(search_selector) != null;
	}
	/****************  Add child Comment  ****************
	 ******************************************************/
	add_child_comment(el) {
		// TODO Only for dev env

		if (el.value.trim() !== "") {
			const date_added = new Date().getTime();
			const parent_id = utils.get_comment(el.dataset.comment)?.id;
			socket.emit("add comment event", {
				content: el.value,
				is_child: true,
				comment_id: el.dataset.comment,
				nbr_vote: 0,
				author_firstname: "John",
				author_lastname: "DOE",
				parent_id,
				date_added,
			});
			el.value = "";
		}
	}
}
/****  Update  vote number of comment from LOCAL_DATA  ******
 ******************************************************/
export function update_comment_nbr_vote(
	comment_html_id,
	nb_vote,
	is_child = false
) {
	window.LOCAL_DATA = is_child
		? window.LOCAL_DATA.map((comment) => {
				comment.children = comment.children.map((comment_child) => {
					const current_comment_child_html_id =
						"comment_" + new Date(comment_child.added).getTime().toString();

					if (current_comment_child_html_id === comment_html_id) {
						comment_child.nbr_vote = nb_vote;
					}
					return comment_child;
				});
				return comment;
		  })
		: window.LOCAL_DATA.map((comment) => {
				const current_comment_parent_html_id =
					"comment_" + new Date(comment.parent.added).getTime().toString();

				if (current_comment_parent_html_id === comment_html_id) {
					comment.parent.nbr_vote = nb_vote;
				}
				return comment;
		  });
}

// Adding data from Server
export function load_comments(socket) {
	window.LOCAL_DATA.forEach((comment_data) => {
		// let parent_container = document.querySelector(".container .content");
		let children = comment_data.children;
		let parent = comment_data.parent;
		let parent_date_added = new Date(parent.added);
		let parent_c = new Comment(
			`${parent.author_firstname}` + `${parent.author_lastname.toUpperCase()}`,
			parent.content,
			parent.nbr_vote,
			parent_date_added,
			`comment_${parent_date_added.getTime().toString()}`,
			`comment_${parent_date_added.getTime().toString()}`,
			true
		);
		parent_c.querySelector(
			".comment_actions.comment_vote_action"
		).dataset.target = parent_c.id;
		if (children.length > 0) {
			children.forEach((child_data) => {
				const date_added = new Date(child_data.added);
				let child_c = new Comment(
					`${child_data.author_firstname}` +
						`${child_data.author_lastname.toUpperCase()}`,
					child_data.content,
					child_data.nbr_vote,
					date_added,
					`comment_${date_added.getTime().toString()}`,
					`comment_${parent_date_added.getTime().toString()}`
				);
				child_c.querySelector(
					".comment_actions.comment_vote_action"
				).dataset.target = child_c.id;
				child_c.dataset.child = true;
				parent_c
					.querySelector(".comments_children_container")
					.appendChild(child_c);
			});
		}
		document.querySelector(".add_comment.add_parent_comment").after(parent_c);
		// parent_container.after(parent_c);
		utils.hide_or_add_show_children_btn(parent_c);
	});
}
