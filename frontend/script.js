const chatContainer =
    document.getElementById(
        "chat-container"
    );

async function askQuestion() {

    const question =
        document.getElementById(
            "question"
        ).value;

    if (!question) return;

    chatContainer.innerHTML += `

        <div class="user-message">

            ${question}

        </div>

    `;

    const response =
        await fetch(
            "http://127.0.0.1:8000/chat",
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

    let sources = "";

    data.citations.forEach(c => {

                sources += `

        <div class="source-card">

            <h4>
                [${c.id}] 📄 ${c.source}
            </h4>

            <p>
                Page ${c.page}
            </p>

            <strong>
                Retrieved Evidence
            </strong>

            <small>
                ${c.snippet}
            </small>

        </div>

        `;
    });

    chatContainer.innerHTML += `

        <div class="bot-message">

            <h3>
                Answer
            </h3>

            <p>
                ${data.answer}
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
}