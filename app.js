Date.prototype.addDays=function(d){return new Date(this.valueOf()+864E5*d);};
Date.prototype.removeDays=function(d){return new Date(this.valueOf()-864E5*d);};
const ACTION_COMMENT = {
    comment_to_delete: null
}
class ConfirmModal extends HTMLElement
{
    constructor(message=null, delete_text=null, cancel_text=null)
    {
        super();

        message = message?message: this.getAttribute("message");
        delete_text = delete_text? delete_text: this.getAttribute("delete_text");
        cancel_text = cancel_text? cancel_text: this.getAttribute("cancel_text");

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
        delete_btn.innerHTML = delete_text?delete_text:"Delete";

        delete_btn.addEventListener("click", (e)=>
        {
            e.preventDefault();
            document.querySelector("#custom_element_confirm_modal .confirm_delete").classList.remove("show");
            // Delete comment
            let parent = ACTION_COMMENT.comment_to_delete.parentElement
            parent.removeChild(ACTION_COMMENT.comment_to_delete);
            ACTION_COMMENT.comment_to_delete = null;
            // remove show children btn if no child in the node
            if(parent.classList.contains("comments_children_container") && parent.childElementCount===0)
            {
                hide_or_add_show_children_btn(parent.parentElement);
            }
        });
        let cancel_btn = document.createElement("BUTTON");
        cancel_btn.setAttribute("class", "cancel");
        cancel_btn.innerHTML = cancel_text?cancel_text:"Cancel";
        cancel_btn.addEventListener("click", (e)=>
        {
            e.preventDefault();
            document.querySelector("#custom_element_confirm_modal .confirm_delete").classList.remove("show");
        })
        this.innerHTML = modal;
        this.querySelector(".actions").appendChild(delete_btn);
        this.querySelector(".actions").appendChild(cancel_btn);
    }
}
customElements.define("confirm-modal", ConfirmModal);

