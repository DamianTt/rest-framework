import './dropdown.scss';

function dropdown(element, onChange, options, value) {
    const select = document.createElement("select");
    select.className = "dropdown-component";

    select.onchange = function () {
        onChange(this);
    };

    options.forEach(option => {
        const element = document.createElement("option");
        element.value = option.value;
        element.innerHTML = option.label;

        select.appendChild(element);
    });

    if (value !== undefined) {
        select.value = value;
    }
    element.appendChild(select);
}

export default dropdown;