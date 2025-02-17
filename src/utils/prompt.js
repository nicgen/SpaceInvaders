export default class PlayerNamePrompt {
    constructor() {
        this.createModal();
    }

    createModal() {
        // Create modal elements
        this.modal = document.createElement('div');
        this.modal.className = 'name-prompt-modal';

        const content = document.createElement('div');
        content.className = 'modal-content';

        const title = document.createElement('h2');
        title.textContent = 'Enter Your Name';

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.maxLength = 8;
        this.input.placeholder = '3-8 characters';

        this.message = document.createElement('p');
        this.message.className = 'error-message';

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.onclick = () => this.validateAndSubmit();

        // Assemble modal
        content.appendChild(title);
        content.appendChild(this.input);
        content.appendChild(this.message);
        content.appendChild(submitButton);
        this.modal.appendChild(content);

    }

    async show() {
        return new Promise((resolve) => {
            this.modal.style.display = 'block';
            this.input.value = '';
            this.message.textContent = '';

            this.resolve = resolve;

            document.body.appendChild(this.modal);
            this.input.focus();
        });
    }

    validateAndSubmit() {
        const name = this.input.value.trim();

        if (name.length < 3) {
            this.message.textContent = 'Name must be at least 3 characters';
            return;
        }

        if (name.length > 8) {
            this.message.textContent = 'Name must be 8 characters or less';
            return;
        }

        this.modal.style.display = 'none';
        this.resolve(name);
    }
}