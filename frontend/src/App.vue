<script setup>
import { ref, onMounted } from 'vue'
import Board from './components/Board.vue'
import Header from '@/components/Header.vue'
import Modal from '@/components/Modal.vue'

const tags = ref([])
const columns = ref([])
const modalRef = ref(null)

const title = 'My Kanban Board'

function showModal(task = null, columnId = null) {
    if (modalRef.value) {
        modalRef.value.showModal(task, columnId)
    }
}

function triggerEdit(taskId) {
    for (let column of columns.value) {
        const index = column.tasks.findIndex(t => t.id === taskId)
        if (index > -1) {
            const task = column.tasks[index]
            showModal(task)
            return
        }
    }
}

async function loadTags() {
    try {
        const response = await fetch('/api/tags');
        const data = await response.json();
        tags.value = data;
    } catch (error) {
        console.error('Error loading tags:', error);
    }
}

async function loadColumns() {
    try {
        const response = await fetch('/api/columns');
        const data = await response.json();
        columns.value = data;
    } catch (error) {
        console.error('Error loading columns:', error);
    }
}

async function createTask(columnId, taskTitle, taskText, taskTags) {
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                column: columnId,
                title: taskTitle,
                text: taskText,
                taskTags: taskTags,
            }),
        });
        const data = await response.json();
        loadColumns();
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

async function editTask(taskId, taskTitle, taskText, taskTags) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: taskTitle,
                text: taskText,
                taskTags: taskTags,
            }),
        });
        loadColumns();
    } catch (error) {
        console.error('Error editing task:', error);
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
        });
        loadColumns();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

async function moveTask(taskId, newColumnId) {
    try {
        const response = await fetch(`/api/move-task/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newColumnId: newColumnId,
            }),
        });
        loadColumns();
    } catch (error) {
        console.error('Error moving task:', error);
    }
}

onMounted(() => {
    loadTags()
    loadColumns()
})
</script>

<template>
    <Header :title="title" @show-modal="showModal" />
    <Board :columns="columns" @move-task="moveTask" @trigger-edit="triggerEdit" @delete-task="deleteTask"/>
    <Modal :tags="tags" :columns="columns" ref="modalRef" @create-task="createTask" @edit-task="editTask"/>
</template>