class Comment extends HTMLElement
{
    constructor( owner, content, likes, added_since, id, isParent=null)
    {
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
                    <div class="comment_since">${added_since}</div>
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
        let svg_icon = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="comment" class="svg-inline--fa fa-comment fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z"></path></svg>`
        let response_action = createFooterBtnAction(
            "comment_actions comment_response_action",
            "icon comment_response_icon",
            "Comment response icon",
            svg_icon,
            "comment_response_btn",
            "Répondre"
        );
        response_action.addEventListener("click", function()
        {
            let target_node = get_node(this, "form");
            target_node.classList.toggle("show");
            this.parentElement.nextElementSibling.querySelector(".new_comment").focus();
        });
        svg_icon = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" class="svg-inline--fa fa-star fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path></svg>`
        let vote_action = createFooterBtnAction(
            "comment_actions comment_vote_action",
            "icon comment_vote_icon",
            "Comment vote icon",
            svg_icon,
            "comment_vote_btn",
            likes
        );
        svg_icon = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg>`
        let delete_action = createFooterBtnAction(
            "comment_actions comment_delete_action",
            "icon comment_delete_icon",
            "Comment delete icon",
            svg_icon,
            "comment_delete_btn",
            "Supprimer",
            id
        );
        delete_action.addEventListener("click", ()=>
        {
            // display confirm modal
            document.querySelector("#custom_element_confirm_modal .confirm_delete").classList.add("show");
            let el = document.getElementById(delete_action.dataset.comment);
            ACTION_COMMENT.comment_to_delete = el;
        });
        
        comment_container.querySelector(".comment_content_footer .actions").appendChild(response_action);
        comment_container.querySelector(".comment_content_footer .actions").appendChild(vote_action);
        comment_container.querySelector(".comment_content_footer .actions").appendChild(delete_action);
        let add_comment = document.createElement("DIV");
        add_comment.setAttribute("class", "add_comment");
        add_comment.innerHTML =`<textarea class="new_comment" name="new_comment" id="comment" rows="10" placeholder="Ajouter un commentaire public"></textarea>`;
        let new_comment = add_comment.querySelector(".new_comment");
        new_comment.addEventListener("keyup", function(e)
        {
            if (!((e.ctrlKey  &&  e.keyCode === 13) || (e.shiftKey  &&  e.keyCode === 13)) && e.keyCode === 13)
            {
                this.value = "";
            }
        });
        new_comment.addEventListener("keydown", function(e)
        {
            if (!((e.ctrlKey  &&  e.keyCode === 13) || (e.shiftKey  &&  e.keyCode === 13)) && e.keyCode === 13) {
                let child_container = get_node(this, "comments_children_container");
                if(!child_container.classList.contains("show"))
                    child_container.classList.add("show");
                if(this.value.trim() !== "")
                {
                    add_comment.parentElement.classList.toggle("show");
                    add_child_comment( this );
                    let comment_parent = get_node(this, "comment_element", "comment_child" );
                    if(!comment_parent.classList.contains("show"))
                        comment_parent.classList.add("show")
                    hide_show_child_comment_text(this)
                    this.value = "";
                }
            }
        });
        comment_container.querySelector(".comment_content_footer .form").appendChild(add_comment);
        if(isParent)// child comment doesn't have an id
        {
            let comment_icon_svg = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="comments" class="svg-inline--fa fa-comments fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M532 386.2c27.5-27.1 44-61.1 44-98.2 0-80-76.5-146.1-176.2-157.9C368.3 72.5 294.3 32 208 32 93.1 32 0 103.6 0 192c0 37 16.5 71 44 98.2-15.3 30.7-37.3 54.5-37.7 54.9-6.3 6.7-8.1 16.5-4.4 25 3.6 8.5 12 14 21.2 14 53.5 0 96.7-20.2 125.2-38.8 9.2 2.1 18.7 3.7 28.4 4.9C208.1 407.6 281.8 448 368 448c20.8 0 40.8-2.4 59.8-6.8C456.3 459.7 499.4 480 553 480c9.2 0 17.5-5.5 21.2-14 3.6-8.5 1.9-18.3-4.4-25-.4-.3-22.5-24.1-37.8-54.8zm-392.8-92.3L122.1 305c-14.1 9.1-28.5 16.3-43.1 21.4 2.7-4.7 5.4-9.7 8-14.8l15.5-31.1L77.7 256C64.2 242.6 48 220.7 48 192c0-60.7 73.3-112 160-112s160 51.3 160 112-73.3 112-160 112c-16.5 0-33-1.9-49-5.6l-19.8-4.5zM498.3 352l-24.7 24.4 15.5 31.1c2.6 5.1 5.3 10.1 8 14.8-14.6-5.1-29-12.3-43.1-21.4l-17.1-11.1-19.9 4.6c-16 3.7-32.5 5.6-49 5.6-54 0-102.2-20.1-131.3-49.7C338 339.5 416 272.9 416 192c0-3.4-.4-6.7-.7-10C479.7 196.5 528 238.8 528 288c0 28.7-16.2 50.6-29.7 64z"></path></svg>`
            let comment_icon = document.createElement("DIV");
            comment_icon.innerHTML = comment_icon_svg;
            comment_icon.setAttribute("class", "icon comments_icon");
            let children_container = document.createElement("DIV");
            children_container.setAttribute("class", "comments_children_container");
            comment_container.appendChild(children_container);
            comment.appendChild(comment_icon);
            comment.appendChild(comment_container);
            this.appendChild(comment);
        }
        else
        {
            // add show children button action
            comment_container.setAttribute("class", "");
            comment_container.querySelector(".comment_content").classList.add("comment_content_child");
            this.classList.add("comment_child");
            this.appendChild(comment_container);
        }
    }
    already_exist(el_selector, search_selector)
    {
        return el_selector.querySelector(search_selector) != null;
    }
    
}
function createFooterBtnAction( classes, icon_classes, title, svg, span_classes, span_text, comment_id=null )
{
    let el = document.createElement("DIV");
    el.setAttribute("class", classes);
    if(comment_id) el.setAttribute("data-comment", comment_id);
    let el_icon = document.createElement("DIV");
    el_icon.setAttribute("class", icon_classes)
    el_icon.setAttribute("title", title)
    if(Array.isArray(svg))
        el_icon.innerHTML = svg.join(" ")
    else
        el_icon.innerHTML = svg
    let el_span = document.createElement("SPAN");
    el_span.setAttribute("class", span_classes);
    el_span.innerHTML = span_text;
    el.appendChild(
        el_icon
    );
    el.appendChild(el_span);
    return el;
}
function hide_or_add_show_children_btn(parent_comment=null)
{
    let svg_icon_show = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye" class="show svg-inline--fa fa-eye fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"></path></svg>`
    let svg_icon_hide = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye-slash" class="hide svg-inline--fa fa-eye-slash fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M634 471L36 3.51A16 16 0 0 0 13.51 6l-10 12.49A16 16 0 0 0 6 41l598 467.49a16 16 0 0 0 22.49-2.49l10-12.49A16 16 0 0 0 634 471zM296.79 146.47l134.79 105.38C429.36 191.91 380.48 144 320 144a112.26 112.26 0 0 0-23.21 2.47zm46.42 219.07L208.42 260.16C210.65 320.09 259.53 368 320 368a113 113 0 0 0 23.21-2.46zM320 112c98.65 0 189.09 55 237.93 144a285.53 285.53 0 0 1-44 60.2l37.74 29.5a333.7 333.7 0 0 0 52.9-75.11 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64c-36.7 0-71.71 7-104.63 18.81l46.41 36.29c18.94-4.3 38.34-7.1 58.22-7.1zm0 288c-98.65 0-189.08-55-237.93-144a285.47 285.47 0 0 1 44.05-60.19l-37.74-29.5a333.6 333.6 0 0 0-52.89 75.1 32.35 32.35 0 0 0 0 29.19C89.72 376.41 197.08 448 320 448c36.7 0 71.71-7.05 104.63-18.81l-46.41-36.28C359.28 397.2 339.89 400 320 400z"></path></svg>`
    let children_action = createFooterBtnAction(
        "comment_actions comment_show_children_action",
        "icon comment_show_children_icon",
        "Comment show children icon",
        [svg_icon_show, svg_icon_hide],
        "comment_show_children_btn",
        "Afficher les réponses"
    );
    children_action.addEventListener("click", function()
    {
        get_node(this.parentElement, "comment_element", "comment_child").classList.toggle("show");
        hide_show_child_comment_text(this);
    });

    if(parent_comment)
    {
        let children_container = parent_comment.querySelector(".comments_children_container");
        if(!parent_comment.querySelector(".actions .comment_show_children_action") && children_container.childElementCount >0)
        {
            parent_comment.querySelector(".comment_content_footer .actions").insertBefore(
                children_action, parent_comment.querySelector(".comment_content_footer .actions .comment_delete_action") );
        }
        else if(parent_comment.querySelector(".actions .comment_show_children_action") && children_container.childElementCount===0)
        {
            // remove action if exist
            parent_comment.querySelector(".comment_content_footer .actions").removeChild(
                parent_comment.querySelector(".comment_content_footer .actions .comment_show_children_action")
            )
        }
    }
    else // check all comments
    {
        let all_comments = document.querySelectorAll(".comment_element:not(.comment_child)");
        all_comments.forEach(comment=>
        {
            let comments_children_container= comment.querySelector(".comment .comment_container .comments_children_container");
            if(!comment.querySelector(".comment_content_footer .actions .comment_show_children_action") && comments_children_container.childElementCount > 0)
            {
                comment.querySelector(".comment_content_footer .actions").insertBefore(
                    children_action, comment.querySelector(".comment_content_footer .actions .comment_delete_action") );
            }
            else if(comment.querySelector(".comment_content_footer .actions .comment_show_children_action") && comments_children_container.childElementCount===0)
            {
                // remove action if exist
                comment.querySelector(".comment_content_footer .actions").removeChild(
                    comment_children_container.querySelector(".actions .comment_show_children_action")
                )
            }
            hide_show_child_comment_text(comments_children_container);
        })
    }
}
/****************  Add parent Comment  ****************
 ******************************************************/
