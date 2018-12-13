import prism from 'prismjs';
import dropdown from './common/dropdown';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism.css';
import './index.scss';

const title = "Advertiser List";
const url = "api/advertisers";
const allowedFormats = ["JSON", "XML"];
let selectedFormat = allowedFormats[0];
const responseFields = ["status", "statusText"];
const responseHeaderFields = ["vary", "allow", "content-type"];

renderView();
handleDropdownChange({ value: selectedFormat });

function handleDropdownChange(selectedOption) {
    selectedFormat = selectedOption.value;
    fetchGet(`${url}/?format=${selectedOption.value}`).then(response => {
        updateRequestHeaders(response.responseFields, response.responseHeaderFields);
        updateRequestContent(selectedOption.value, response.data);
    });
}

function updateRequestHeaders(responseFields, responseHeaderFields) {
    document.querySelector('#request-headers').innerHTML =
        `<code class="language-json">${Object.keys(responseFields).map(key => responseFields[key]).join(" ")}
${Object.keys(responseHeaderFields).map(key => key + ": " + responseHeaderFields[key]).join("\n")}</code>`;
}

function updateRequestContent(format, content) {
    const block = document.querySelector('#request-content');
    const link = document.querySelector('#request');

    if (format === "JSON") {
        link.innerHTML = `<code class="language-http">GET api/advertisers/?format=${format}</code>`;
        block.innerHTML = `<code class="language-json">${content}</code>`;
    }

    if (format === "XML") {
        link.innerHTML = `<code class="language-http">GET api/advertisers/?format=${format}</code>`;
        block.innerHTML = `<code class="language-markup"><script type="text/plain" class="language-markup">${content}</script></code>`;
    }

    prism.highlightAll();
}

function renderView() {
    document.querySelector('#request-title').innerHTML = title;
    dropdown(document.querySelector('#formats'), handleDropdownChange, allowedFormats.map(a => ({ label: a.toLowerCase(), value: a })), selectedFormat);
}

function fetchGet(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                return response.text().then(data => {
                    const fields = {};
                    const headerFields = {};
                    responseFields.forEach(field => {
                        fields[field] = response[field]
                    });
                    responseHeaderFields.forEach(field => {
                        headerFields[field] = response.headers.get(field);
                    });
                    return resolve({
                        responseFields: fields,
                        responseHeaderFields: headerFields,
                        ok: response.ok,
                        data,
                    });
                });
            })
            .catch((error) => {
                document.querySelector('#request').innerHTML = "Ooops, something went wrong. Try disable adBlock";
                reject({
                    networkError: error.message,
                })
            });
    });
}