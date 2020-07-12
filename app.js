class Comment extends HTMLElement
{
    constructor( owner, content, likes, added_since, id=null)
    {
        super();
        let comment = document.createElement("DIV");
        comment.setAttribute("class", "comment");
        let comment_container = document.createElement("DIV");
        comment_container.setAttribute("class", "comment_container");
        let comment_icon = document.createElement("IMG");
        comment_icon.src = "img/comments_icon.svg";
        comment_icon.setAttribute("class", "icon comments_icon");
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
                    <div class="comment_response_action">
                        <img src="img/comment_response_icon.svg" alt="comment response icon" class="icon comment_response_icon">
                        <span>Répondre</span>
                    </div>
                    <div class="comment_vote">
                        <img src="img/comment_vote_icon.svg" alt="comment vote icon" class="icon comment_vote_icon">
                        <span class="comment_vote_number">${likes}</span>
                    </div>
                    <div class="comment_response_action">
                        <img src="img/comment_show_child.svg" alt="comment response icon" class="icon comment_response_icon">
                        <span>afficher les réponses</span>
                    </div>
                    <div class="comment_vote">
                        <img src="img/comment_delete_icon.svg" alt="comment vote icon" class="icon comment_vote_icon">
                        <span class="comment_vote_number">supprimer</span>
                    </div>
                </div>
            </div>
        `;
        comment_container.innerHTML = comment_content;
        // child comment doesn't have an id
        if(id)
        {
            comment.appendChild(comment_icon);
            comment.appendChild(comment_container);
            comment.setAttribute("id", id);
            this.appendChild(comment);
        }
        else
        {
            comment_container.querySelector(".comment_content").classList.add("comment_content_child");
            comment_container.setAttribute("class","comment_child_container");
            this.setAttribute("class", "comment_child");
            this.appendChild(comment_container)
        }
    }
}

customElements.define("comment-element", Comment)
let c = new Comment(
    owner= "John DOE",
    content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, necessitatibus.",
    likes=5,
    added_since="Il y a 2 semaines",
    id="first_comment_johnd_123");
document.querySelector(".container .content").appendChild(c);

let c2 = new Comment(
    owner= "Marc DOE",
    content="Lorem ipsum dolor sit amet consectetur.",
    likes=10,
    added_since="Il y a 1 mois");
document.querySelector("#first_comment_johnd_123 .comment_container").appendChild(c2);