<script setup>

const BUTTON_TOGGLE_MODAL_ID = 'buttonToggleModal' // for the button that opens the modal

defineProps({
    title: {
        type: String,
        required: true
    }
});
</script>

<template>
    <nav class="navbar bg-light">
        <div class="container-fluid">
            <!-- logo -->
            <!-- <span class="navbar-brand mb-0 h1">
                <img src="../assets/logo.svg" alt="Logo" width="24" height="24" class="d-inline-block align-text-top">
                {{ title }}
            </span> -->

           
            <button :id="BUTTON_TOGGLE_MODAL_ID" class="d-flex btn btn-outline-primary" @click="$emit('showModal')">Create new task</button>
        </div>
    </nav>
</template>