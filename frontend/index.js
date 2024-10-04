import { backend } from 'declarations/backend';

const form = document.getElementById('add-item-form');
const input = document.getElementById('new-item');
const list = document.getElementById('shopping-list');

async function loadItems() {
    const items = await backend.getItems();
    list.innerHTML = '';
    items.forEach(item => {
        const li = createListItem(item);
        list.appendChild(li);
    });
}

function createListItem(item) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="${item.completed ? 'completed' : ''}">${item.name}</span>
        <div>
            <button class="toggle-btn" data-id="${item.id}">
                <i class="fas ${item.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
            </button>
            <button class="delete-btn" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return li;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (name) {
        await backend.addItem(name);
        input.value = '';
        loadItems();
    }
});

list.addEventListener('click', async (e) => {
    if (e.target.closest('.toggle-btn')) {
        const id = Number(e.target.closest('.toggle-btn').dataset.id);
        await backend.toggleItem(id);
        loadItems();
    } else if (e.target.closest('.delete-btn')) {
        const id = Number(e.target.closest('.delete-btn').dataset.id);
        await backend.deleteItem(id);
        loadItems();
    }
});

loadItems();
