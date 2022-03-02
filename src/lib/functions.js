module.exports.makeResponse = (text, entities) => {
    let responseText = "";
    entities = entities || [];
    let startText = "";
    let endText = "";

    for (let i in text) {
        for (let el of entities) {
            if (el.offset === +i) {
                if (el.type === "bold") {
                    startText += "<b>";
                } else if (el.type === "underline") {
                    startText += "<u>";
                } else if (el.type === "strikethrough") {
                    startText += "<s>";
                } else if (el.type === "text_link") {
                    startText += `<a href="${el.url}">`;
                } else if (el.type === "code") {
                    startText += "<code>";
                } else if (el.type === "italic") {
                    startText += "<i>";
                }
            } else if (el.offset + el.length - 1 === +i) {
                if (el.type === "bold") {
                    endText = "</b>" + endText;
                } else if (el.type === "underline") {
                    endText = "</u>" + endText;
                } else if (el.type === "strikethrough") {
                    endText = "</s>" + endText;
                } else if (el.type === "text_link") {
                    endText = "</a>" + endText;
                } else if (el.type === "code") {
                    endText = "</code>" + endText;
                } else if (el.type === "italic") {
                    endText = "</i>" + endText;
                }
            }
        }

        responseText += startText + text[i] + endText;
        startText = "";
        endText = "";
    }

    return responseText;
};
