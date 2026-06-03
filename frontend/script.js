const chatContainer =
    document.getElementById(
        "chat-container"
    );

async function askQuestion() {

    const question =
        document.getElementById(
            "question"
        ).value.trim();

    if (!question) return;

    chatContainer.innerHTML += `

        <div class="user-message">
            ${escapeHtml(question)}
        </div>

    `;

    const response =
        await fetch(
            "/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    question
                })
            }
        );

    const data =
        await response.json();

    const citations = Array.isArray(data.citations)
        ? data.citations
        : [];

    let sources = "";

    if (citations.length) {
        citations.forEach(c => {
            sources += `

            <div
                class="source-card"
                data-citation="${encodeURIComponent(JSON.stringify(c))}"
            >

                <h4>
                    [${c.id}] 📄 ${escapeHtml(c.source)}
                </h4>

                <p>
                    Page ${escapeHtml(String(c.page))}
                </p>

                <small>
                    Click to view citation
                </small>

                ${c.url ? `<a class="source-link" href="${escapeHtml(getPdfUrl(c.url, c.page))}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">Open PDF at page ${escapeHtml(String(c.page))}</a>` : ""}

            </div>

            `;
        });
    } else {
        sources = `
            <p class="no-sources">No citation sources were returned for this answer.</p>
        `;
    }

    chatContainer.innerHTML += `

        <div class="bot-message">

            <h3>
                Answer
            </h3>

            <p>
                ${escapeHtml(data.answer)}
            </p>

            <div class="sources">

                <h3>
                    Sources
                </h3>

                ${sources}

            </div>

        </div>

    `;

    document.getElementById(
        "question"
    ).value = "";

    chatContainer.scrollTop =
        chatContainer.scrollHeight;

    document.querySelectorAll(
        ".source-card"
    ).forEach(card => {
        card.addEventListener(
            "click",
            () => {
                const citation = JSON.parse(
                    decodeURIComponent(
                        card.dataset.citation
                    )
                );
                showCitation(citation);
            }
        );
    });
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getPdfUrl(url, page) {
    if (!url) {
        return "";
    }

    let normalized = String(url).trim();

    if (normalized.startsWith("s3://")) {
        const path = normalized.slice(5);
        const [bucket, ...rest] = path.split("/");
        const key = rest.join("/");
        normalized = `https://${bucket}.s3.ap-south-1.amazonaws.com/${key}`;
    }

    if (!/^https?:\/\//i.test(normalized) && !normalized.startsWith("/")) {
        normalized = `/frontend/${normalized}`;
    }

    if (page && Number(page) > 0) {
        const pageValue = encodeURIComponent(String(page));
        const hashIndex = normalized.indexOf("#");

        if (hashIndex >= 0) {
            const beforeHash = normalized.slice(0, hashIndex);
            let fragment = normalized.slice(hashIndex + 1);

            if (/\bpage=/.test(fragment)) {
                fragment = fragment.replace(/\bpage=[^&]*/g, `page=${pageValue}`);
            } else {
                fragment = fragment ? `${fragment}&page=${pageValue}` : `page=${pageValue}`;
            }

            normalized = `${beforeHash}#${fragment}`;
        } else {
            normalized += `#page=${pageValue}`;
        }
    }

    return normalized;
}

function showCitation(citation) {

    document.getElementById(
        "modal-id"
    ).innerText =
        citation.id || "N/A";

    document.getElementById(
        "modal-source"
    ).innerText =
        citation.source || "Unknown";

    document.getElementById(
        "modal-page"
    ).innerText =
        citation.page || "N/A";

    document.getElementById(
        "modal-snippet"
    ).innerText =
        citation.snippet || "No evidence snippet available.";

    const openDocumentLink =
        document.getElementById(
            "open-document"
        );

    const pdfUrl = getPdfUrl(
        citation.url,
        citation.page
    );

    if (pdfUrl) {
        openDocumentLink.href = pdfUrl;
        openDocumentLink.style.display = "inline-block";
    } else {
        openDocumentLink.href = "javascript:void(0);";
        openDocumentLink.style.display = "none";
    }

    document.getElementById(
        "citation-modal"
    ).style.display =
        "flex";
}

function closeCitation() {

    document.getElementById(
        "citation-modal"
    ).style.display =
        "none";
}
window.onload = function(){

    const modal =
        document.getElementById(
            "citation-modal"
        );

    if(modal){

        modal.style.display =
            "none";

    }
}