let add_parent_comment = document.querySelector("form.add_parent_comment");
add_parent_comment.addEventListener("submit", (e)=>
{
    e.preventDefault();
    // TODO Only for dev env
    let r_nb =  Math.floor(Math.random() * 10) + 1;
    let random_since_date =moment((new Date()).removeDays(r_nb)).locale('fr').fromNow();

    let el = add_parent_comment.querySelector(".new_parent_comment") 
    if(el.value.trim() != "")
    {
        let c = new Comment(
            owner= "John DOE",
            content=el.value,
            likes=0,
            added_since=random_since_date,
            id=`comment_${(new Date()).getTime()}`,
            isParent=true);
        document.querySelector(".container .content form.add_parent_comment").after(c);
        el.value = "";
        // TODO INSERT INTO DATABASE THE CURRENT COMMENT CHILD
    }
});
/****************  Add child Comment  ****************
 ******************************************************/
function add_child_comment(el)
{
    // TODO Only for dev env
    let r_nb =  Math.floor(Math.random() * 10) + 1;
    let random_since_date =moment((new Date()).removeDays(r_nb)).locale('fr').fromNow();
    
    if(el.value.trim() !== "")
    {
        //let parent_el = this.get_node(el).querySelector(".comments_children_container");
        let parent_el = get_node(el, "comments_children_container");
        let c = new Comment(
            owner= "Marc DOE",
            content=el.value,
            likes=0,
            added_since=random_since_date,
            id = "comment_"+(new Date()).getTime().toString() );
        parent_el.prepend(c);
        hide_or_add_show_children_btn(parent_el.parentElement);
        // TODO INSERT INTO DATABASE THE CURRENT COMMENT CHILD
    }
}
/****************  Get parentNode  ****************
 ******************************************************/
