class Utility {
	/**
	 * Hide or show 'show responses' button
	 * @param {HTMLElement} parent_comment
	 */
	hide_or_add_show_children_btn(parent_comment = null) {
		let svg_icon_show = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye" class="show svg-inline--fa fa-eye fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"></path></svg>`;
		let svg_icon_hide = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye-slash" class="hide svg-inline--fa fa-eye-slash fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M634 471L36 3.51A16 16 0 0 0 13.51 6l-10 12.49A16 16 0 0 0 6 41l598 467.49a16 16 0 0 0 22.49-2.49l10-12.49A16 16 0 0 0 634 471zM296.79 146.47l134.79 105.38C429.36 191.91 380.48 144 320 144a112.26 112.26 0 0 0-23.21 2.47zm46.42 219.07L208.42 260.16C210.65 320.09 259.53 368 320 368a113 113 0 0 0 23.21-2.46zM320 112c98.65 0 189.09 55 237.93 144a285.53 285.53 0 0 1-44 60.2l37.74 29.5a333.7 333.7 0 0 0 52.9-75.11 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64c-36.7 0-71.71 7-104.63 18.81l46.41 36.29c18.94-4.3 38.34-7.1 58.22-7.1zm0 288c-98.65 0-189.08-55-237.93-144a285.47 285.47 0 0 1 44.05-60.19l-37.74-29.5a333.6 333.6 0 0 0-52.89 75.1 32.35 32.35 0 0 0 0 29.19C89.72 376.41 197.08 448 320 448c36.7 0 71.71-7.05 104.63-18.81l-46.41-36.28C359.28 397.2 339.89 400 320 400z"></path></svg>`;
		let children_action = this.createFooterBtnAction(
			"comment_actions comment_show_children_action",
			"icon comment_show_children_icon",
			"Comment show children icon",
			[svg_icon_show, svg_icon_hide],
			"comment_show_children_btn",
			"Afficher les réponses"
		);
		children_action.addEventListener("click", () => {
			this.get_node(
				children_action.parentElement,
				"comment_element",
				"comment_child"
			).classList.toggle("show");
			this.hide_show_child_comment_text(children_action);
		});

		if (parent_comment) {
			let children_container = parent_comment.querySelector(
				".comments_children_container"
			);
			if (
				!parent_comment.querySelector(
					".actions .comment_show_children_action"
				) &&
				children_container.childElementCount > 0
			) {
				parent_comment
					.querySelector(".comment_content_footer .actions")
					.insertBefore(
						children_action,
						parent_comment.querySelector(
							".comment_content_footer .actions .comment_delete_action"
						)
					);
			} else if (
				parent_comment.querySelector(
					".actions .comment_show_children_action"
				) &&
				children_container.childElementCount === 0
			) {
				// remove action if exist
				parent_comment
					.querySelector(".comment_content_footer .actions")
					.removeChild(
						parent_comment.querySelector(
							".comment_content_footer .actions .comment_show_children_action"
						)
					);
			}
		} // check all comments
		else {
			let all_comments = document.querySelectorAll(
				".comment_element:not(.comment_child)"
			);
			all_comments.forEach((comment) => {
				let comments_children_container = comment.querySelector(
					".comment .comment_container .comments_children_container"
				);
				if (
					!comment.querySelector(
						".comment_content_footer .actions .comment_show_children_action"
					) &&
					comments_children_container.childElementCount > 0
				) {
					comment
						.querySelector(".comment_content_footer .actions")
						.insertBefore(
							children_action,
							comment.querySelector(
								".comment_content_footer .actions .comment_delete_action"
							)
						);
				} else if (
					comment.querySelector(
						".comment_content_footer .actions .comment_show_children_action"
					) &&
					comments_children_container.childElementCount === 0
				) {
					// remove action if exist
					comment
						.querySelector(".comment_content_footer .actions")
						.removeChild(
							comment_children_container.querySelector(
								".actions .comment_show_children_action"
							)
						);
				}
				this.hide_show_child_comment_text(comments_children_container);
			});
		}
	}
	/****************  Get comment from LOCAL_DATA  *************
	 ******************************************************/
	get_comment(comment_html_id, is_child = false) {
		if (is_child) {
			for (let comment of window.LOCAL_DATA) {
				for (let child of comment.children) {
					const current_comment_child_html_id =
						"comment_" + new Date(child.added).getTime().toString();
					if (current_comment_child_html_id === comment_html_id) {
						return child;
					}
				}
			}
		}
		return window.LOCAL_DATA.find((comment) => {
			const current_comment_parent_html_id =
				"comment_" + new Date(comment.parent.added).getTime().toString();
			return current_comment_parent_html_id === comment_html_id;
		})?.parent;
	}
	/****************  Manage hide/show child comment text  ****************
	 ******************************************************/
	hide_show_child_comment_text(el) {
		let node = this.get_node(el, "comment_element", "comment_child");
		let target_node = this.get_node(el, "comment_show_children_btn");
		if (node.classList.contains("show"))
			target_node.innerText = "Masquer les réponses";
		else target_node.innerText = "Afficher les réponses";
	}
	/****************  Get parentNode  ****************
	 ******************************************************/
	get_node(el, class_name = null, not = null) {
		class_name = class_name ? class_name : "comment_container";
		let selector =
			not !== null ? `.${class_name}:not(.${not})` : `.${class_name}`;
		let childElement = el.querySelector(selector);
		if (el.classList.contains(class_name) && !el.classList.contains(not))
			return el;
		else if (childElement) return childElement;
		return this.get_node(el.parentElement, class_name, not);
	}
	createFooterBtnAction(
		classes,
		icon_classes,
		title,
		svg,
		span_classes,
		span_text,
		comment_id = null
	) {
		let el = document.createElement("DIV");
		el.setAttribute("class", classes);
		if (comment_id) el.setAttribute("data-comment", comment_id);
		let el_icon = document.createElement("DIV");
		el_icon.setAttribute("class", icon_classes);
		el_icon.setAttribute("title", title);
		if (Array.isArray(svg)) el_icon.innerHTML = svg.join(" ");
		else el_icon.innerHTML = svg;
		let el_span = document.createElement("SPAN");
		el_span.setAttribute("class", span_classes);
		el_span.innerHTML = span_text;
		el.appendChild(el_icon);
		el.appendChild(el_span);
		return el;
	}
}
export default new Utility();