function get_node(el, class_name=null, not=null)
{
    class_name = class_name?class_name :"comment_container";
    let selector = not !== null?`.${class_name}:not(.${not})`: `.${class_name}`;
    let childElement = el.querySelector(selector);
    if(el.classList.contains(class_name) && !el.classList.contains(not))
        return el;
    else if(childElement)
        return childElement;
    return get_node(el.parentElement, class_name, not);
}

/****************  Manage hide/show child comment text  ****************
 ******************************************************/
function hide_show_child_comment_text(el)
{
    let node = get_node(el, "comment_element", "comment_child");
    let target_node = get_node(el, "comment_show_children_btn");
    if(node.classList.contains("show"))
        target_node.innerText = "Masquer les réponses";
    else
        target_node.innerText = "Afficher les réponses";
}

customElements.define("comment-element", Comment)
let c = new Comment(
    owner= "John DOE",
    content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, necessitatibus.",
    likes=5,
    added_since="Il y a 2 semaines",
    id="first_comment_johnd_123",
    isParent=true);
document.querySelector(".container .content").appendChild(c);

let c2 = new Comment(
    owner= "Marc DOE",
    content="Lorem ipsum dolor sit amet consectetur.",
    likes=10,
    added_since="Il y a 1 mois",
    id = "childOffirst_comment_johnd_123");

let children_container = document.querySelector("#first_comment_johnd_123 .comments_children_container");
children_container.appendChild(c2)
document.querySelector("#first_comment_johnd_123 .comment_container").appendChild(children_container);

let c3 = new Comment(
    owner= "Marc DOE",
    content="Lorem ipsum dolor sit amet consectetur.<br/>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, necessitatibus.",
    likes=45,
    added_since="Il y a 1 minute",
    id="second_comment_marcd_1234",
    isParent=true);
document.querySelector(".container .content").appendChild(c3);

hide_or_add_show_children_btn();